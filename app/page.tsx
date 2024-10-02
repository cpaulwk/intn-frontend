'use client';

import React, { useEffect, useCallback } from 'react';
import Header from './components/common/Header';
import IdeaList from './components/ideas/IdeaList';
import IdeaSubmissionForm from './components/ideas/IdeaSubmissionForm';
import PageLayout from './components/layout/PageLayout';
import { useIdeas } from './hooks/useIdeas';
import { useAuth } from './hooks/useAuth';
import { useIdeaScroll } from './hooks/useIdeaScroll';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const { ideas, isLoading, error, handleUpvote } = useIdeas();
  const { isAuthenticated } = useAuth();
  const { registerIdeaRef: originalRegisterIdeaRef, scrollToIdea } =
    useIdeaScroll();
  const searchParams = useSearchParams();

  console.log('registerIdeaRef in Home:', typeof originalRegisterIdeaRef);

  const memoizedRegisterIdeaRef = useCallback(
    (id: string, element: HTMLDivElement | null) => {
      console.log('Memoized registerIdeaRef called:', id, element);
      originalRegisterIdeaRef(id, element);
    },
    [originalRegisterIdeaRef]
  );

  useEffect(() => {
    const scrollToId = searchParams.get('scrollTo');
    if (scrollToId) {
      scrollToIdea(scrollToId);
    }
  }, [searchParams, scrollToIdea]);

  return (
    <PageLayout>
      <Header />
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <IdeaList
          ideas={ideas}
          isAuthenticated={isAuthenticated}
          handleUpvote={handleUpvote}
          registerIdeaRef={memoizedRegisterIdeaRef}
        />
      )}
      <IdeaSubmissionForm />
    </PageLayout>
  );
}
