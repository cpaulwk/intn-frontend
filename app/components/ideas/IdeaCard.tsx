// app/components/IdeaCard.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Idea } from '../../types';
import { addRecentlyViewed } from '../../slices/ideaSlice';
import { addViewedIdea } from '../../utils/api';
import { Rocket } from 'lucide-react';
import ExpandToggle from './buttons/ExpandToggle';
import { formatUpvoteCount } from '../../utils/formatUtils';

interface IdeaCardProps {
  idea: Idea;
  handleUpvote: (ideaId: string) => Promise<void>;
  isAuthenticated: boolean;
  registerIdeaRef: (id: string, element: HTMLDivElement | null) => void;
}

const useContentHeight = (
  contentRef: React.RefObject<HTMLParagraphElement>,
  isExpanded: boolean
) => {
  const [exceedsTwoLines, setExceedsTwoLines] = useState(false);
  const [contentHeight, setContentHeight] = useState('auto');

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(contentRef.current).lineHeight
      );
      const scrollHeight = contentRef.current.scrollHeight;
      const clientHeight = contentRef.current.clientHeight;

      setExceedsTwoLines(scrollHeight > lineHeight * 2);
      setContentHeight(
        isExpanded ? `${scrollHeight}px` : `${lineHeight * 2}px`
      );
    }
  }, [isExpanded, contentRef]);

  return { exceedsTwoLines, contentHeight };
};

const isUpvoted = (idea: Idea) => {
  return idea.isUpvoted;
};

const IdeaCard: React.FC<IdeaCardProps> = React.memo(
  ({ idea, handleUpvote, isAuthenticated, registerIdeaRef }) => {
    console.log('registerIdeaRef in IdeaCard:', typeof registerIdeaRef);
    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef<HTMLParagraphElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const { exceedsTwoLines, contentHeight } = useContentHeight(
      contentRef,
      isExpanded
    );

    useEffect(() => {
      registerIdeaRef(idea._id.toString(), cardRef.current);
    }, [idea._id, registerIdeaRef]);

    const toggleExpand = useCallback(() => {
      setIsExpanded((prev) => !prev);
      if (isAuthenticated) {
        dispatch(addRecentlyViewed(idea));
        addViewedIdea(idea._id.toString()).catch((error) =>
          console.error('Error adding viewed idea:', error)
        );
      }
    }, [dispatch, idea, isAuthenticated]);

    return (
      <div
        ref={cardRef}
        className={`relative mb-4 flex min-w-[230px] max-w-2xl flex-col gap-x-4 gap-y-2 rounded-xl border border-primary-100 bg-bg-100 p-4 text-black shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#e1ffff]/80 hover:shadow-lg hover:shadow-[#0085ff]/20 sm:flex-row sm:items-center`}
      >
        <div className="h-full flex-grow justify-start">
          <h3 className="mb-2 text-xl font-bold">{idea.title}</h3>
          <div
            className="overflow-hidden transition-[height] duration-300 ease-in-out"
            style={{ height: contentHeight }}
          >
            <p ref={contentRef} className="text-sm">
              {idea.description}
            </p>
          </div>
          {exceedsTwoLines && (
            <ExpandToggle
              isExpanded={isExpanded}
              toggleExpand={toggleExpand}
              showOnMobile={false}
            />
          )}
        </div>
        <div className="flex items-center gap-2 max-sm:w-full max-sm:justify-between sm:flex-col sm:items-end">
          {exceedsTwoLines && (
            <ExpandToggle
              isExpanded={isExpanded}
              toggleExpand={toggleExpand}
              showOnMobile={true}
            />
          )}
          <div className="flex flex-row items-center gap-x-2 sm:flex-col-reverse sm:gap-y-2">
            <span className="rounded-full bg-[#e1ffff] px-3 py-1 font-mono font-semibold text-[#0085ff]">
              {formatUpvoteCount(idea.upvotes)}
            </span>
            <button
              onClick={() => handleUpvote(idea._id.toString())}
              className={`group flex h-12 w-12 items-center justify-center rounded-full p-2 ${
                isAuthenticated
                  ? isUpvoted(idea)
                    ? 'bg-[#0085ff] text-[#FFFFFF]'
                    : 'border border-[#0085ff] bg-[#FFFFFF] text-[#0085ff] transition-all duration-300 hover:bg-[#e1ffff]'
                  : 'bg-gray-300 text-gray-500'
              } `}
              disabled={!isAuthenticated}
            >
              <Rocket
                className={`h-6 w-6 transform ${isUpvoted(idea) ? '-rotate-45' : ''} transition-transform duration-300`}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

IdeaCard.displayName = 'IdeaCard';

export default IdeaCard;
