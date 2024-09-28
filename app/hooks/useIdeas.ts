import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchIdeasStart,
  fetchIdeasSuccess,
  fetchIdeasError,
  updateIdea,
} from '../slices/ideaSlice';
import io from 'socket.io-client';
import {
  fetchIdeas,
  fetchAuthenticatedIdeas,
  toggleUpvoteIdea,
  fetchViewedIdeas,
} from '../utils/api';
import { setRecentlyViewed } from '../slices/recentlyViewedSlice';
import { useAuth } from './useAuth';
import { createSelector } from '@reduxjs/toolkit';

const recentlyViewedIdeas = createSelector(
  (state: RootState) => state.recentlyViewed.ideas,
  (ideas) => (Array.isArray(ideas) && ideas.length > 0 ? ideas : [])
);

const useSocket = () => {
  const [socket, setSocket] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL as string, {
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on('upvoteUpdate', ({ ideaId, upvotes }) => {
      dispatch(updateIdea({ id: ideaId, changes: { upvotes } }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [dispatch]);

  return socket;
};

const useIdeasData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();

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

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { loadData };
};

export const useIdeas = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ideas, loading, error } = useSelector(
    (state: RootState) => state.ideas
  );
  const { isAuthenticated } = useAuth();
  const recentlyViewed = useSelector(recentlyViewedIdeas);

  useSocket();
  const { loadData } = useIdeasData();

  const handleUpvote = useCallback(
    async (ideaId: string) => {
      if (!isAuthenticated) {
        console.log('User must be authenticated to upvote');
        return;
      }

      try {
        const { idea: updatedIdea, isUpvoted } = await toggleUpvoteIdea(ideaId);
        dispatch(updateIdea({ ...updatedIdea, isUpvoted }));
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
    loadData,
  };
};
