'use client';

import React from 'react';
import Header from '../components/common/Header';
import IdeaList from '../components/ideas/IdeaList';
import PageLayout from '../components/layout/PageLayout';
import { useIdeas } from '../hooks/useIdeas';
import { useAuth } from '../hooks/useAuth';

const MyFavorites: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { handleUpvote, upvotedIdeas, isLoading, error } = useIdeas();

  return (
    <PageLayout>
      <Header />
      <h2 className="mb-6 mt-4 text-center text-2xl font-bold">My Favorites</h2>
      {isAuthenticated ? (
        isLoading ? (
          <p className="text-center text-gray-600">
            Loading your favorite ideas...
          </p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : upvotedIdeas.length > 0 ? (
          <IdeaList
            ideas={upvotedIdeas}
            isAuthenticated={isAuthenticated}
            handleUpvote={handleUpvote}
          />
        ) : (
          <p className="text-center text-gray-600">
            You haven't upvoted any ideas yet.
          </p>
        )
      ) : (
        <p className="text-center text-gray-600">
          Please log in to view your favorite ideas.
        </p>
      )}
    </PageLayout>
  );
};

export default MyFavorites;
