// app/components/IdeaCard.tsx
import React, { useState, useCallback } from 'react';
import { Idea } from '../../types';

interface IdeaCardProps {
  idea: Idea;
  handleUpvote: (ideaId: string, isUpvoted: boolean) => Promise<void>;
  isAuthenticated: boolean;
  upvotedIdeas: string[];
}

const IdeaCard: React.FC<IdeaCardProps> = React.memo(({ idea, handleUpvote, isAuthenticated, upvotedIdeas }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUpvoted = Array.isArray(upvotedIdeas) && upvotedIdeas.includes(idea._id.toString());

  const toggleExpand = useCallback(() => setIsExpanded(prev => !prev), []);
  const onUpvote = useCallback(() => handleUpvote(idea._id.toString(), isUpvoted), [handleUpvote, idea._id, isUpvoted]);

  return (
    <div className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-black p-4 rounded-xl mb-4">
      <div className="flex-grow">
        <h3 className="text-xl font-bold mb-2">{idea.title}</h3>
        <p className={`text-sm ${isExpanded ? '' : 'line-clamp-3'}`}>
          {idea.description}
        </p>
        {idea.description.length > 280 && (
          <button
            onClick={toggleExpand}
            className="text-sm text-blue-800 hover:underline mt-1"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      <button
        onClick={onUpvote}
        className="flex flex-col items-center text-sm font-semibold mt-2 mx-1 py-2 rounded"
        disabled={!isAuthenticated}
        aria-label={`${isUpvoted ? 'Downvote' : 'Upvote'} idea: ${idea.title}`}
        aria-pressed={isUpvoted}
      >
        <span className={`whitespace-nowrap ${isAuthenticated ? 'text-black' : 'text-gray-400'}`}>
          {isUpvoted ? '▼ Downvote' : '▲ Upvote'}
        </span>
        <span>{idea.upvotes}</span>
      </button>
    </div>
  );
});

IdeaCard.displayName = 'IdeaCard';

export default IdeaCard;
