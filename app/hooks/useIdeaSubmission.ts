import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { createIdea } from '../slices/ideaSlice';
import { AppDispatch } from '../store';
import { useAuth } from './useAuth';
import { createIdea as createIdeaApi } from '../utils/api';
import { checkAuthStatus } from '../utils/auth';

export const useIdeaSubmission = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useAuth();

  const handleSubmit = async () => {
    if (!input.trim() || !isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const newIdea = await createIdeaApi(input.trim(), user.email);
      dispatch(createIdea(newIdea));
      setInput('');
    } catch (error) {
      await checkAuthStatus(dispatch);
      console.error('Error creating idea:', error);
      setError('Failed to submit idea. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    input,
    setInput,
    isLoading,
    error,
    isAuthenticated,
    handleSubmit,
  };
};
