import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { createIdea as createIdeaApi } from '../utils/api';
import { createIdea } from '../slices/ideaSlice';
import { useAuth } from './useAuth';

export const useIdeaSubmission = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useAuth();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!input.trim() || !isAuthenticated || !user) return;

      setIsLoading(true);
      setError(null);

      try {
        const newIdea = await createIdeaApi(input.trim(), user.email);
        dispatch(createIdea(newIdea));
        setInput('');
      } catch (err) {
        console.error('Error creating idea:', err);
        setError('Failed to submit idea. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [input, isAuthenticated, user, dispatch]
  );

  return {
    input,
    setInput,
    isLoading,
    error,
    isAuthenticated,
    handleSubmit,
  };
};
