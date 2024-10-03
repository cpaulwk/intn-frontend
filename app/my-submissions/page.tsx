'use client';

import React from 'react';
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

  const handleEdit = async (idea: Idea) => {
    try {
      console.log('Editing idea:', idea);
    } catch (error) {
      console.error('Error editing idea:', error);
    }
  };

  return (
    <PageLayout title="My Submissions">
      <div className="h-full overflow-y-auto">
        {isAuthenticated ? (
          isLoading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : submittedIdeas.length > 0 ? (
            <IdeaList
              ideas={submittedIdeas}
              isAuthenticated={isAuthenticated}
              handleUpvote={handleUpvote}
              registerIdeaRef={registerIdeaRef}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ) : (
            <p className="text-center text-gray-600">No ideas found.</p>
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
