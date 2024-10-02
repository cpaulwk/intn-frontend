'use client';

import React from 'react';
import Header from '../components/common/Header';
import IdeaList from '../components/ideas/IdeaList';
import PageLayout from '../components/layout/PageLayout';
import { useIdeas } from '../hooks/useIdeas';
import { useAuth } from '../hooks/useAuth';
import { useIdeaScroll } from '../hooks/useIdeaScroll';
import { Idea } from '../types';

const MySubmissions: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { handleUpvote, submittedIdeas, isLoading, error, deleteIdea } =
    useIdeas();
  const { registerIdeaRef } = useIdeaScroll();

  const handleDelete = async (idea: Idea) => {
    try {
      await deleteIdea(idea._id.toString());
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  return (
    <PageLayout>
      <Header />
      <h2 className="mb-6 mt-4 text-center text-2xl font-bold">
        My Submissions
      </h2>
      <div className="w-full flex-1 justify-center">
        {isAuthenticated ? (
          isLoading ? (
            <p className="text-center text-gray-600">
              Loading your submissions...
            </p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : submittedIdeas.length > 0 ? (
            <IdeaList
              ideas={submittedIdeas}
              isAuthenticated={isAuthenticated}
              handleUpvote={handleUpvote}
              registerIdeaRef={registerIdeaRef}
              onDelete={handleDelete}
            />
          ) : (
            <p className="text-center text-gray-600">
              You haven't submitted any ideas yet.
            </p>
          )
        ) : (
          <p className="text-center text-gray-600">
            Please log in to view your submissions.
          </p>
        )}
      </div>
    </PageLayout>
  );
};

export default MySubmissions;
