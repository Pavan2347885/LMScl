import React, { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, Edit, Archive, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { teachers, archiveTeacher, updateTeacher, addTeacher } from '@/services/api';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Teacher {
  _id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password?: string;
  is_active: boolean;
  role: string;
}

export const Teachers: React.FC = () => {
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Teacher>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teachers();
      setTeachersData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      toast.error('Failed to load teacher data');
      setError('Failed to load teacher data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddTeacher = async () => {
    try {
      await addTeacher(editForm);
      toast.success('Teacher added successfully');
      fetchTeachers();
      setIsModalOpen(false);
      setEditForm({});
    } catch (error) {
      toast.error('Failed to add teacher');
    }
  };

  const handleArchive = async (id: string) => {
    if (!window.confirm('Are you sure you want to archive this teacher?')) return;
    try {
      await archiveTeacher(id);
      toast.success('Teacher archived successfully');
      fetchTeachers();
    } catch (err) {
      toast.error('Failed to archive teacher');
    }
  };

  const saveEdit = async (id: string) => {
    try {
      await updateTeacher(id, editForm);
      toast.success('Teacher updated');
      setEditingId(null);
      fetchTeachers();
    } catch {
      toast.error('Update failed');
    }
  };

  const filtered = teachersData.filter(teacher =>
    [teacher.username, teacher.email, teacher.first_name, teacher.last_name]
      .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'T';
  };

  return (
    <div className="p-6">
      
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Teacher Management</h1>
          <p className="text-muted-foreground mt-1">Manage all teacher accounts</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search teachers..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-9" 
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchTeachers}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button>Add Teacher</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Teacher</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input 
                    placeholder="Username" 
                    name="username" 
                    value={editForm.username || ''} 
                    onChange={handleEditChange} 
                  />
                  <Input 
                    placeholder="Email" 
                    name="email" 
                    value={editForm.email || ''} 
                    onChange={handleEditChange} 
                  />
                  <Input 
                    placeholder="First Name" 
                    name="first_name" 
                    value={editForm.first_name || ''} 
                    onChange={handleEditChange} 
                  />
                  <Input 
                    placeholder="Last Name" 
                    name="last_name" 
                    value={editForm.last_name || ''} 
                    onChange={handleEditChange} 
                  />
                  <Input 
                    placeholder="Password" 
                    name="password" 
                    type="password" 
                    value={editForm.password || ''} 
                    onChange={handleEditChange} 
                  />
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="active" 
                      name="is_active" 
                      checked={editForm.is_active || false} 
                      onChange={handleEditChange} 
                      className="h-4 w-4"
                    />
                    <label htmlFor="active">Active</label>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddTeacher}>Add Teacher</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-destructive text-center py-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((teacher) => (
              <Card key={teacher._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>{getInitials(teacher.first_name, teacher.last_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{teacher.username || 'N/A'}</CardTitle>
                      <div className="text-sm text-muted-foreground">{teacher.email || 'N/A'}</div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { 
                        setEditingId(teacher._id); 
                        setEditForm({
                          username: teacher.username,
                          email: teacher.email,
                          first_name: teacher.first_name,
                          last_name: teacher.last_name,
                          is_active: teacher.is_active
                        }); 
                      }}>
                        <Edit className="mr-2 w-4 h-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchive(teacher._id)}>
                        <Archive className="mr-2 w-4 h-4" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Name:</span>
                      {editingId === teacher._id ? (
                        <div className="flex space-x-2">
                          <Input 
                            name="first_name" 
                            value={editForm.first_name || ''} 
                            onChange={handleEditChange} 
                            placeholder="First Name"
                            className="w-full"
                          />
                          <Input 
                            name="last_name" 
                            value={editForm.last_name || ''} 
                            onChange={handleEditChange} 
                            placeholder="Last Name"
                            className="w-full"
                          />
                        </div>
                      ) : (
                        <span>
                          {(teacher.first_name || 'N/A') + ' ' + (teacher.last_name || '')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Status:</span>
                      {editingId === teacher._id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`active-${teacher._id}`}
                            name="is_active"
                            checked={editForm.is_active || false}
                            onChange={handleEditChange}
                            className="h-4 w-4"
                          />
                          <label htmlFor={`active-${teacher._id}`}>
                            {editForm.is_active ? 'Active' : 'Inactive'}
                          </label>
                        </div>
                      ) : (
                        <Badge variant={teacher.is_active ? "default" : "destructive"}>
                          {teacher.is_active ? "Active" : "Inactive"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                {editingId === teacher._id && (
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                    <Button onClick={() => saveEdit(teacher._id)}>Save</Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        )}
      
    </div>
  );
};