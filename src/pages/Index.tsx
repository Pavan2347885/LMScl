
import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { Courses } from '@/components/Courses';
import { Tests } from '@/components/Tests';
import { Assignments } from '@/components/Assignments';
import { Jobs } from '@/components/Jobs';
import { Interview } from '@/components/Interview';
import { Profile } from '@/components/Profile';
import { ThemeProvider } from '@/context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("authToken"));

const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.clear(); 
    sessionStorage.clear();
    setToken(null); 
    window.location.replace("/");
    // navigate('/');
};

const location = useLocation();
console.log(location.state);

useEffect(() => {
  const savedSection = sessionStorage.getItem("activeSection");
  if (savedSection) {
    setActiveSection(savedSection);
  }
}, []);

// 💾 Persist to sessionStorage
useEffect(() => {
  sessionStorage.setItem("activeSection", activeSection);
}, [activeSection]);

// 📦 Restore from location state (on back navigation)
useEffect(() => {
  if (location.state?.section) {
    setActiveSection(location.state.section);
  }
}, [location.state]);

  // Function to render the active section
  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'courses':
        return <Courses />;
      case 'tests':
        return <Tests />;
      case 'assignments':
        return <Assignments />;
      case 'jobs':
        return <Jobs />;
     
      case 'profile':
        return <Profile />;
      case 'logout':
        
        handleLogout();
        return null;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex bg-background">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className={`flex-1 ml-16 md:ml-64 transition-all duration-300 min-h-screen`}>
          {renderSection()}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
