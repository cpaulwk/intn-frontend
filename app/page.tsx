'use client';

import React, { useEffect } from 'react';
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
  const { registerIdeaRef, scrollToIdea } = useIdeaScroll();
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollToId = searchParams.get('scrollTo');
    if (scrollToId) {
      scrollToIdea(scrollToId);
    }
  }, [searchParams, scrollToIdea]);

  return (
    <PageLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <IdeaList
              ideas={ideas}
              isAuthenticated={isAuthenticated}
              handleUpvote={handleUpvote}
              registerIdeaRef={registerIdeaRef}
            />
          )}
        </div>
        <IdeaSubmissionForm />
      </div>
    </PageLayout>
  );
}
