'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Header from '../components/common/Header';
import FilteredIdeaList from '../components/ideas/FilteredIdeaList';
import PageLayout from '../components/layout/PageLayout';
import { useIdeas } from '../hooks/useIdeas';

const MySubmissions: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const { ideas, handleUpvote } = useIdeas();
  const user = useSelector((state: RootState) => state.auth.user);
  const userIdeas = ideas.filter((idea) => idea.username === user?.email);

  return (
    <PageLayout>
      <Header />
      <h2 className="mb-6 mt-4 text-center text-2xl font-bold">
        My Submissions
      </h2>
      {isAuthenticated ? (
        userIdeas.length > 0 ? (
          <FilteredIdeaList ideas={userIdeas} handleUpvote={handleUpvote} />
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
    </PageLayout>
  );
};

export default MySubmissions;
