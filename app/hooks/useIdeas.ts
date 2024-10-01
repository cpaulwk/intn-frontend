import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchIdeasStart,
  fetchIdeasSuccess,
  fetchIdeasError,
  toggleUpvotedIdea,
  setSubmittedIdeas,
  setUpvotedIdeas,
} from '../slices/ideaSlice';
import {
  fetchIdeas,
  toggleUpvoteIdea,
  fetchAllData,
  fetchUserIdeas,
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
  const {
    ideas,
    isLoadingIdeas,
    isLoadingSubmissions,
    isLoadingUpvoted,
    error,
    submittedIdeas,
    upvotedIdeas,
  } = useSelector((state: RootState) => state.ideas);
  const { isAuthenticated } = useAuth();
  const recentlyViewed = useSelector(recentlyViewedIdeas);

  // useSocket();

  const loadData = useCallback(async () => {
    dispatch(fetchIdeasStart());
    try {
      const cachedData = localStorage.getItem('ideasData');
      const lastFetchTime = localStorage.getItem('lastFetchTime');
      const currentTime = new Date().getTime();

      if (
        cachedData &&
        lastFetchTime &&
        currentTime - parseInt(lastFetchTime) < 300000 &&
        !isAuthenticated // Only use cache for non-authenticated users
      ) {
        // Use cached data if it's less than 5 minutes old
        const parsedData = JSON.parse(cachedData);
        dispatch(fetchIdeasSuccess(parsedData.ideas));
        dispatch(setRecentlyViewed(parsedData.recentlyViewed || []));
      } else {
        // Fetch new data
        const data = isAuthenticated
          ? await fetchAllData()
          : { ideas: await fetchIdeas(), recentlyViewed: [] };

        dispatch(fetchIdeasSuccess(data.ideas));
        dispatch(setRecentlyViewed(data.recentlyViewed || []));

        // Cache the new data for non-authenticated users
        if (!isAuthenticated) {
          localStorage.setItem('ideasData', JSON.stringify(data));
          localStorage.setItem('lastFetchTime', currentTime.toString());
        }
      }
    } catch (error) {
      dispatch(fetchIdeasError(error as string));
      console.error('Error fetching data:', error);
    }
  }, [dispatch, isAuthenticated]);

  const loadUserIdeas = useCallback(async () => {
    if (isAuthenticated) {
      dispatch(fetchIdeasStart());
      try {
        const { submittedIdeas, upvotedIdeas } = await fetchUserIdeas();
        dispatch(setSubmittedIdeas(submittedIdeas));
        dispatch(setUpvotedIdeas(upvotedIdeas));
        dispatch(fetchIdeasSuccess([...submittedIdeas, ...upvotedIdeas]));
      } catch (err) {
        dispatch(fetchIdeasError(err as string));
        console.error('Error fetching user ideas:', err);
      }
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    console.log('loaded');
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserIdeas();
    }
  }, [isAuthenticated, loadUserIdeas]);

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
    isLoadingIdeas,
    isLoadingSubmissions,
    isLoadingUpvoted,
    error,
    handleUpvote,
    recentlyViewed,
    submittedIdeas,
    upvotedIdeas,
  };
};
