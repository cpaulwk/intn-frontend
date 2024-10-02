import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { Idea } from '../types';
import {
  fetchIdeasStart,
  fetchIdeasSuccess,
  fetchIdeasError,
  toggleUpvotedIdea,
  addIdea,
  addRecentlyViewed,
  removeRecentlyViewed as removeRecentlyViewedAction,
} from '../slices/ideaSlice';
import {
  fetchAllDataAuthenticated,
  toggleUpvoteIdea,
  addViewedIdea,
  createIdea,
  fetchAllDataUnauthenticated,
  removeRecentlyViewed as removeRecentlyViewedApi,
  deleteIdea as deleteIdeaApi,
} from '../utils/api';
import { useAuth } from './useAuth';
import { checkAuthStatus } from '../utils/auth';
import { removeIdea } from '../slices/ideaSlice';
import { updateIdea as updateIdeaApi } from '../utils/api';
import { updateIdea as updateIdeaAction } from '../slices/ideaSlice';

export const useIdeas = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ideas, recentlyViewed, submittedIdeas, upvotedIdeas, status, error } =
    useSelector((state: RootState) => state.ideas);
  const { isAuthenticated } = useAuth();

  const loadIdeas = async () => {
    dispatch(fetchIdeasStart());
    try {
      if (isAuthenticated) {
        const data = await fetchAllDataAuthenticated();
        dispatch(fetchIdeasSuccess(data));
      } else {
        const data = await fetchAllDataUnauthenticated();
        dispatch(
          fetchIdeasSuccess({
            ideas: data.ideas,
            recentlyViewed: [],
            submittedIdeas: [],
            upvotedIdeas: [],
          })
        );
      }
    } catch (error) {
      dispatch(fetchIdeasError(error as string));
    }
  };

  const handleUpvote = async (ideaId: string) => {
    if (!isAuthenticated) return;

    try {
      const { idea: updatedIdea, isUpvoted } = await toggleUpvoteIdea(ideaId);
      dispatch(
        toggleUpvotedIdea({ ideaId: updatedIdea._id.toString(), isUpvoted })
      );
      dispatch(addRecentlyViewed(updatedIdea));
      await addViewedIdea(updatedIdea._id.toString());
    } catch (error) {
      await checkAuthStatus(dispatch);
      console.error('Error toggling upvote:', error);
    }
  };

  const submitIdea = async (title: string, username: string) => {
    try {
      const newIdea = await createIdea(title, username);
      dispatch(addIdea(newIdea));
    } catch (error) {
      console.error('Error submitting idea:', error);
    }
  };

  const removeRecentlyViewed = async (ideaId: string) => {
    try {
      await removeRecentlyViewedApi(ideaId);
      dispatch(removeRecentlyViewedAction(ideaId));
    } catch (error) {
      console.error('Error removing recently viewed idea:', error);
    }
  };

  const deleteIdea = async (ideaId: string) => {
    try {
      await deleteIdeaApi(ideaId);
      dispatch(removeIdea(ideaId));
    } catch (error) {
      console.error('Error deleting idea:', error);
      throw error;
    }
  };

  const updateIdea = async (ideaId: string, updates: Partial<Idea>) => {
    try {
      const updatedIdea = await updateIdeaApi(ideaId, updates);
      dispatch(updateIdeaAction(updatedIdea));
    } catch (error) {
      console.error('Error updating idea:', error);
      throw error;
    }
  };

  const getIdeaById = (ideaId: string) => {
    return ideas.find((idea) => idea._id.toString() === ideaId);
  };

  return {
    ideas,
    isLoading: status === 'loading',
    error,
    handleUpvote,
    submitIdea,
    loadIdeas,
    recentlyViewed,
    submittedIdeas,
    upvotedIdeas,
    removeRecentlyViewed,
    deleteIdea,
    updateIdea,
    getIdeaById,
  };
};
