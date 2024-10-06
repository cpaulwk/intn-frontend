'use client';

import React from 'react';
import IdeaList from '../components/ideas/IdeaList';
import PageLayout from '../components/layout/PageLayout';
import { useIdeas } from '../hooks/useIdeas';
import { useAuth } from '../hooks/useAuth';
import { useIdeaScroll } from '../hooks/useIdeaScroll';

const MySubmissions: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { handleUpvote, submittedIdeas, isLoading, error } = useIdeas();
  const { registerIdeaRef } = useIdeaScroll();

  return (
    <PageLayout
      title="My Submissions"
      isLoading={isLoading}
      error={error}
      isAuthenticated={isAuthenticated}
    >
      {submittedIdeas.length > 0 ? (
        <IdeaList
          type="submissions"
          ideas={submittedIdeas}
          isAuthenticated={isAuthenticated}
          handleUpvote={handleUpvote}
          registerIdeaRef={registerIdeaRef}
        />
      ) : (
        <p className="text-center text-gray-600">
          You haven&apos;t submitted any ideas yet.
        </p>
      )}
    </PageLayout>
  );
};

export default MySubmissions;
