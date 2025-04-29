
import React from 'react';
import { 
  BarChart, 
  TrendingUp, 
  BookOpen, 
  FileText, 
  Trophy,
  Calendar
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { BarChart as RechartBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts and visualizations
const progressData = [
  { name: 'Jan', progress: 65 },
  { name: 'Feb', progress: 59 },
  { name: 'Mar', progress: 80 },
  { name: 'Apr', progress: 81 },
  { name: 'May', progress: 76 },
  { name: 'Jun', progress: 85 },
  { name: 'Jul', progress: 90 },
];

const leaderboardData = [
  { rank: 1, name: 'Alex Johnson', score: 950, avatar: 'A' },
  { rank: 2, name: 'Morgan Smith', score: 890, avatar: 'M' },
  { rank: 3, name: 'Taylor Brown', score: 830, avatar: 'T' },
  { rank: 4, name: 'Jordan Lee', score: 820, avatar: 'J' },
  { rank: 5, name: 'Casey Williams', score: 810, avatar: 'C' },
];

// Simulated streak data (1 for active, 0 for inactive)
const streakData = [
  // Week 1
  [1, 1, 1, 1, 0, 0, 1],
  // Week 2
  [1, 1, 0, 1, 1, 0, 1],
  // Week 3
  [1, 1, 1, 1, 1, 0, 0],
  // Week 4
  [0, 1, 1, 1, 1, 0, 1],
  // Week 5
  [1, 1, 1, 0, 1, 0, 0],
];

// Session progress data
const sessionProgress = [
  { name: 'Front-end Development', progress: 78 },
  { name: 'Database Design', progress: 62 },
  { name: 'Advanced Algorithms', progress: 45 },
  { name: 'System Architecture', progress: 85 },
];

interface StreakCalendarProps {
  data: number[][];
}

const StreakCalendar: React.FC<StreakCalendarProps> = ({ data }) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex justify-between px-1 text-xs text-muted-foreground">
        {weekDays.map((day) => (
          <span key={day} className="w-7 text-center">{day}</span>
        ))}
      </div>
      {data.map((week, weekIndex) => (
        <div key={weekIndex} className="flex justify-between">
          {week.map((day, dayIndex) => (
            <div 
              key={`${weekIndex}-${dayIndex}`} 
              className={`w-7 h-7 m-0.5 rounded flex items-center justify-center streak-dot ${day ? 'active' : ''}`}
              style={{ animationDelay: `${(weekIndex * 7 + dayIndex) * 30}ms` }}
            >
              {day ? <div className="w-4 h-4 bg-primary rounded-sm"></div> : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const Dashboard: React.FC = () => {
  return (
    <div className="page-container">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, Naveen</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-card col-span-1 md:col-span-2 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Progress Overview
            </CardTitle>
            <CardDescription>Your monthly learning progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartBarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" name="Completion %" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </RechartBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Activity Streak
            </CardTitle>
            <CardDescription>Your daily learning activity</CardDescription>
          </CardHeader>
          <CardContent>
            <StreakCalendar data={streakData} />
            <div className="mt-4 text-center">
              <p className="font-medium">Current Streak: 3 days</p>
              <p className="text-muted-foreground text-sm">Longest: 7 days</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="glass-card md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Leaderboard
            </CardTitle>
            <CardDescription>Top performers this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((item) => (
                <div key={item.rank} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                      {item.rank}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        {item.avatar}
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </div>
                  <div className="font-bold">{item.score}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Session Progress
            </CardTitle>
            <CardDescription>Track your learning progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {sessionProgress.map((session) => (
                <div key={session.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{session.name}</span>
                    <span className="text-sm text-muted-foreground">{session.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-value" 
                      style={{ width: `${session.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
