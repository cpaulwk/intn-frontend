import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { toggleSidebar } from '../../../slices/sidebarSlice';
import { useSidebar } from '../../../hooks/useSideBar';
import { Menu, LogOut, Ellipsis, Rocket, Trash2 } from 'lucide-react';
import ViewedIdeaModal from './modal/ViewedIdeaModal';
import { useIdeas } from '../../../hooks/useIdeas';
import { useAuth } from '../../../hooks/useAuth';

interface BaseSidebarProps {
  isOpen: boolean;
  isModal?: boolean;
}

const BaseSidebar: React.FC<BaseSidebarProps> = ({
  isOpen,
  isModal = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();
  const { onGoogleLogin, onLogout } = useSidebar();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const ellipsisRefs = useRef<{
    [key: string]: React.RefObject<HTMLButtonElement>;
  }>({});
  const { recentlyViewedIdeas } = useIdeas();
  const toggleModal = (ideaId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click from immediately closing the modal

    if (activeModal === ideaId) {
      closeModal();
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      const modalWidth = 98; // Approximate width of the modal
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
      setActiveModal(ideaId);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalPosition(null);
  };

  const handleUpvote = (ideaId: string) => {
    console.log('Upvote clicked for idea:', ideaId);
    // Implement upvote logic here
  };

  const handleDelete = (ideaId: string) => {
    console.log('Delete clicked for idea:', ideaId);
    // Implement delete logic here
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 ${
        isModal ? 'w-72' : 'w-64'
      } flex flex-col bg-[#e9f9fa] transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-md p-2 text-gray-600 transition-colors duration-200 hover:bg-[#0078e6]/20 hover:text-gray-800"
        >
          <span className="sr-only">Toggle sidebar</span>
          <Menu size={24} />
        </button>
      </div>
      <nav className="flex flex-col p-4">
        <h2 className="mb-4 text-xl font-bold">Navigation</h2>
        <ul className="space-y">
          <li>
            <Link
              href="/"
              className="flex w-full items-center rounded-md p-2 transition-colors duration-200 hover:bg-[#0078e6]/20"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/my-submissions"
              className="flex w-full items-center rounded-md p-2 transition-colors duration-200 hover:bg-[#0078e6]/20"
            >
              My Submissions
            </Link>
          </li>
          <li>
            <Link
              href="/my-favorites"
              className="flex w-full items-center rounded-md p-2 transition-colors duration-200 hover:bg-[#0078e6]/20"
            >
              My Favorites
            </Link>
          </li>
        </ul>
      </nav>
      <section className="flex-1 overflow-y-hidden px-4">
        <h2 className="mb-4 text-xl font-bold">Recently Viewed</h2>
        {recentlyViewedIdeas.length > 0 ? (
          <ul className="h-full overflow-y-auto">
            {recentlyViewedIdeas.map((idea) => {
              const ideaId = idea._id?.toString() || 'placeholder';
              if (!ellipsisRefs.current[ideaId]) {
                ellipsisRefs.current[ideaId] =
                  React.createRef<HTMLButtonElement>();
              }
              return (
                <div
                  key={ideaId}
                  className="group relative overflow-hidden rounded-md"
                >
                  <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-l from-[#e9f9fa] via-[#e9f9fa] via-5% to-transparent to-25% transition-colors duration-200 group-hover:bg-gradient-to-l group-hover:from-[#e9f9fa] group-hover:via-[#e9f9fa] group-hover:via-15% group-hover:to-transparent group-hover:to-35%"></div>
                  <div className="pointer-events-none absolute inset-0 z-20 transition-colors duration-200 group-hover:bg-[#0078e6]/20"></div>
                  <li className="relative">
                    <button
                      ref={ellipsisRefs.current[ideaId]}
                      onClick={(e) => toggleModal(ideaId, e)}
                      className="absolute inset-y-0 right-0 z-30 flex items-center justify-end p-2 opacity-0 duration-100 group-hover:opacity-100"
                    >
                      <Ellipsis size={20} />
                    </button>
                    <Link
                      href={`/ideas/${ideaId}`}
                      className="block overflow-hidden whitespace-nowrap p-2 transition-colors duration-200"
                      title={idea.title || 'Untitled Idea'}
                    >
                      {idea.title || 'Untitled Idea'}
                    </Link>
                  </li>
                </div>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-600">No recently viewed ideas</p>
        )}
      </section>
      <div className="p-4">
        <div className="flex items-center justify-center">
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="flex items-center rounded-md bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600"
            >
              <LogOut size={20} className="mr-2" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={onGoogleLogin}
              className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
              </svg>
              <span>Login with Google</span>
            </button>
          )}
        </div>
      </div>
      <ViewedIdeaModal
        isOpen={activeModal !== null}
        onClose={closeModal}
        onUpvote={() => {
          handleUpvote(activeModal || '');
          closeModal();
        }}
        onDelete={() => {
          handleDelete(activeModal || '');
          closeModal();
        }}
        position={modalPosition}
        triggerRef={activeModal ? ellipsisRefs.current[activeModal] : undefined}
      />
    </div>
  );
};

export default BaseSidebar;
