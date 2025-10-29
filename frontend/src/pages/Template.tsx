'use client';

import React, { useState } from 'react';
import Navbar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';

interface TemplateProps {
  children: React.ReactNode;
  onGameSelect?: (type: string, id: number) => void;
}

const Template: React.FC<TemplateProps> = ({ children, onGameSelect }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex flex-1 pt-16 relative">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar}
          onToggle={toggleSidebar}
          onGameSelect={onGameSelect}
        />

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}
  
        <main className={`flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ${isSidebarOpen ? 'lg:ml-80' : 'ml-0'}`}>
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Template;