// app/components/IdeaList.tsx
import React from 'react';
import IdeaCard from './IdeaCard';

interface Idea {
  id: number;
  title: string;
  description: string;
  votes: number;
}

interface IdeaListProps {
  ideas: Idea[];
  onUpvote: (id: number) => void;
}

const IdeaList: React.FC<IdeaListProps> = ({ ideas, onUpvote }) => {
  return (
    <div className="idea-list">
      {ideas
        .sort((a, b) => b.votes - a.votes)
        .map((idea) => (
          <IdeaCard key={idea.id} idea={idea} onUpvote={onUpvote} />
        ))}
    </div>
  );
};

export default IdeaList;
