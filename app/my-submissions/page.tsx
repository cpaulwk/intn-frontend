'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import Header from '../components/common/Header';
import IdeaList from '../components/ideas/IdeaList';
import PageLayout from '../components/layout/PageLayout';
import { useIdeas } from '../hooks/useIdeas';
import { useAuth } from '../hooks/useAuth';
import { fetchMySubmissions } from '../utils/api';
import { setSubmittedIdeas } from '../slices/ideaSlice';

const MySubmissions: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { handleUpvote } = useIdeas();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const submittedIdeas = useSelector(
    (state: RootState) => state.ideas.submittedIdeas
  );

  useEffect(() => {
    const loadMySubmissions = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const submissions = await fetchMySubmissions();
          console.log('submissions: ', submissions);
          dispatch(setSubmittedIdeas(submissions));
        } catch (err) {
          console.error('Error fetching my submissions:', err);
          setError('Failed to load your submissions. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadMySubmissions();
  }, [isAuthenticated]);

  return (
    <PageLayout>
      <Header />
      <h2 className="mb-6 mt-4 text-center text-2xl font-bold">
        My Submissions
      </h2>
      <div className="w-full flex-1 justify-center">
        {isAuthenticated ? (
          loading ? (
            <p className="text-center text-gray-600">
              Loading your submissions...
            </p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : submittedIdeas.length > 0 ? (
            <IdeaList
              ideas={submittedIdeas}
              isAuthenticated={isAuthenticated}
              handleUpvote={handleUpvote}
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
