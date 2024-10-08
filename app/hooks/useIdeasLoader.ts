import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../store';
import { useIdeas } from './useIdeas';

export const useIdeasLoader = () => {
  const { isLoaded } = useSelector((state: RootState) => state.ideas);
  const { loadIdeas } = useIdeas();

  useEffect(() => {
    if (!isLoaded) {
      loadIdeas();
    }
  }, [isLoaded, loadIdeas]);
};
