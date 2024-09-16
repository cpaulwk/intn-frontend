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
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
