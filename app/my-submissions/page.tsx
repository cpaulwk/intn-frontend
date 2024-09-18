'use client';

import React from 'react';
import Header from '../components/common/Header';
import FilteredIdeaList from '../components/ideas/FilteredIdeaList';
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
      <div className="w-fulljustify-center flex-1">
        {isAuthenticated ? (
          userIdeas.length > 0 ? (
            <FilteredIdeaList
              ideas={userIdeas}
              toggleUpvote={toggleUpvote}
              upvotedIdeas={upvotedIdeas}
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
