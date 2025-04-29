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
import { MoreHorizontal, Search, Edit, Archive, RefreshCw, Mail, Phone, Building, User, Calendar, Link, MapPin, GraduationCap, Briefcase, Book } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { students, archiveStudent, updateStudent, addStudent } from '@/services/api';
import { Switch, Textarea } from '@headlessui/react';

interface Experience {
  _id: string;
  company_name: string;
  job_title: string;
  start_date: string;
  end_date: string;
  currently_working: boolean;
  description: string;
}

interface Project {
  _id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  currently_ongoing: boolean;
  description: string;
  link: string;
}

interface Student {
  _id: string;
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  date_joined?: string | null;
  last_login?: string | null;
  password?: string;
  "10th_board": string;
  "12th_board": string;
  "10th_school": string;
  "12th_school": string;
  "10th_Percentage": string;
  "12th_Percentage": string;
  "10th_passout_year": string;
  "12th_passout_year": string;
  Graduation_Percentage: string;
  Passout_Year: string;
  branch: string;
  ug_college: string;
  father_name: string;
  location: string;
  mobile: string;
  skills: string[];
  profile_picture: string;
  experiences: Experience[];
  projects: Project[];
}

export const Students: React.FC = () => {
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Student>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await students();
      setStudentsData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load student data');
      toast.error('Failed to load student data');
      setStudentsData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleArchive = async (id: string) => {
    try {
      if (!window.confirm("Are you sure to archive this student?")) return;
      await archiveStudent(id);
      toast.success("Student archived successfully");
      fetchStudents();
    } catch (err) {
      toast.error("Failed to archive student");
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const startEditing = (student: Student) => {
    setEditingId(student._id);
    setEditForm({
      username: student.username,
      email: student.email,
      first_name: student.first_name,
      last_name: student.last_name,
      is_active: student.is_active,
      mobile: student.mobile,
      location: student.location,
      father_name: student.father_name,
      "10th_board": student["10th_board"],
      "12th_board": student["12th_board"],
      "10th_school": student["10th_school"],
      "12th_school": student["12th_school"],
      "10th_Percentage": student["10th_Percentage"],
      "12th_Percentage": student["12th_Percentage"],
      "10th_passout_year": student["10th_passout_year"],
      "12th_passout_year": student["12th_passout_year"],
      Graduation_Percentage: student.Graduation_Percentage,
      Passout_Year: student.Passout_Year,
      branch: student.branch,
      ug_college: student.ug_college,
      skills: student.skills,
      experiences: student.experiences,
      projects: student.projects
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    try {
      await updateStudent(id, editForm);
      toast.success("Student updated successfully");
      cancelEditing();
      fetchStudents();
    } catch (err) {
      toast.error("Failed to update student");
    }
  };

  const handleAddStudent = async () => {
    try {
      await addStudent(editForm);
      toast.success("Student added successfully");
      fetchStudents();
      setEditForm({});
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to add student");
    }
  };

  const filteredStudents = studentsData.filter(student => {
    const search = searchTerm.toLowerCase();
    return (
      student.username?.toLowerCase().includes(search) ||
      student.email?.toLowerCase().includes(search) ||
      student.first_name?.toLowerCase().includes(search) ||
      student.last_name?.toLowerCase().includes(search) ||
      student.id?.toString().includes(search)
    );
  });

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'S';
  };

  return (
    <div className="page-container p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
        <p className="text-muted-foreground mt-1">View and manage student accounts</p>
      </header>

      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={fetchStudents}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Add New Student</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <Input name="username" value={editForm.username || ''} onChange={handleEditChange} placeholder="Username" />
              <Input name="password" value={editForm.password || ''} onChange={handleEditChange} placeholder="Password" />
              <Input name="email" value={editForm.email || ''} onChange={handleEditChange} placeholder="Email" />
              <Input name="first_name" value={editForm.first_name || ''} onChange={handleEditChange} placeholder="First Name" />
              <Input name="last_name" value={editForm.last_name || ''} onChange={handleEditChange} placeholder="Last Name" />
              <Input name="mobile" value={editForm.mobile || ''} onChange={handleEditChange} placeholder="Mobile" />
              <Input name="location" value={editForm.location || ''} onChange={handleEditChange} placeholder="Location" />
              <Input name="father_name" value={editForm.father_name || ''} onChange={handleEditChange} placeholder="Father's Name" />
              <Input name="10th_board" value={editForm["10th_board"] || ''} onChange={handleEditChange} placeholder="10th Board" />
              <Input name="12th_board" value={editForm["12th_board"] || ''} onChange={handleEditChange} placeholder="12th Board" />
              <Input name="10th_school" value={editForm["10th_school"] || ''} onChange={handleEditChange} placeholder="10th School" />
              <Input name="12th_school" value={editForm["12th_school"] || ''} onChange={handleEditChange} placeholder="12th School" />
              <Input name="10th_Percentage" value={editForm["10th_Percentage"] || ''} onChange={handleEditChange} placeholder="10th Percentage" />
              <Input name="12th_Percentage" value={editForm["12th_Percentage"] || ''} onChange={handleEditChange} placeholder="12th Percentage" />
              <Input name="10th_passout_year" value={editForm["10th_passout_year"] || ''} onChange={handleEditChange} placeholder="10th Passout Year" />
              <Input name="12th_passout_year" value={editForm["12th_passout_year"] || ''} onChange={handleEditChange} placeholder="12th Passout Year" />
              <Input name="Graduation_Percentage" value={editForm.Graduation_Percentage || ''} onChange={handleEditChange} placeholder="Graduation Percentage" />
              <Input name="Passout_Year" value={editForm.Passout_Year || ''} onChange={handleEditChange} placeholder="Passout Year" />
              <Input name="branch" value={editForm.branch || ''} onChange={handleEditChange} placeholder="Branch" />
              <Input name="ug_college" value={editForm.ug_college || ''} onChange={handleEditChange} placeholder="UG College" />
              <div className="md:col-span-2">
                <Textarea 
                  name="skills" 
                  value={editForm.skills?.join(', ') || ''} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, skills: e.target.value.split(', ') }))}
                  placeholder="Skills (comma separated)"
                />
              </div>
              <div className="flex items-center space-x-2 md:col-span-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={editForm.is_active || false}
                  onChange={handleEditChange}
                  className="h-4 w-4"
                />
                <label htmlFor="is_active">Active</label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddStudent}>Add Student</Button>
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
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <Card key={student._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={student.profile_picture} />
                      <AvatarFallback>{getInitials(student.first_name, student.last_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{student.username}</CardTitle>
                      <div className="text-sm text-muted-foreground truncate max-w-[180px]">{student.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center space-x-2">
                     {editingId === student._id ? (
                                             <div className="flex items-center space-x-2">
                                               <input
                                                 type="checkbox"
                                                 id={`active-${student._id}`}
                                                 name="is_active"
                                                 checked={editForm.is_active || false}
                                                 onChange={handleEditChange}
                                                 className="h-4 w-4"
                                               />
                                               <label htmlFor={`active-${student._id}`}>
                                                 {editForm.is_active ? 'Active' : 'Inactive'}
                                               </label>
                                             </div>
                                           ) : (
                                             <Badge variant={student.is_active ? "default" : "destructive"}>
                                               {student.is_active ? "Active" : "Inactive"}
                                             </Badge>
                                           )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startEditing(student)}>
                          <Edit className="mr-2 w-4 h-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleArchive(student._id)}>
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
                        {editingId === student._id ? (
                          <div className="flex space-x-2">
                            <Input 
                              name="first_name" 
                              value={editForm.first_name || ''} 
                              onChange={handleEditChange} 
                              placeholder="First Name"
                            />
                            <Input 
                              name="last_name" 
                              value={editForm.last_name || ''} 
                              onChange={handleEditChange} 
                              placeholder="Last Name"
                            />
                          </div>
                        ) : (
                          `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'N/A'
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {editingId === student._id ? (
                          <Input 
                            name="mobile" 
                            value={editForm.mobile || ''} 
                            onChange={handleEditChange} 
                          />
                        ) : student.mobile || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {editingId === student._id ? (
                          <Input 
                            name="location" 
                            value={editForm.location || ''} 
                            onChange={handleEditChange} 
                          />
                        ) : student.location || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {editingId === student._id ? (
                          <Input 
                            name="father_name" 
                            value={editForm.father_name || ''} 
                            onChange={handleEditChange} 
                          />
                        ) : student.father_name || 'N/A'}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <h4 className="text-sm font-medium flex items-center">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Education
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">10th Board</p>
                          {editingId === student._id ? (
                            <Input 
                              name="10th_board" 
                              value={editForm["10th_board"] || ''} 
                              onChange={handleEditChange} 
                              className="text-xs h-8"
                            />
                          ) : (
                            <p className="text-sm">{student["10th_board"] || 'N/A'}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">12th Board</p>
                          {editingId === student._id ? (
                            <Input 
                              name="12th_board" 
                              value={editForm["12th_board"] || ''} 
                              onChange={handleEditChange} 
                              className="text-xs h-8"
                            />
                          ) : (
                            <p className="text-sm">{student["12th_board"] || 'N/A'}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">10th %</p>
                          {editingId === student._id ? (
                            <Input 
                              name="10th_Percentage" 
                              value={editForm["10th_Percentage"] || ''} 
                              onChange={handleEditChange} 
                              className="text-xs h-8"
                            />
                          ) : (
                            <p className="text-sm">{student["10th_Percentage"] || 'N/A'}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">12th %</p>
                          {editingId === student._id ? (
                            <Input 
                              name="12th_Percentage" 
                              value={editForm["12th_Percentage"] || ''} 
                              onChange={handleEditChange} 
                              className="text-xs h-8"
                            />
                          ) : (
                            <p className="text-sm">{student["12th_Percentage"] || 'N/A'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {student.experiences?.length > 0 && (
                      <div className="border-t pt-2 mt-2">
                        <h4 className="text-sm font-medium flex items-center">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Experience
                        </h4>
                        {student.experiences.map((exp, i) => (
                          <div key={i} className="mt-2">
                            <p className="text-sm font-medium">{exp.job_title}</p>
                            <p className="text-xs text-muted-foreground">{exp.company_name}</p>
                            <p className="text-xs">{formatDate(exp.start_date)} - {exp.currently_working ? 'Present' : formatDate(exp.end_date)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {student.projects?.length > 0 && (
                      <div className="border-t pt-2 mt-2">
                        <h4 className="text-sm font-medium flex items-center">
                          <Book className="mr-2 h-4 w-4" />
                          Projects
                        </h4>
                        {student.projects.map((proj, i) => (
                          <div key={i} className="mt-2">
                            <p className="text-sm font-medium">{proj.title}</p>
                            <p className="text-xs text-muted-foreground">{proj.currently_ongoing ? 'Ongoing' : formatDate(proj.end_date)}</p>
                            {proj.link && (
                              <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">View Project</a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Joined: {formatDate(student.date_joined)}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last login: {formatDate(student.last_login)}</span>
                    </div>
                  </div>
                </CardContent>
                {editingId === student._id && (
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
                    <Button onClick={() => saveEdit(student._id)}>Save</Button>
                  </CardFooter>
                )}
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">No students found.</div>
          )}
        </div>
      )}
    </div>
  );
};