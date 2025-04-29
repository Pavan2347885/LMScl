import React from 'react';
import { Briefcase, MapPin, Clock, Building, ExternalLink, BookmarkPlus } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for jobs
const jobsData = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$90,000 - $120,000',
    postedDate: '2023-11-01',
    description: 'We are looking for a skilled Frontend Developer to join our innovative team. You will be responsible for building user interfaces for web applications.',
    requirements: ['3+ years of React experience', 'Strong JavaScript skills', 'Experience with CSS frameworks', 'Knowledge of responsive design'],
    logo: 'https://placehold.co/100?text=TC'
  },
  {
    id: 2,
    title: 'Backend Engineer',
    company: 'DataFlow Systems',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    postedDate: '2023-11-03',
    description: 'Join our backend team to design and implement scalable APIs and services that power our platform.',
    requirements: ['Experience with Node.js or Python', 'Database design knowledge', 'RESTful API development', 'Experience with cloud platforms'],
    logo: 'https://placehold.co/100?text=DF'
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'Insight Analytics',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100,000 - $130,000',
    postedDate: '2023-11-05',
    description: 'We are seeking a Data Scientist to analyze large datasets and build machine learning models to solve business problems.',
    requirements: ['Masters or PhD in relevant field', 'Experience with Python, R, and SQL', 'Machine learning expertise', 'Statistical analysis skills'],
    logo: 'https://placehold.co/100?text=IA'
  },
  {
    id: 4,
    title: 'UX/UI Designer',
    company: 'Creative Minds',
    location: 'New York, NY',
    type: 'Contract',
    salary: '$80,000 - $100,000',
    postedDate: '2023-11-07',
    description: 'Join our design team to create beautiful and intuitive user experiences for our products.',
    requirements: ['Portfolio demonstrating UX/UI skills', 'Proficiency with design tools', 'Understanding of user-centered design', 'Experience with design systems'],
    logo: 'https://placehold.co/100?text=CM'
  },
  {
    id: 5,
    title: 'Full Stack Developer',
    company: 'Nexus Technologies',
    location: 'Chicago, IL',
    type: 'Full-time',
    salary: '$95,000 - $125,000',
    postedDate: '2023-11-10',
    description: 'We need a versatile Full Stack Developer who can work on both frontend and backend aspects of our applications.',
    requirements: ['Experience with React and Node.js', 'Database management skills', 'API development experience', 'Understanding of DevOps principles'],
    logo: 'https://placehold.co/100?text=NT'
  }
];

// Calculate days since posting
const calculateDaysAgo = (postedDate: string) => {
  const today = new Date();
  const posted = new Date(postedDate);
  const diffTime = today.getTime() - posted.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

export const Jobs: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Filter jobs based on search query
  const filteredJobs = jobsData.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="page-container">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
        <p className="text-muted-foreground mt-1">Discover job opportunities tailored to your skills</p>
      </header>
      
      <div className="mb-8">
        <div className="max-w-lg mx-auto mb-6">
          <Input
            placeholder="Search jobs by title, company, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="fulltime">Full-time</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
            <TabsTrigger value="remote">Remote</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="animate-slide-in">
            <div className="space-y-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <Card key={job.id} className="glass-card card-hover overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="p-6 md:w-24 flex justify-center md:border-r md:border-border">
                        <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                          <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">{job.title}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <Building size={14} className="mr-1" />
                                {job.company}
                              </CardDescription>
                            </div>
                            <Badge>{job.type}</Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-2 text-muted-foreground" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2 text-muted-foreground" />
                              <span>{calculateDaysAgo(job.postedDate)}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm">{job.description}</p>
                          
                          <div className="pt-2">
                            <p className="text-sm font-medium mb-2">Requirements:</p>
                            <ul className="text-sm list-disc pl-4 space-y-1">
                              {job.requirements.slice(0, 2).map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between">
                          <span className="font-medium">{job.salary}</span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <BookmarkPlus size={16} className="mr-1" />
                              Save
                            </Button>
                            <Button size="sm">
                              <ExternalLink size={16} className="mr-1" />
                              Apply
                            </Button>
                          </div>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg font-medium">No jobs found matching your search criteria.</p>
                  <p className="text-muted-foreground mt-2">Try adjusting your search terms or filters.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Other tabs would filter based on job type */}
          <TabsContent value="fulltime" className="animate-slide-in">
            <div className="space-y-6">
              {filteredJobs
                .filter(job => job.type === 'Full-time')
                .map((job) => (
                  /* Same job card component as above */
                  <Card key={job.id} className="glass-card card-hover overflow-hidden">
                    {/* Job card content (same as above) */}
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="p-6 md:w-24 flex justify-center md:border-r md:border-border">
                        <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                          <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">{job.title}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <Building size={14} className="mr-1" />
                                {job.company}
                              </CardDescription>
                            </div>
                            <Badge>{job.type}</Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-2 text-muted-foreground" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2 text-muted-foreground" />
                              <span>{calculateDaysAgo(job.postedDate)}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm">{job.description}</p>
                          
                          <div className="pt-2">
                            <p className="text-sm font-medium mb-2">Requirements:</p>
                            <ul className="text-sm list-disc pl-4 space-y-1">
                              {job.requirements.slice(0, 2).map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between">
                          <span className="font-medium">{job.salary}</span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <BookmarkPlus size={16} className="mr-1" />
                              Save
                            </Button>
                            <Button size="sm">
                              <ExternalLink size={16} className="mr-1" />
                              Apply
                            </Button>
                          </div>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          {/* Other tab contents would be similar */}
          <TabsContent value="contract" className="animate-slide-in">
            {/* Contract jobs */}
          </TabsContent>
          
          <TabsContent value="remote" className="animate-slide-in">
            {/* Remote jobs */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
