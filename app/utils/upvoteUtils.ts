import axios from 'axios';
import { Idea } from '../types';
import { AppDispatch } from '../store';
import { addUpvotedIdea, removeUpvotedIdea } from '../features/auth/upvotedIdeasSlice';

export const toggleUpvote = async (
  ideaId: string,
  isUpvoted: boolean,
  dispatchRedux: AppDispatch,
  updateIdea: (idea: Idea) => void
): Promise<void> => {
  try {
    const { data } = await axios.put<Idea>(
      `${process.env.NEXT_PUBLIC_API_URL}/ideas/${ideaId}/toggle-upvote`,
      {},
      { withCredentials: true }
    );

    if (isUpvoted) {
      dispatchRedux(removeUpvotedIdea(ideaId));
    } else {
      dispatchRedux(addUpvotedIdea(ideaId));
    }

    updateIdea(data);
  } catch (error) {
    console.error('Error toggling upvote:', error);
    throw error;
  }
};
