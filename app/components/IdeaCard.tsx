// app/components/IdeaCard.tsx
import React, { useState } from 'react';
import { Idea } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface IdeaCardProps {
  idea: Idea;
  onUpvote: (id: string) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onUpvote }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <div className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-black p-4 rounded-xl mb-4">
      <div className="flex-grow">
        <h3 className="text-xl font-bold mb-2">{idea.title}</h3>
        <p className={`text-sm ${isExpanded ? '' : 'line-clamp-3'}`}>
          {idea.description}
        </p>
        {idea.description.length > 280 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-800 hover:underline mt-1"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      <button
        onClick={() => onUpvote(idea._id.toString())}
        className="flex flex-col items-center text-sm font-semibold mt-2 mx-1 py-2 rounded"
        disabled={!isAuthenticated}
      >
        <span className={`whitespace-nowrap ${isAuthenticated ? 'text-black' : 'text-gray-400'}`}>▲ Upvote</span>
        <span>{idea.upvotes}</span>
      </button>
    </div>
  );
};

export default IdeaCard;
