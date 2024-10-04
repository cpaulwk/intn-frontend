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
        dispatch(
          fetchIdeasSuccess({
            ideas: data.ideas,
            recentlyViewed: data.recentlyViewed,
            submittedIdeas: data.submittedIdeas,
            upvotedIdeas: data.upvotedIdeas.map((idea) => idea._id.toString()),
          })
        );
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

  const fetchIdeaById = async (ideaId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ideas/${ideaId}`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch idea');
      }
      const idea = await response.json();
      return idea;
    } catch (error) {
      console.error('Error fetching idea:', error);
      throw error;
    }
  };

  const handleDelete = async (idea: Idea) => {
    try {
      await deleteIdea(idea._id.toString());
      // You might want to update the state or trigger a re-fetch here
    } catch (error) {
      console.error('Error deleting idea:', error);
      throw error;
    }
  };

  const handleEdit = async (idea: Idea) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ideas/${idea._id}/edit`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get edit permission');
      }

      const data = await response.json();
      return data.redirectUrl;
    } catch (error) {
      console.error('Error getting edit permission:', error);
      throw error;
    }
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
    fetchIdeaById, // Keep this
    handleDelete,
    handleEdit,
  };
};
