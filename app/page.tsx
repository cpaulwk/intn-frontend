"use client"

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppDispatch } from './store';
import { setUser } from './features/auth/authSlice';
import { checkAuthStatus } from './utils/auth';
import Header from './components/common/Header';
import IdeaList from './components/ideas/IdeaList';
import IdeaSubmissionForm from './components/ideas/IdeaSubmissionForm';
import Sidebar from './components/common/Sidebar';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuthStatus(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const userDataParam = searchParams.get('userData');
    if (userDataParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataParam));
        dispatch(setUser(userData));
        router.replace(window.location.pathname);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [searchParams, router, dispatch]);

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
}