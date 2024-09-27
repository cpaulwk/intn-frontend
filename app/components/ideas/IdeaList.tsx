import React from 'react';
import IdeaCard from './IdeaCard';
import { Idea } from '../../types';
import { useSidebar } from '../../hooks/useSideBar';

interface IdeaListProps {
  ideas: Idea[];
  isAuthenticated: boolean;
  upvotedIdeas: string[];
  handleUpvote: (ideaId: string) => Promise<void>;
}

const IdeaList: React.FC<IdeaListProps> = ({
  ideas,
  isAuthenticated,
  upvotedIdeas,
  handleUpvote,
}) => {
  const { isSidebarOpen } = useSidebar();

  if (ideas.length === 0) return <div>No ideas found.</div>;

  return (
    <div
      className={`${isSidebarOpen ? 'px-10' : 'px-16'} flex max-h-[78vh] flex-col items-center overflow-y-auto pt-2`}
    >
      {ideas.map((idea) => (
        <IdeaCard
          key={idea._id.toString()}
          idea={idea}
          isAuthenticated={isAuthenticated}
          upvotedIdeas={upvotedIdeas}
          handleUpvote={handleUpvote}
        />
      ))}
    </div>
  );
};

export default IdeaList;
