'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import IdeaEditForm from '../../components/ideas/IdeaEditForm';
import PageLayout from '../../components/layout/PageLayout';
import { useAuth } from '../../hooks/useAuth';
import { useIdeas } from '../../hooks/useIdeas';
import { Idea } from '../../types';

const EditIdeaPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { fetchIdeaById, isLoading, error } = useIdeas();
  const [idea, setIdea] = useState<Idea | null>(null);
  const { isAuthenticated } = useAuth();
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const checkEditPermission = async () => {
      if (!isAuthenticated || !id || idea) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ideas/${id}/edit`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Not authorized to edit');
        }

        setCanEdit(true);

        const fetchedIdea = await fetchIdeaById(id);
        setIdea(fetchedIdea);
      } catch (error) {
        console.error('Error checking edit permission:', error);
        router.push('/my-submissions');
      }
    };

    checkEditPermission();
  }, [isAuthenticated, id, router, fetchIdeaById, idea]);

  if (!idea || !canEdit) {
    return null;
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
