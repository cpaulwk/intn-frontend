import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchIdeasStart,
  fetchIdeasSuccess,
  fetchIdeasError,
  toggleUpvotedIdea,
  addIdea,
  addRecentlyViewed,
} from '../slices/ideaSlice';
import {
  fetchAllData,
  toggleUpvoteIdea,
  addViewedIdea,
  createIdea,
} from '../utils/api';
import { useAuth } from './useAuth';

export const useIdeas = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ideas, recentlyViewed, submittedIdeas, upvotedIdeas, status, error } =
    useSelector((state: RootState) => state.ideas);
  const { isAuthenticated } = useAuth();

  const loadIdeas = async () => {
    dispatch(fetchIdeasStart());
    try {
      const data = await fetchAllData();
      dispatch(fetchIdeasSuccess(data));
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
  };
};
