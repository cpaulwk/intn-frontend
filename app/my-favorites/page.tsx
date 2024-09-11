'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import Header from '../components/common/Header';
import FilteredIdeaList from '../components/ideas/FilteredIdeaList';
import PageLayout from '../components/layout/PageLayout';
import { fetchUpvotedIdeas } from '../utils/api';
import { setUpvotedIdeas } from '../slices/upvotedIdeasSlice';

const MyFavorites: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const ideas = useSelector((state: RootState) => state.ideas.ideas);
  const upvotedIdeas = useSelector((state: RootState) => state.upvotedIdeas.upvotedIdeas);

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

  const favoriteIdeas = ideas.filter(idea => upvotedIdeas.includes(idea._id.toString()));

  return (
    <PageLayout>
      <Header />
      <h2 className="text-2xl font-bold text-center mt-4 mb-6">My Favorites</h2>
      {isAuthenticated ? (
        favoriteIdeas.length > 0 ? (
          <FilteredIdeaList ideas={favoriteIdeas} />
        ) : (
          <p className="text-center text-gray-600">You haven't upvoted any ideas yet.</p>
        )
      ) : (
        <p className="text-center text-gray-600">Please log in to view your favorite ideas.</p>
      )}
    </PageLayout>
  );
};

export default MyFavorites;
