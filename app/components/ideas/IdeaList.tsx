import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import IdeaCard from './IdeaCard';
import { useIdeas } from '../../hooks/useIdeas';

const IdeaList: React.FC = () => {
  const { ideas, loading, error, handleUpvote } = useIdeas();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const upvotedIdeas = useSelector(
    (state: RootState) => state.upvotedIdeas.upvotedIdeas
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mx-auto max-h-[78vh] max-w-3xl overflow-y-auto pt-2">
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
