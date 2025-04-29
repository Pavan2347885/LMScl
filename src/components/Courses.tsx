import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, Award } from 'lucide-react';
import { Play, PlayCircle } from 'lucide-react'; // Add this import
import { Button } from '@/components/ui/button'; 
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { getCourses } from '@/services/api';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor?: string;
  teacher_name?: string;
  teacher_id?: string;
  created_at: string;
  updated_at: string;
  chapters?: any[];
  tags?: string[];
  progress?: number;
  total_chapters?: number;
  completed_lessons?: number;
  estimated_hours?: number;
  image?: string;
}

export const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        const formattedCourses = data.map((course: Course) => ({
          ...course,
          // Generate placeholder image if none exists
          image: course.image || `https://placehold.co/400x200?text=${encodeURIComponent(course.title)}`,
          // Ensure all required fields have values
          tags: course.tags || ['General'],
          instructor: course.teacher_name || 'Instructor',
          progress: course.progress || 0,
          totalLessons: course.total_chapters || 0,
          completedLessons: course.completed_lessons || 0,
          estimatedHours: course.estimated_hours || 10
        }));
        setCourses(formattedCourses);
      } catch (err) {
        setError(err.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="page-container">Loading courses...</div>;
  }

  if (error) {
    return <div className="page-container text-red-500">{error}</div>;
  }

  return (
    <div className="page-container">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Available Courses</h1>
        <p className="text-muted-foreground mt-1">Browse all our courses</p>
      </header>
      
      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No courses available at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course._id} className="glass-card card-hover overflow-hidden">
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex gap-2">
                    {course.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Instructor:</span>
                  <span>{course.instructor}</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-medium">Progress: {course.progress}%</span>
                    <span>{course.completed_lessons}/{course.total_chapters} chapters</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    />
                    <Button 
                    className="w-full mt-2" 
                    variant={course.progress === 0 ? "default" : "secondary"}
                    onClick={() => {
                      // Add your navigation/play logic here
                      console.log(`Starting course ${course._id}`);
                    }}
                  >
                    {course.progress === 0 ? (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start Learning
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Continue Learning
                      </>
                    )}
                  </Button>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4 mt-7">
                <div className="flex items-center">
                  <BookOpen size={16} className="mr-1" />
                  <span>{course.total_chapters} Chapters</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{course.estimated_hours} Hours</span>
                </div>
                <div className="flex items-center">
                  <Award size={16} className="mr-1" />
                  <span>Certificate</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};