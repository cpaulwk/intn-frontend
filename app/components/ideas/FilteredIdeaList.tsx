import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import IdeaListItem from './IdeaListItem';
import { updateIdea } from '../../features/auth/ideaSlice';
import { addUpvotedIdea, removeUpvotedIdea } from '../../features/auth/upvotedIdeasSlice';
import { toggleUpvoteIdea } from '../../utils/api';
import { Idea } from '../../types';

interface FilteredIdeaListProps {
  ideas: Idea[];
}

const FilteredIdeaList: React.FC<FilteredIdeaListProps> = ({ ideas }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const upvotedIdeas = useSelector((state: RootState) => state.upvotedIdeas.upvotedIdeas);

  const handleUpvote = useCallback(async (ideaId: string, isUpvoted: boolean) => {
  console.log('ideas: ', ideas);
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

  return (
    <div className="idea-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
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

export default FilteredIdeaList;