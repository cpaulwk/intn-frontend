import React from 'react';
import IdeaCard from './IdeaCard';
import { useIdeas } from '../../hooks/useIdeas';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../hooks/useSideBar';

const IdeaList: React.FC = () => {
  const { ideas, loading, error, handleUpvote, upvotedIdeas } = useIdeas();
  const { isAuthenticated } = useAuth();
  const { isSidebarOpen } = useSidebar();

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
