import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import IdeaListItem from './IdeaListItem';
import { fetchIdeasStart, fetchIdeasSuccess, fetchIdeasError, updateIdea } from '../../features/auth/ideaSlice';
import { setUpvotedIdeas, addUpvotedIdea, removeUpvotedIdea } from '../../features/auth/upvotedIdeasSlice';
import { fetchIdeas, fetchUpvotedIdeas, toggleUpvoteIdea } from '../../utils/api';

const IdeaList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ideas, loading, error } = useSelector((state: RootState) => state.ideas);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const upvotedIdeas = useSelector((state: RootState) => state.upvotedIdeas.upvotedIdeas);

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

  const handleUpvote = useCallback(async (ideaId: string, isUpvoted: boolean) => {
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
  }, [isAuthenticated, dispatch]);

  const sortedIdeas = useMemo(() => 
    [...ideas].sort((a, b) => b.upvotes - a.upvotes),
    [ideas]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="idea-list">
      {sortedIdeas.map((idea) => (
        <IdeaListItem
          key={idea._id.toString()}
          idea={idea}
          handleUpvote={handleUpvote}
          isAuthenticated={isAuthenticated}
          upvotedIdeas={upvotedIdeas}
        />
      ))}
    </div>
  );
};

export default IdeaList;