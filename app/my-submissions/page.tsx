'use client';

import React from 'react';
import IdeaList from '../components/ideas/IdeaList';
import PageLayout from '../components/layout/PageLayout';
import { useIdeas } from '../hooks/useIdeas';
import { useAuth } from '../hooks/useAuth';
import { useIdeaScroll } from '../hooks/useIdeaScroll';
import { Idea } from '../types';
import { useRouter } from 'next/navigation';

const MySubmissions: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { handleUpvote, submittedIdeas, isLoading, error, deleteIdea } =
    useIdeas();
  const { registerIdeaRef } = useIdeaScroll();
  const router = useRouter();

  const handleDelete = async (idea: Idea) => {
    try {
      await deleteIdea(idea._id.toString());
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  const handleEdit = async (idea: Idea) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ideas/${idea._id}/edit`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get edit permission');
      }

      const data = await response.json();
      router.push(data.redirectUrl);
    } catch (error) {
      console.error('Error navigating to edit page:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <PageLayout
      title="My Submissions"
      isLoading={isLoading}
      error={error}
      isAuthenticated={isAuthenticated}
    >
      {submittedIdeas.length > 0 ? (
        <IdeaList
          ideas={submittedIdeas}
          isAuthenticated={isAuthenticated}
          handleUpvote={handleUpvote}
          registerIdeaRef={registerIdeaRef}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ) : (
        <p className="text-center text-gray-600">
          You haven't submitted any ideas yet.
        </p>
      )}
    </PageLayout>
  );
};

export default MySubmissions;
