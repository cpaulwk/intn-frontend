"use client"

import Header from './components/Header';
import IdeaList from './components/IdeaList';
import IdeaSubmissionForm from './components/IdeaSubmissionForm';
import Sidebar from './components/Sidebar';
import { setUser } from './features/auth/authSlice';
import { AppDispatch } from './store';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkAuthStatus } from './utils/auth';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
