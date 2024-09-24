'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch } from './store';
import Header from './components/common/Header';
import IdeaList from './components/ideas/IdeaList';
import IdeaSubmissionForm from './components/ideas/IdeaSubmissionForm';
import PageLayout from './components/layout/PageLayout';
import { checkAuthStatus } from './utils/auth';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    const authenticateUser = async () => {
      await checkAuthStatus(dispatch);
      router.replace(window.location.pathname);
    };

    authenticateUser();
  }, [dispatch, router]);

  return (
    <PageLayout>
      <Header />
      <IdeaList />
      <IdeaSubmissionForm />
    </PageLayout>
  );
}
