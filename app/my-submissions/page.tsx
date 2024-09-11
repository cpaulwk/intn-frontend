'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Header from '../components/common/Header';
import FilteredIdeaList from '../components/ideas/FilteredIdeaList';
import PageLayout from '../components/layout/PageLayout';

const MySubmissions: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const ideas = useSelector((state: RootState) => state.ideas.ideas);
  const userIdeas = ideas.filter(idea => idea.username === user?.email);

  return (
    <PageLayout>
      <Header />
      <h2 className="text-2xl font-bold text-center mt-4 mb-6">My Submissions</h2>
      {isAuthenticated ? (
        userIdeas.length > 0 ? (
          <FilteredIdeaList ideas={userIdeas} />
        ) : (
          <p className="text-center text-gray-600">You haven't submitted any ideas yet.</p>
        )
      ) : (
        <p className="text-center text-gray-600">Please log in to view your submissions.</p>
      )}
    </PageLayout>
  );
};

export default MySubmissions;