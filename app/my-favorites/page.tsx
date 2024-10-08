'use client';

import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import IdeaList from '../components/ideas/IdeaList';
import PageLayout from '../components/layout/PageLayout';
import { useAuth } from '../hooks/useAuth';
import { useIdeas } from '../hooks/useIdeas';
import { useIdeaScroll } from '../hooks/useIdeaScroll';
import { selectUpvotedIdeas } from '../slices/ideaSlice';

function MyFavoritesContent() {
  const { isAuthenticated } = useAuth();
  const { handleUpvote, isLoading, error } = useIdeas();
  const { registerIdeaRef } = useIdeaScroll();
  const upvotedIdeas = useSelector(selectUpvotedIdeas);

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
          You haven&apos;t upvoted any ideas yet.
        </p>
      )}
    </PageLayout>
  );
}

const MyFavorites: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyFavoritesContent />
    </Suspense>
  );
};

MyFavorites.displayName = 'MyFavorites';

export default MyFavorites;
