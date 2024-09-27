import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { Ellipsis } from 'lucide-react';
import ViewedIdeaModal from '../modal/ViewedIdeaModal';
import { useIdeas } from '../../../../hooks/useIdeas';
import { useAuth } from '../../../../hooks/useAuth';
import { addRecentlyViewed } from '../../../../slices/recentlyViewedSlice';
import { addViewedIdea } from '../../../../utils/api';
import { Idea } from '../../../../types';

interface RecentlyViewedIdeaItemProps {
  idea: Idea;
}

const RecentlyViewedIdeaItem: React.FC<RecentlyViewedIdeaItemProps> = ({
  idea,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();
  const { handleUpvote } = useIdeas();
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const ellipsisRef = useRef<HTMLButtonElement>(null);

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

  const handleDelete = () => {
    console.log('Delete clicked for idea:', idea._id);
    // Implement delete logic here
  };

  return (
    <div className="group relative overflow-hidden rounded-md">
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-l from-[#e9f9fa] via-[#e9f9fa] via-5% to-transparent to-25% transition-colors duration-200 group-hover:bg-gradient-to-l group-hover:from-[#e9f9fa] group-hover:via-[#e9f9fa] group-hover:via-15% group-hover:to-transparent group-hover:to-35%"></div>
      <div className="pointer-events-none absolute inset-0 z-20 transition-colors duration-200 group-hover:bg-[#0078e6]/20"></div>
      <li className="relative">
        <button
          ref={ellipsisRef}
          onClick={toggleModal}
          className="absolute inset-y-0 right-0 z-30 flex items-center justify-end p-2 opacity-0 duration-100 group-hover:opacity-100"
        >
          <Ellipsis size={20} />
        </button>
        <Link
          href={`/ideas/${idea._id}`}
          className="block overflow-hidden whitespace-nowrap p-2 transition-colors duration-200"
          title={idea.title || 'Untitled Idea'}
        >
          {idea.title || 'Untitled Idea'}
        </Link>
      </li>
      <ViewedIdeaModal
        isOpen={activeModal}
        onClose={closeModal}
        handleUpvote={handleUpvote}
        ideaId={idea._id.toString()}
        onDelete={() => {
          handleDelete();
          closeModal();
        }}
        position={modalPosition}
        triggerRef={ellipsisRef}
      />
    </div>
  );
};

export default RecentlyViewedIdeaItem;
