'use client';

import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';

import IdeaList from './components/ideas/IdeaList';
import IdeaSubmissionForm from './components/ideas/IdeaSubmissionForm';
import PageLayout from './components/layout/PageLayout';
import { useAuth } from './hooks/useAuth';
import { useIdeas } from './hooks/useIdeas';
import { useIdeaScroll } from './hooks/useIdeaScroll';

function HomeContent() {
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
    <PageLayout isLoading={isLoading} error={error} isAuthenticated={true}>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <IdeaList
            ideas={ideas}
            isAuthenticated={isAuthenticated}
            handleUpvote={handleUpvote}
            registerIdeaRef={registerIdeaRef}
          />
        </div>
        <IdeaSubmissionForm />
      </div>
    </PageLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
