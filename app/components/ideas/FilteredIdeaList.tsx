import React, { useMemo } from 'react';
import IdeaListItem from './IdeaListItem';
import { useIdeas } from '../../hooks/useIdeas';
import { Idea } from '../../types';

interface FilteredIdeaListProps {
  ideas: Idea[];
}

const FilteredIdeaList: React.FC<FilteredIdeaListProps> = ({ ideas }) => {
  const { isAuthenticated, upvotedIdeas, handleUpvote } = useIdeas();

  const sortedIdeas = useMemo(() => 
    [...ideas].sort((a, b) => b.upvotes - a.upvotes),
    [ideas]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
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