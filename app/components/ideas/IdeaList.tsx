import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import IdeaListItem from './IdeaListItem';
import { useIdeas } from '../../hooks/useIdeas';

const IdeaList: React.FC = () => {
  const { ideas, loading, error } = useIdeas();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const upvotedIdeas = useSelector((state: RootState) => state.upvotedIdeas.upvotedIdeas);
  const { handleUpvote } = useIdeas();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="idea-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {ideas.map((idea) => (
        <IdeaListItem
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