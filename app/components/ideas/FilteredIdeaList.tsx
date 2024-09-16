import React, { useMemo } from 'react';
import IdeaCard from './IdeaCard';
import { Idea } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface FilteredIdeaListProps {
  ideas: Idea[];
  handleUpvote: (ideaId: string, isUpvoted: boolean) => Promise<void>;
}

const FilteredIdeaList: React.FC<FilteredIdeaListProps> = ({
  ideas,
  handleUpvote,
}) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const upvotedIdeas = useSelector(
    (state: RootState) => state.upvotedIdeas.upvotedIdeas
  );
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const sortedIdeas = useMemo(
    () => [...ideas].sort((a, b) => b.upvotes - a.upvotes),
    [ideas]
  );

  return (
    <div
      className={`${isSidebarOpen ? 'px-10' : 'px-16'} grid max-h-[78vh] grid-cols-1 gap-x-4 overflow-y-auto pt-2 md:grid-cols-2 lg:grid-cols-3`}
    >
      {sortedIdeas.map((idea) => (
        <IdeaCard
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
