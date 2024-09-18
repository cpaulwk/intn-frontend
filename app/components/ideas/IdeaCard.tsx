// app/components/IdeaCard.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Idea } from '../../types';
import { addRecentlyViewed } from '../../slices/recentlyViewedSlice';
import { addViewedIdea } from '../../utils/api';
import { Rocket, ChevronDown } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
  handleUpvote: (ideaId: string, isUpvoted: boolean) => Promise<void>;
  isAuthenticated: boolean;
  upvotedIdeas: string[];
}

const IdeaCard: React.FC<IdeaCardProps> = React.memo(
  ({ idea, handleUpvote, isAuthenticated, upvotedIdeas }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState('auto');
    const contentRef = useRef<HTMLParagraphElement>(null);
    const dispatch = useDispatch();
    const toggleExpand = useCallback(() => {
      setIsExpanded((prev) => !prev);
      if (isAuthenticated) {
        dispatch(addRecentlyViewed(idea));
        addViewedIdea(idea).catch((error) =>
          console.error('Error adding viewed idea:', error)
        );
      }
    }, [dispatch, idea, isAuthenticated]);

    useEffect(() => {
      if (contentRef.current) {
        const lineHeight = parseInt(
          window.getComputedStyle(contentRef.current).lineHeight
        );
        const scrollHeight = contentRef.current.scrollHeight;
        setContentHeight(
          isExpanded ? `${scrollHeight}px` : `${lineHeight * 2}px`
        );
      }
    }, [isExpanded]);

    const isUpvoted =
      Array.isArray(upvotedIdeas) && upvotedIdeas.includes(idea._id.toString());

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
      <div
        className={`mb-4 flex min-w-[230px] max-w-2xl flex-col items-start gap-4 rounded-xl border border-primary-100 bg-bg-100 p-4 text-black shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#e1ffff]/80 hover:shadow-lg hover:shadow-[#0085ff]/20 sm:flex-row sm:items-center`}
      >
        <div className="w-full flex-grow sm:w-auto">
          <h3 className="mb-2 text-xl font-bold">{idea.title}</h3>
          <div
            className="overflow-hidden transition-[height] duration-300 ease-in-out"
            style={{ height: contentHeight }}
          >
            <p ref={contentRef} className="text-sm">
              {idea.description}
            </p>
          </div>
          {idea.description.length > 185 && (
            <button
              onClick={toggleExpand}
              className="group mt-1 flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors duration-200 hover:bg-[#0085ff]/20"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Show less' : 'Show more'}
            >
              <ChevronDown
                className={`h-5 w-5 text-[#0085ff] transition-transform duration-300 group-hover:text-[#0066cc] ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>
        <div className="flex flex-row items-center gap-y-2 sm:flex-col">
          <button
            onClick={onUpvote}
            className={`group flex h-12 w-12 items-center justify-center rounded-full p-2 ${
              isAuthenticated
                ? isUpvoted
                  ? 'bg-[#0085ff] text-[#FFFFFF]'
                  : 'border border-[#0085ff] bg-[#FFFFFF] text-[#0085ff] transition-all duration-300 hover:bg-[#e1ffff]'
                : 'bg-gray-300 text-gray-500'
            } `}
            disabled={!isAuthenticated}
          >
            <Rocket
              className={`h-6 w-6 transform ${isUpvoted ? '-rotate-45' : ''} transition-transform duration-300`}
            />
          </button>
          <span className="rounded-full bg-[#e1ffff] px-3 py-1 font-mono text-lg font-semibold text-[#0085ff] sm:text-xl">
            {idea.upvotes}
          </span>
        </div>
      </div>
    );
  }
);

IdeaCard.displayName = 'IdeaCard';

export default IdeaCard;
