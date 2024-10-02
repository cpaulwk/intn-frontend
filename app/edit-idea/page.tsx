'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/common/Header';
import IdeaEditForm from '../components/ideas/IdeaEditForm';
import PageLayout from '../components/layout/PageLayout';
import { useIdeas } from '../hooks/useIdeas';

const EditIdeaPage: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { getIdeaById } = useIdeas();
  const idea = id ? getIdeaById(id) : null;

  if (!idea) {
    return <div>Idea not found</div>;
  }

  return (
    <PageLayout>
      <Header />
      <IdeaEditForm idea={idea} />
    </PageLayout>
  );
};

export default EditIdeaPage;
