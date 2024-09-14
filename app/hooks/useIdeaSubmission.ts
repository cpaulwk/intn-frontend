import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { createIdea } from '../slices/ideaSlice';
import { createIdea as createIdeaApi } from '../utils/api';
import { addUpvotedIdea } from '../slices/upvotedIdeasSlice';
export const useIdeaSubmission = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const username = useSelector((state: RootState) => state.auth.user?.email);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !isAuthenticated || !username) return;

    setIsLoading(true);
    setError(null);

    try {
      const newIdea = await createIdeaApi(input.trim(), username);
      dispatch(createIdea(newIdea));
      dispatch(addUpvotedIdea(newIdea._id.toString()));
      setInput('');
    } catch (err) {
      console.error('Error creating idea:', err);
      setError('Failed to submit idea. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [input, isAuthenticated, username, dispatch]);

  return {
    input,
    setInput,
    isLoading,
    error,
    isAuthenticated,
    handleSubmit
  };
};
