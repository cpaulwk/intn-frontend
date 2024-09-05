// app/page.tsx
"use client"

import React, { useState } from 'react';
import Header from './components/Header';
import IdeaList from './components/IdeaList';
import IdeaSubmissionForm from './components/IdeaSubmissionForm';
import Sidebar from './components/Sidebar';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {!sidebarOpen && (
          <button
            className="fixed top-4 left-4 z-20 p-2 text-gray-600 hover:text-gray-800"
            onClick={toggleSidebar}
          >
            ☰
          </button>
        )}
        <div className="flex-1 overflow-y-auto">
          <div className={`max-w-2xl mx-auto p-4 ${sidebarOpen ? 'w-[calc(100%-16rem)]' : 'w-full'}`}>
            <Header />
            <IdeaList />
          </div>
        </div>
        <div className={`max-w-3xl mx-auto mb-6 ${sidebarOpen ? 'w-[calc(100%-16rem)]' : 'w-full'}`}>
          <IdeaSubmissionForm />
        </div>
      </div>
    </div>
  );
}
