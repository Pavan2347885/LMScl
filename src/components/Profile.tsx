
import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  Book,
  Award,
  BarChart,
  FileText
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock user data
const userData = {
  name: 'Naveen Kumar',
  email: 'naveen.kumar@example.com',
  phone: '+1 (555) 123-4567',
  location: 'Bangalore, India',
  role: 'Computer Science Student',
  institution: 'Tech University',
  joinDate: '2021-09-01',
  bio: 'Passionate computer science student with interests in web development, algorithms, and artificial intelligence. Looking to build a career in software engineering.',
  avatar: 'N'
};

// Skills data
const skills = [
  { name: 'JavaScript', level: 'Advanced' },
  { name: 'React', level: 'Intermediate' },
  { name: 'Node.js', level: 'Intermediate' },
  { name: 'Python', level: 'Advanced' },
  { name: 'SQL', level: 'Intermediate' },
  { name: 'Data Structures', level: 'Advanced' },
  { name: 'Algorithms', level: 'Intermediate' },
  { name: 'Machine Learning', level: 'Beginner' }
];

// Education data
const education = [
  {
    degree: 'B.Tech in Computer Science',
    institution: 'Tech University',
    duration: '2021 - 2025',
    description: 'Specializing in Artificial Intelligence and Machine Learning',
    gpa: '3.8/4.0'
  },
  {
    degree: 'Higher Secondary',
    institution: 'City Public School',
    duration: '2019 - 2021',
    description: 'Science stream with Computer Science',
    gpa: '92%'
  }
];

// Achievements data
const achievements = [
  {
    title: 'Dean\'s List',
    date: '2022',
    description: 'Recognized for academic excellence for two consecutive semesters'
  },
  {
    title: 'Hackathon Winner',
    date: '2023',
    description: 'First place in university hackathon for developing an AI-powered study assistant'
  },
  {
    title: 'Coding Competition Finalist',
    date: '2022',
    description: 'Reached finals in national level coding competition'
  }
];

// Enrolled courses summary
const enrolledCoursesSummary = [
  { name: 'Advanced Web Development', progress: 75 },
  { name: 'Data Structures & Algorithms', progress: 45 },
  { name: 'Machine Learning Fundamentals', progress: 90 },
  { name: 'Database Design & Management', progress: 60 },
  { name: 'Mobile App Development', progress: 30 }
];

export const Profile: React.FC = () => {
  return (
    <div className="page-container">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile sidebar */}
        <div className="lg:w-1/3">
          <Card className="glass-card h-full">
            <CardHeader className="text-center pb-0">
              <div className="w-24 h-24 rounded-full bg-primary mx-auto flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-primary-foreground">{userData.avatar}</span>
              </div>
              <CardTitle className="text-2xl">{userData.name}</CardTitle>
              <div className="mt-1">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  {userData.role}
                </Badge>
              </div>
              <CardDescription className="mt-3">{userData.bio}</CardDescription>
            </CardHeader>
            
            <CardContent className="mt-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail size={18} className="mr-2 text-muted-foreground" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone size={18} className="mr-2 text-muted-foreground" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin size={18} className="mr-2 text-muted-foreground" />
                  <span>{userData.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <GraduationCap size={18} className="mr-2 text-muted-foreground" />
                  <span>{userData.institution}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar size={18} className="mr-2 text-muted-foreground" />
                  <span>Joined {new Date(userData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button variant="outline" className="w-full">Edit Profile</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Profile content */}
        <div className="lg:w-2/3">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-slide-in">
              <div className="space-y-6">
                {/* Skills section */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Briefcase size={20} className="mr-2" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge key={skill.name} variant="outline" className="py-1.5">
                          {skill.name}
                          <span className="ml-2 text-xs opacity-70">{skill.level}</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Analytics summary */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <BarChart size={20} className="mr-2" />
                      Performance Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 rounded-lg bg-secondary/50">
                        <div className="text-3xl font-bold">85%</div>
                        <div className="text-sm text-muted-foreground mt-1">Average Course Score</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-secondary/50">
                        <div className="text-3xl font-bold">12</div>
                        <div className="text-sm text-muted-foreground mt-1">Tests Completed</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-secondary/50">
                        <div className="text-3xl font-bold">8</div>
                        <div className="text-sm text-muted-foreground mt-1">Certifications</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent activities */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <FileText size={20} className="mr-2" />
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="mr-3 w-2 h-2 mt-2 rounded-full bg-primary shrink-0"></div>
                        <div>
                          <p className="font-medium">Completed Machine Learning Quiz #5</p>
                          <p className="text-sm text-muted-foreground">Yesterday at 2:30 PM</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 w-2 h-2 mt-2 rounded-full bg-primary shrink-0"></div>
                        <div>
                          <p className="font-medium">Submitted Assignment: Database Normalization</p>
                          <p className="text-sm text-muted-foreground">2 days ago</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 w-2 h-2 mt-2 rounded-full bg-primary shrink-0"></div>
                        <div>
                          <p className="font-medium">Enrolled in Mobile App Development course</p>
                          <p className="text-sm text-muted-foreground">5 days ago</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="courses" className="animate-slide-in">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Book size={20} className="mr-2" />
                    Enrolled Courses
                  </CardTitle>
                  <CardDescription>Track your progress across all courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {enrolledCoursesSummary.map((course) => (
                      <div key={course.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{course.name}</h3>
                          <span className="text-sm">{course.progress}% Complete</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-value" 
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Courses</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="education" className="animate-slide-in">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <GraduationCap size={20} className="mr-2" />
                    Education
                  </CardTitle>
                  <CardDescription>Academic background and qualifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {education.map((edu, index) => (
                      <div key={index} className="relative pl-6 pb-8 border-l border-border last:pb-0">
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                        <h3 className="font-bold text-lg">{edu.degree}</h3>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <GraduationCap size={14} className="mr-1" />
                          <span>{edu.institution}</span>
                          <span className="mx-2">•</span>
                          <span>{edu.duration}</span>
                        </div>
                        <p className="mt-2">{edu.description}</p>
                        <div className="mt-1 text-sm">
                          <span className="font-medium">GPA/Score:</span> {edu.gpa}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements" className="animate-slide-in">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Award size={20} className="mr-2" />
                    Achievements
                  </CardTitle>
                  <CardDescription>Recognitions and accomplishments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-bold">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.date}</p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Award size={20} className="text-primary" />
                          </div>
                        </div>
                        <p className="mt-3 text-sm">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
