// app/components/IdeaCard.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Idea } from '../../types';
import { addRecentlyViewed } from '../../slices/addRecentlyViewed';
import { addViewedIdea } from '../../utils/api';
import { Rocket, ChevronDown } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
  handleUpvote: (ideaId: string, isUpvoted: boolean) => Promise<void>;
  isAuthenticated: boolean;
  upvotedIdeas: string[];
}

const IdeaCard: React.FC<IdeaCardProps> = React.memo(({ idea, handleUpvote, isAuthenticated, upvotedIdeas }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState('auto');
  const contentRef = useRef<HTMLParagraphElement>(null);
  const dispatch = useDispatch();

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
    if (isAuthenticated) {
      dispatch(addRecentlyViewed(idea));
      addViewedIdea(idea).catch(error => console.error('Error adding viewed idea:', error));
    }
  }, [dispatch, idea, isAuthenticated]);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight);
      const scrollHeight = contentRef.current.scrollHeight;
      setContentHeight(isExpanded ? `${scrollHeight}px` : `${lineHeight * 2}px`);
    }
  }, [isExpanded]);

  const isUpvoted = Array.isArray(upvotedIdeas) && upvotedIdeas.includes(idea._id.toString());

  const onUpvote = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await handleUpvote(idea._id.toString(), isUpvoted);
        dispatch(addRecentlyViewed(idea));
        await addViewedIdea(idea);
      } catch (error) {
        console.error('Error toggling upvote:', error);
      }
    } else {
      console.log('User must be authenticated to upvote');
    }
  }, [handleUpvote, idea, isUpvoted, dispatch, isAuthenticated]);

  const handleIdeaClick = async () => {
    if (isAuthenticated) {
      try {
        await addViewedIdea(idea);
      } catch (error) {
        console.error('Error adding viewed idea:', error);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center min-w-[230px] w-full bg-bg-100 border border-primary-100 text-black backdrop-blur-md hover:bg-[#e1ffff]/80 transition-all duration-300 p-4 rounded-xl mb-4 shadow-md hover:shadow-lg hover:shadow-[#0085ff]/20 hover:-translate-y-1 gap-4">
      <div className="flex-grow w-full sm:w-auto">
        <h3 className="text-xl font-bold mb-2">{idea.title}</h3>
        <div className="overflow-hidden transition-[height] duration-300 ease-in-out" style={{ height: contentHeight }}>
          <p
            ref={contentRef}
            className="text-sm"
          >
            {idea.description}
          </p>
        </div>
        {idea.description.length > 185 && (
          <button
            onClick={toggleExpand}
            className="text-sm mt-1 flex items-center justify-center hover:bg-[#0085ff]/20 rounded-md transition-colors duration-200 group w-8 h-8"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Show less" : "Show more"}
          >
            <ChevronDown 
              className={`w-5 h-5 text-[#0085ff] group-hover:text-[#0066cc] transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>
      <div className="flex flex-row sm:flex-col items-center gap-y-2">
        <button
          onClick={onUpvote}
          className={`
            rounded-full p-2 w-12 h-12 flex items-center justify-center group
            ${isAuthenticated
              ? isUpvoted
                ? 'bg-[#0085ff] text-[#FFFFFF]'
                : 'bg-[#FFFFFF] text-[#0085ff] border border-[#0085ff] hover:bg-[#e1ffff] transition-all duration-300'
              : 'bg-gray-300 text-gray-500'
            }
          `}
          disabled={!isAuthenticated}
        >
          <Rocket className={`h-6 w-6 transform ${isUpvoted ? '-rotate-45' : ''} transition-transform duration-300`} />
        </button>
        <span className="bg-[#e1ffff] text-[#0085ff] font-mono text-lg sm:text-xl font-semibold px-3 py-1 rounded-full">{idea.upvotes}</span>
      </div>
    </div>
  );
});

IdeaCard.displayName = 'IdeaCard';

export default IdeaCard;
