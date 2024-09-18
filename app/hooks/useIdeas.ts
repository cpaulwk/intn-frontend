import { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchIdeasStart,
  fetchIdeasSuccess,
  fetchIdeasError,
  updateIdea,
} from '../slices/ideaSlice';
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
import {
  setRecentlyViewed,
  selectRecentlyViewedIdeas,
} from '../slices/recentlyViewedSlice';

export const useIdeas = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ideas, loading, error } = useSelector(
    (state: RootState) => state.ideas
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const upvotedIdeas = useSelector(
    (state: RootState) => state.upvotedIdeas.upvotedIdeas
  );
  const recentlyViewedIdeas = useSelector((state: RootState) => {
    const ideas = state.recentlyViewed.ideas;
    return Array.isArray(ideas) && ideas.length > 0 ? ideas : [];
  });

  useEffect(() => {
    const loadIdeas = async () => {
      dispatch(fetchIdeasStart());
      try {
        const ideasData = await fetchIdeas();
        dispatch(fetchIdeasSuccess(ideasData));
      } catch (error) {
        dispatch(fetchIdeasError(error as string));
      }
    };

    loadIdeas();
  }, [dispatch]);

  useEffect(() => {
    const loadUpvotedIdeas = async () => {
      if (isAuthenticated) {
        try {
          const upvotedIdeasData = await fetchUpvotedIdeas();
          dispatch(setUpvotedIdeas(upvotedIdeasData));
        } catch (error) {
          console.error('Error fetching upvoted ideas:', error);
        }
      }
    };

    loadUpvotedIdeas();
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const loadRecentlyViewedIdeas = async () => {
      if (isAuthenticated) {
        try {
          const recentlyViewedIdeasData = await fetchViewedIdeas();
          dispatch(setRecentlyViewed(recentlyViewedIdeasData));
        } catch (error) {
          console.error('Error fetching recently viewed ideas:', error);
        }
      }
    };

    loadRecentlyViewedIdeas();
  }, [isAuthenticated, dispatch]);

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

  const sortedIdeas = useMemo(
    () => [...ideas].sort((a, b) => b.upvotes - a.upvotes),
    [ideas]
  );

  return {
    ideas: sortedIdeas,
    loading,
    error,
    handleUpvote,
    isAuthenticated,
    upvotedIdeas,
    recentlyViewedIdeas,
  };
};
