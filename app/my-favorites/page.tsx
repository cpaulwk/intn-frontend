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
    <PageLayout title="My Favorites">
      <div className="h-full overflow-y-auto">
        {isAuthenticated ? (
          isLoading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : upvotedIdeas.length > 0 ? (
            <IdeaList
              ideas={upvotedIdeas}
              isAuthenticated={isAuthenticated}
              handleUpvote={handleUpvote}
              registerIdeaRef={registerIdeaRef}
            />
          ) : (
            <p className="text-center text-gray-600">No ideas found.</p>
          )
        ) : (
          <p className="text-center text-gray-600">
            Please log in to view your favorite ideas.
          </p>
        )}
      </div>
    </PageLayout>
  );
};

export default MyFavorites;
