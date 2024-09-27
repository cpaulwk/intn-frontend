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
  setUpvotedIdeas,
  addUpvotedIdea,
  removeUpvotedIdea,
} from '../slices/upvotedIdeasSlice';
import {
  fetchIdeas,
  fetchUpvotedIdeas,
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

  const loadIdeas = useCallback(async () => {
    dispatch(fetchIdeasStart());
    try {
      const ideasData = await fetchIdeas();
      dispatch(fetchIdeasSuccess(ideasData));
    } catch (error) {
      dispatch(fetchIdeasError(error as string));
    }
  }, [dispatch]);

  const loadUserData = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const [upvotedIdeasData, recentlyViewedIdeasData] = await Promise.all([
          fetchUpvotedIdeas(),
          fetchViewedIdeas(),
        ]);
        dispatch(setUpvotedIdeas(upvotedIdeasData));
        dispatch(setRecentlyViewed(recentlyViewedIdeasData || []));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      dispatch(setUpvotedIdeas([]));
      dispatch(setRecentlyViewed([]));
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    loadIdeas();
    loadUserData();
  }, [loadIdeas, loadUserData]);

  return { loadIdeas, loadUserData };
};

export const useIdeas = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ideas, loading, error } = useSelector(
    (state: RootState) => state.ideas
  );
  const { isAuthenticated } = useAuth();
  const upvotedIdeas = useSelector(
    (state: RootState) => state.upvotedIdeas.upvotedIdeas
  );
  const recentlyViewed = useSelector(recentlyViewedIdeas);

  useSocket();
  useIdeasData();

  const handleUpvote = useCallback(
    async (ideaId: string) => {
      if (!isAuthenticated) {
        console.log('User must be authenticated to upvote');
        return;
      }

      try {
        const updatedIdea = await toggleUpvoteIdea(ideaId);
        dispatch(updateIdea(updatedIdea));
        dispatch(
          upvotedIdeas.includes(ideaId)
            ? removeUpvotedIdea(ideaId)
            : addUpvotedIdea(ideaId)
        );
      } catch (error) {
        console.error('Error toggling upvote:', error);
      }
    },
    [isAuthenticated, dispatch, upvotedIdeas]
  );

  return {
    ideas,
    loading,
    error,
    handleUpvote,
    upvotedIdeas,
    recentlyViewed,
  };
};
