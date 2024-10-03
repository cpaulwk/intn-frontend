import React from 'react';
import IdeaCard from './IdeaCard';
import { Idea } from '../../types';

interface IdeaListProps {
  ideas: Idea[];
  isAuthenticated: boolean;
  handleUpvote: (ideaId: string) => Promise<void>;
  registerIdeaRef: (id: string, element: HTMLDivElement | null) => void;
  onDelete?: (idea: Idea) => Promise<void>;
  onEdit?: (idea: Idea) => Promise<void>;
}

const IdeaList: React.FC<IdeaListProps> = ({
  ideas,
  isAuthenticated,
  handleUpvote,
  registerIdeaRef,
  onDelete,
  onEdit,
}) => {
  if (ideas.length === 0)
    return <div className="text-center">No ideas found.</div>;

  return (
    <div className="mx-auto max-w-4xl py-4">
      <div className="flex flex-col items-center space-y-4">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea._id.toString()}
            idea={idea}
            isAuthenticated={isAuthenticated}
            handleUpvote={handleUpvote}
            registerIdeaRef={registerIdeaRef}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default IdeaList;
