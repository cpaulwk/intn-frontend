'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import IdeaEditForm from '../../components/ideas/IdeaEditForm';
import PageLayout from '../../components/layout/PageLayout';
import { useIdeas } from '../../hooks/useIdeas';
import { useAuth } from '../../hooks/useAuth';
const EditIdeaPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const { getIdeaById, isLoading, error } = useIdeas();
  const idea = id ? getIdeaById(id) : null;
  const { isAuthenticated } = useAuth();
  if (!idea) {
    return <div>Idea not found</div>;
  }

  return (
    <PageLayout
      title="Edit Idea"
      isLoading={isLoading}
      error={error}
      isAuthenticated={isAuthenticated}
    >
      <IdeaEditForm idea={idea} />
    </PageLayout>
  );
};

export default EditIdeaPage;
