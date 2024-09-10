import React from 'react';
import IdeaCard from './IdeaCard';
import { Idea } from '../../types';

interface IdeaListItemProps {
  idea: Idea;
  handleUpvote: (ideaId: string, isUpvoted: boolean) => Promise<void>;
  isAuthenticated: boolean;
  upvotedIdeas: string[];
}

const IdeaListItem: React.FC<IdeaListItemProps> = React.memo(({ idea, handleUpvote, isAuthenticated, upvotedIdeas }) => (
  <IdeaCard 
    idea={idea} 
    handleUpvote={handleUpvote}
    isAuthenticated={isAuthenticated}
    upvotedIdeas={upvotedIdeas}
  />
));

IdeaListItem.displayName = 'IdeaListItem';

export default IdeaListItem;