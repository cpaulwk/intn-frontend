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
    <div className="overflow-y-auto max-w-3xl mx-auto pt-2 max-h-[78vh]">
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