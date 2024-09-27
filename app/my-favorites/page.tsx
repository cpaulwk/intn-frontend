'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import Header from '../components/common/Header';
import IdeaList from '../components/ideas/IdeaList';
import PageLayout from '../components/layout/PageLayout';
import { fetchUpvotedIdeas } from '../utils/api';
import { setUpvotedIdeas } from '../slices/upvotedIdeasSlice';
import { useIdeas } from '../hooks/useIdeas';
import { useAuth } from '../hooks/useAuth';

const MyFavorites: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ideas, toggleUpvote, upvotedIdeas } = useIdeas();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadUpvotedIdeas = async () => {
      if (isAuthenticated && upvotedIdeas.length === 0) {
        try {
          const upvotedIdeasData = await fetchUpvotedIdeas();
          dispatch(setUpvotedIdeas(upvotedIdeasData));
        } catch (error) {
          console.error('Error fetching upvoted ideas:', error);
        }
      }
    };

    loadUpvotedIdeas();
  }, [isAuthenticated, dispatch, upvotedIdeas.length]);

  const favoriteIdeas = ideas.filter((idea) =>
    upvotedIdeas.includes(idea._id.toString())
  );

  return (
    <PageLayout>
      <Header />
      <h2 className="mb-6 mt-4 text-center text-2xl font-bold">My Favorites</h2>
      {isAuthenticated ? (
        favoriteIdeas.length > 0 ? (
          <IdeaList
            ideas={favoriteIdeas}
            isAuthenticated={isAuthenticated}
            upvotedIdeas={upvotedIdeas}
            toggleUpvote={toggleUpvote}
          />
        ) : (
          <p className="text-center text-gray-600">
            You haven't upvoted any ideas yet.
          </p>
        )
      ) : (
        <p className="text-center text-gray-600">
          Please log in to view your favorite ideas.
        </p>
      )}
    </PageLayout>
  );
};

export default MyFavorites;
