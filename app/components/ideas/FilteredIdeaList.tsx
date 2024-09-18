import React, { useMemo } from 'react';
import IdeaCard from './IdeaCard';
import { Idea } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../hooks/useSideBar';

interface FilteredIdeaListProps {
  ideas: Idea[];
  toggleUpvote: (ideaId: string) => Promise<void>;
  upvotedIdeas: string[];
}

const FilteredIdeaList: React.FC<FilteredIdeaListProps> = ({
  ideas,
  toggleUpvote,
  upvotedIdeas,
}) => {
  const { isAuthenticated } = useAuth();
  const { isSidebarOpen } = useSidebar();
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
          toggleUpvote={toggleUpvote}
          isAuthenticated={isAuthenticated}
          upvotedIdeas={upvotedIdeas}
        />
      ))}
    </div>
  );
};

export default FilteredIdeaList;
