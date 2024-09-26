import { useEffect, useMemo, useCallback } from 'react';
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

const selectRecentlyViewedIdeas = createSelector(
  (state: RootState) => state.recentlyViewed.ideas,
  (ideas) => (Array.isArray(ideas) && ideas.length > 0 ? ideas : [])
);

export const useIdeas = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ideas, loading, error } = useSelector(
    (state: RootState) => state.ideas
  );
  const [socket, setSocket] = useState<any>(null);
  const { isAuthenticated } = useAuth();
  const upvotedIdeas = useSelector(
    (state: RootState) => state.upvotedIdeas.upvotedIdeas
  );
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

  const handleUpvote = useCallback(
    async (ideaId: string, isUpvoted: boolean) => {
      if (!isAuthenticated) {
        console.log('User must be authenticated to upvote');
        return;
      }

      try {
        const updatedIdea = await toggleUpvoteIdea(ideaId);
        dispatch(updateIdea(updatedIdea));

        if (isUpvoted) {
          dispatch(removeUpvotedIdea(ideaId));
        } else {
          dispatch(addUpvotedIdea(ideaId));
        }
      } catch (error) {
        console.error('Error toggling upvote:', error);
      }
    },
    [isAuthenticated, dispatch]
  );

  const toggleUpvote = useCallback(
    async (ideaId: string) => {
      if (!isAuthenticated) {
        console.log('User must be authenticated to upvote');
        return;
      }

      const isCurrentlyUpvoted = upvotedIdeas.includes(ideaId);

      try {
        const updatedIdea = await toggleUpvoteIdea(ideaId);
        dispatch(updateIdea(updatedIdea));

        if (isCurrentlyUpvoted) {
          dispatch(removeUpvotedIdea(ideaId));
        } else {
          dispatch(addUpvotedIdea(ideaId));
        }
      } catch (error) {
        console.error('Error toggling upvote:', error);
      }
    },
    [isAuthenticated, upvotedIdeas, dispatch]
  );

  return {
    ideas,
    loading,
    error,
    handleUpvote,
    toggleUpvote,
    upvotedIdeas,
    recentlyViewedIdeas,
  };
};
