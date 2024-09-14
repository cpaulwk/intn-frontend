'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppDispatch } from './store';
import { setUser } from './slices/authSlice';
import { checkAuthStatus } from './utils/auth';
import Header from './components/common/Header';
import IdeaList from './components/ideas/IdeaList';
import IdeaSubmissionForm from './components/ideas/IdeaSubmissionForm';
import PageLayout from './components/layout/PageLayout';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <PageLayout>
      <Header />
      <IdeaList />
      <IdeaSubmissionForm />
    </PageLayout>
  );
}
