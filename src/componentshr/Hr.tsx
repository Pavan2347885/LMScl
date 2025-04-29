import React, { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search, Edit, Archive, RefreshCw, Mail, Phone, Building, User, Calendar, Link } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { getHRs, archiveHR, updateHR, addHR } from '@/services/api';
import { Switch } from '@headlessui/react';

interface HR {
  linkedin: any;
  position: string;
  company_description: string;
  company_name: string;
  mobile: string;
  _id: string;
  id: number;
  hrname: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined?: string | null;
  last_login?: string | null;
  password?: string;
  is_archived?: boolean;
}

export const HRs: React.FC = () => {
  const [hrData, setHRData] = useState<HR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<HR>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'N/A';
    }
  };

  const fetchHRs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHRs();
      if (Array.isArray(data)) {
        setHRData(data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load HR data');
      toast.error('Failed to load HR data');
      setHRData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHRs();
  }, [fetchHRs]);

  const handleArchive = async (id: string) => {
    try {
      if (!window.confirm("Are you sure to archive this HR?")) return;
      await archiveHR(id);
      toast.success("HR archived successfully");
      fetchHRs();
      
    } catch (err) {
      toast.error("Failed to archive HR");
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const startEditing = (hr: HR) => {
    setEditingId(hr._id);
    setEditForm({
      hrname: hr.hrname,
      email: hr.email,
      first_name: hr.first_name,
      last_name: hr.last_name,
      is_active: hr.is_active,
      mobile: hr.mobile,
      company_name: hr.company_name,
      company_description: hr.company_description,
      position: hr.position,
      linkedin: hr.linkedin
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    try {
      await updateHR(id, editForm);
      toast.success("HR updated successfully");
      cancelEditing();
      fetchHRs();
    } catch (err) {
      toast.error("Failed to update HR");
    }
  };

  const handleAddHR = async () => {
    try {
      await addHR(editForm);
      toast.success("HR added successfully");
      fetchHRs();
      setEditForm({});
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to add HR");
    }
  };

  const filteredHRs = hrData.filter(hr => {
    const search = searchTerm.toLowerCase();
    return (
      hr.hrname?.toLowerCase().includes(search) ||
      hr.email?.toLowerCase().includes(search) ||
      hr.first_name?.toLowerCase().includes(search) ||
      hr.last_name?.toLowerCase().includes(search) ||
      hr.id?.toString().includes(search)
    );
  });

  const toggleActiveStatus = async (hr: HR) => {
    try {
      const newStatus = !hr.is_active;
      await updateHR(hr._id, { is_active: newStatus });
      toast.success(`HR marked as ${newStatus ? 'Active' : 'Inactive'}`);
      
      // Update local state immediately
      setHRData(prev => prev.map(item => 
        item._id === hr._id ? { ...item, is_active: newStatus } : item
      ));
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'HR';
  };

  return (
    <div className="page-container p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">HR Management</h1>
        <p className="text-muted-foreground mt-1">View and manage HR users</p>
      </header>

      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search HRs..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={fetchHRs}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Add New HR</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New HR</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="username" className="text-right">
                  Username
                </label>
                <Input
                  id="username"
                  name="hrname"
                  value={editForm.hrname || ''}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  value={editForm.email || ''}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="first_name" className="text-right">
                  First Name
                </label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={editForm.first_name || ''}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="last_name" className="text-right">
                  Last Name
                </label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={editForm.last_name || ''}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="password" className="text-right">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={editForm.password || ''}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="is_active" className="text-right">
                  Active
                </label>
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={editForm.is_active || false}
                  onChange={handleEditChange}
                  className="h-4 w-4"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddHR}>Add HR</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHRs.length > 0 ? (
            filteredHRs.map((hr) => (
              <Card key={hr._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{getInitials(hr.first_name, hr.last_name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{hr.hrname}</CardTitle>
            <div className="text-sm text-muted-foreground">{hr.email}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Switch
              checked={hr.is_active}
              onChange={() => toggleActiveStatus(hr)}
            />
            <Badge variant={hr.is_active ? "default" : "destructive"}>
              {hr.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => startEditing(hr)}>
                <Edit className="mr-2 w-4 h-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleArchive(hr._id)}>
                <Archive className="mr-2 w-4 h-4" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    
                    <div className="flex items-center">
                        
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      
                      <span>
                        {editingId === hr._id ? (
                            
                          <><div className="flex items-center gap-2 mt-3">
                          <button
                            type="button"
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${editForm.is_active ? 'bg-green-500 focus:ring-green-500' : 'bg-gray-200 focus:ring-gray-500'}`}
                            onClick={() => setEditForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${editForm.is_active ? 'translate-x-4' : 'translate-x-1'}`}
                            />
                          </button>
                          <span className={`text-sm font-medium ${editForm.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                            {editForm.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div><div className="flex space-x-2 mt-3">
                                            <Input
                                                name="first_name"
                                                value={editForm.first_name || ''}
                                                onChange={handleEditChange}
                                                placeholder="First Name" />
                                            <Input
                                                name="last_name"
                                                value={editForm.last_name || ''}
                                                onChange={handleEditChange}
                                                placeholder="Last Name" />
                                        </div></>
                        ) : (
                          `${hr.first_name || ''} ${hr.last_name || ''}`.trim() || 'N/A'
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {editingId === hr._id ? (
                          <Input 
                            name="mobile" 
                            value={editForm.mobile || ''} 
                            onChange={handleEditChange} 
                            placeholder="Mobile Number"
                          />
                        ) : hr.mobile || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {editingId === hr._id ? (
                          <Input 
                            name="company_name" 
                            value={editForm.company_name || ''} 
                            onChange={handleEditChange} 
                            placeholder="Company Name"
                          />
                        ) : hr.company_name || 'N/A'}
                      </span>
                    </div>
                    {hr.company_description && (
                      <div className="flex items-start">
                        <Building className="mr-2 h-4 w-4 text-muted-foreground mt-1" />
                        <span className="text-sm">
                          {editingId === hr._id ? (
                            <Input 
                              name="company_description" 
                              value={editForm.company_description || ''} 
                              onChange={handleEditChange} 
                            />
                          ) : hr.company_description}
                        </span>
                      </div>
                    )}
                    {hr.position && (
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {editingId === hr._id ? (
                            <Input 
                              name="position" 
                              value={editForm.position || ''} 
                              onChange={handleEditChange} 
                            />
                          ) : hr.position}
                        </span>
                      </div>
                    )}
                    {hr.linkedin && (
                      <div className="flex items-center">
                        <Link className="mr-2 h-4 w-4 text-muted-foreground" />
                        <a href={hr.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Joined: {formatDate(hr.date_joined)}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last login: {formatDate(hr.last_login)}</span>
                    </div>
                  </div>
                </CardContent>
                {editingId === hr._id && (
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
                    <Button onClick={() => saveEdit(hr._id)}>Save</Button>
                  </CardFooter>
                )}
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">No HR users found.</div>
          )}
        </div>
      )}
    </div>
  );
};