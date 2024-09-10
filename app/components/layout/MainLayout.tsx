"use client"

import React, { useState } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import IdeaList from '../ideas/IdeaList';
import IdeaSubmissionForm from '../ideas/IdeaSubmissionForm';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {!isSidebarOpen && (
          <button
            className="fixed top-4 left-4 z-20 p-2 text-gray-600 hover:text-gray-800"
            onClick={toggleSidebar}
          >
            ☰
          </button>
        )}
        <div className="flex-1 overflow-y-auto">
          <div className={`max-w-2xl mx-auto p-4 ${isSidebarOpen ? 'w-[calc(100%-16rem)]' : 'w-full'}`}>
            <Header />
            <IdeaList />
          </div>
        </div>
        <div className={`max-w-3xl mx-auto mb-6 ${isSidebarOpen ? 'w-[calc(100%-16rem)]' : 'w-full'}`}>
          <IdeaSubmissionForm />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;