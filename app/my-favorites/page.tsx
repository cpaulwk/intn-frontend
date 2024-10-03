'use client';

import React from 'react';
import IdeaList from '../components/ideas/IdeaList';
import PageLayout from '../components/layout/PageLayout';
import { useIdeas } from '../hooks/useIdeas';
import { useAuth } from '../hooks/useAuth';
import { useIdeaScroll } from '../hooks/useIdeaScroll';

const MyFavorites: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { handleUpvote, upvotedIdeas, isLoading, error } = useIdeas();
  const { registerIdeaRef } = useIdeaScroll();

  return (
    <PageLayout
      title="My Favorites"
      isLoading={isLoading}
      error={error}
      isAuthenticated={isAuthenticated}
    >
      {upvotedIdeas.length > 0 ? (
        <IdeaList
          ideas={upvotedIdeas}
          isAuthenticated={isAuthenticated}
          handleUpvote={handleUpvote}
          registerIdeaRef={registerIdeaRef}
        />
      ) : (
        <p className="text-center text-gray-600">
          You haven't upvoted any ideas yet.
        </p>
      )}
    </PageLayout>
  );
};

export default MyFavorites;
