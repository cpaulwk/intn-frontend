import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchIdeasStart,
  fetchIdeasSuccess,
  fetchIdeasError,
  updateIdea,
  toggleUpvotedIdea,
  setSubmittedIdeas,
  setUpvotedIdeas,
} from '../slices/ideaSlice';
import io from 'socket.io-client';
import {
  fetchIdeas,
  fetchAuthenticatedIdeas,
  toggleUpvoteIdea,
  fetchViewedIdeas,
  fetchMySubmissions,
  fetchUpvotedIdeas,
} from '../utils/api';
import { setRecentlyViewed } from '../slices/recentlyViewedSlice';
import { useAuth } from './useAuth';
import { createSelector } from '@reduxjs/toolkit';
import { useSocket } from './useSocket';

const recentlyViewedIdeas = createSelector(
  (state: RootState) => state.recentlyViewed.ideas,
  (ideas) => (Array.isArray(ideas) && ideas.length > 0 ? ideas : [])
);

export const useIdeas = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ideas, loading, error, submittedIdeas, upvotedIdeas } = useSelector(
    (state: RootState) => state.ideas
  );
  const { isAuthenticated } = useAuth();
  const recentlyViewed = useSelector(recentlyViewedIdeas);

  useSocket();

  const loadData = useCallback(async () => {
    dispatch(fetchIdeasStart());
    try {
      const [ideasData, recentlyViewedIdeasData] = await Promise.all([
        isAuthenticated ? fetchAuthenticatedIdeas() : fetchIdeas(),
        isAuthenticated ? fetchViewedIdeas() : Promise.resolve([]),
      ]);
      dispatch(fetchIdeasSuccess(ideasData));
      dispatch(setRecentlyViewed(recentlyViewedIdeasData || []));
    } catch (error) {
      dispatch(fetchIdeasError(error as string));
      console.error('Error fetching data:', error);
    }
  }, [dispatch, isAuthenticated]);

  const loadMySubmissions = useCallback(async () => {
    if (isAuthenticated) {
      dispatch(fetchIdeasStart());
      try {
        const submissions = await fetchMySubmissions();
        dispatch(setSubmittedIdeas(submissions));
        dispatch(fetchIdeasSuccess(submissions));
      } catch (err) {
        dispatch(fetchIdeasError(err as string));
        console.error('Error fetching my submissions:', err);
      }
    }
  }, [dispatch, isAuthenticated]);

  const loadUpvotedIdeas = useCallback(async () => {
    if (isAuthenticated) {
      dispatch(fetchIdeasStart());
      try {
        const upvotedIdeasData = await fetchUpvotedIdeas();
        dispatch(setUpvotedIdeas(upvotedIdeasData));
        dispatch(fetchIdeasSuccess(upvotedIdeasData));
      } catch (error) {
        dispatch(fetchIdeasError(error as string));
        console.error('Error fetching upvoted ideas:', error);
      }
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (isAuthenticated) {
      loadMySubmissions();
    }
  }, [isAuthenticated, loadMySubmissions]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUpvotedIdeas();
    }
  }, [isAuthenticated, loadUpvotedIdeas]);

  const handleUpvote = useCallback(
    async (ideaId: string) => {
      if (!isAuthenticated) {
        console.log('User must be authenticated to upvote');
        return;
      }

      try {
        const { idea: updatedIdea, isUpvoted } = await toggleUpvoteIdea(ideaId);
        dispatch(
          toggleUpvotedIdea({ ideaId: updatedIdea._id.toString(), isUpvoted })
        );
      } catch (error) {
        console.error('Error toggling upvote:', error);
      }
    },
    [isAuthenticated, dispatch]
  );

  return {
    ideas,
    loading,
    error,
    handleUpvote,
    recentlyViewed,
    submittedIdeas,
    upvotedIdeas,
  };
};
