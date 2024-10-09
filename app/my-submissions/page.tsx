'use client';

import React, { Suspense } from 'react';

import IdeaList from '../components/ideas/IdeaList';
import PageLayout from '../components/layout/PageLayout';
import { useAuth } from '../hooks/useAuth';
import { useIdeas } from '../hooks/useIdeas';
import { useIdeaScroll } from '../hooks/useIdeaScroll';

function MySubmissionsContent() {
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
}

const MySubmissions: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MySubmissionsContent />
    </Suspense>
  );
};

MySubmissions.displayName = 'MySubmissions';

export default MySubmissions;
