'use client';

import React from 'react';
import Header from './components/common/Header';
import IdeaList from './components/ideas/IdeaList';
import IdeaSubmissionForm from './components/ideas/IdeaSubmissionForm';
import PageLayout from './components/layout/PageLayout';
import { useIdeas } from './hooks/useIdeas';
import { useAuth } from './hooks/useAuth';

export default function Home() {
  const { ideas, loading, error, toggleUpvote, upvotedIdeas } = useIdeas();
  const { isAuthenticated } = useAuth();

  return (
    <PageLayout>
      <Header />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <IdeaList
          ideas={ideas}
          isAuthenticated={isAuthenticated}
          upvotedIdeas={upvotedIdeas}
          toggleUpvote={toggleUpvote}
        />
      )}
      <IdeaSubmissionForm />
    </PageLayout>
  );
}
