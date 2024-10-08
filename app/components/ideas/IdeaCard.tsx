// app/components/IdeaCard.tsx
import { MoreHorizontal, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addRecentlyViewed, selectIsIdeaUpvoted } from '../../slices/ideaSlice';
import { RootState } from '../../store';
import { Idea } from '../../types';
import ExpandToggle from './buttons/ExpandToggle';
import IdeaModal from './modal/IdeaModal';
import { useIdeas } from '../../hooks/useIdeas';
import { addViewedIdea } from '../../utils/api';
import { formatUpvoteCount } from '../../utils/formatUtils';
import IdeaFormButton from '../common/buttons/TextButton';

interface IdeaCardProps {
  type?: string;
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

      setExceedsTwoLines(scrollHeight > lineHeight * 2);
      setContentHeight(
        isExpanded ? `${scrollHeight}px` : `${lineHeight * 2}px`
      );
    }
  }, [isExpanded, contentRef]);

  return { exceedsTwoLines, contentHeight };
};

const IdeaCard: React.FC<IdeaCardProps> = memo(
  ({ type, idea, handleUpvote, isAuthenticated, registerIdeaRef }) => {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeModal, setActiveModal] = useState<boolean>(false);
    const [modalPosition, setModalPosition] = useState<{
      top: number;
      left: number;
    } | null>(null);
    const contentRef = useRef<HTMLParagraphElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const ellipsisRef = useRef<HTMLButtonElement>(null);
    const dispatch = useDispatch();
    const { exceedsTwoLines, contentHeight } = useContentHeight(
      contentRef,
      isExpanded
    );
    const isUpvoted = useSelector((state: RootState) =>
      selectIsIdeaUpvoted(state, idea._id.toString())
    );
    const { handleEdit, handleDelete } = useIdeas();

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

    const toggleModal = (event: React.MouseEvent) => {
      event.stopPropagation();

      if (activeModal) {
        closeModal();
      } else {
        const rect = event.currentTarget.getBoundingClientRect();
        const modalWidth = 98;
        const viewportWidth = window.innerWidth;

        let left;
        if (rect.right + modalWidth > viewportWidth) {
          left = rect.left - modalWidth;
        } else {
          left = rect.right - 30;
        }

        setModalPosition({
          top: rect.bottom,
          left: left,
        });
        setActiveModal(true);
      }
    };

    const closeModal = () => {
      setActiveModal(false);
      setModalPosition(null);
    };

    const onEdit = async () => {
      try {
        const redirectUrl = await handleEdit(idea);
        router.push(redirectUrl);
      } catch (error) {
        console.error('Error editing idea:', error);
        // Handle error (e.g., show error message to user)
      }
    };

    const onDelete = async () => {
      try {
        await handleDelete(idea);
        // Optionally, you can add some feedback here, like showing a success message
      } catch (error) {
        console.error('Error deleting idea:', error);
        // Handle error (e.g., show error message to user)
      }
    };

    return (
      <div
        ref={cardRef}
        className={`relative flex min-w-[230px] max-w-2xl flex-col gap-x-4 gap-y-2 rounded-xl border border-primary-100 bg-bg-100 p-4 text-black shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#e1ffff]/80 hover:shadow-lg hover:shadow-[#0085ff]/20 sm:flex-row sm:items-center`}
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
            {isUpvoted !== null && (
              <button
                onClick={() => handleUpvote(idea._id.toString())}
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
            )}
            {type === 'submissions' && (
              <button
                ref={ellipsisRef}
                onClick={toggleModal}
                className="rounded-full p-2 text-gray-500 transition-colors duration-200 hover:bg-[#0078e6]/20 sm:hidden"
              >
                <MoreHorizontal size={20} />
              </button>
            )}
          </div>
        </div>
        <IdeaModal
          isOpen={activeModal}
          onClose={closeModal}
          idea={idea}
          position={modalPosition}
          triggerRef={ellipsisRef}
        />
        {type === 'submissions' && (
          <div className="mb-2 flex flex-col justify-center gap-2 max-sm:hidden">
            <IdeaFormButton onClick={onEdit} variant="primary">
              Edit
            </IdeaFormButton>
            <IdeaFormButton onClick={onDelete} variant="danger">
              Delete
            </IdeaFormButton>
          </div>
        )}
      </div>
    );
  }
);

IdeaCard.displayName = 'IdeaCard';
export default IdeaCard;
