'use client';

import React from 'react';
import Header from '../components/common/Header';
import IdeaList from '../components/ideas/IdeaList';
import PageLayout from '../components/layout/PageLayout';
import { useIdeas } from '../hooks/useIdeas';
import { useAuth } from '../hooks/useAuth';
const MySubmissions: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { ideas, toggleUpvote, upvotedIdeas } = useIdeas();
  const userIdeas = ideas.filter((idea) => idea.username === user?.email);

  return (
    <PageLayout>
      <Header />
      <h2 className="mb-6 mt-4 text-center text-2xl font-bold">
        My Submissions
      </h2>
      <div className="w-full flex-1 justify-center">
        {isAuthenticated ? (
          userIdeas.length > 0 ? (
            <IdeaList
              ideas={userIdeas}
              isAuthenticated={isAuthenticated}
              upvotedIdeas={upvotedIdeas}
              toggleUpvote={toggleUpvote}
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
