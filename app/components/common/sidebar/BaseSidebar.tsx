import React, { useRef } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store';
import { toggleSidebar } from '../../../slices/sidebarSlice';
import { useSidebar } from '../../../hooks/useSideBar';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import RecentlyViewedIdeaItem from './content/RecentlyViewedIdeaItem';
import { selectRecentlyViewedIdeas } from '../../../slices/ideaSlice';
import AuthButton from './buttons/AuthButton';

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
  const sidebarRef = useRef<HTMLDivElement>(null);
  const recentlyViewedIdeas = useSelector(selectRecentlyViewedIdeas);

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
        {recentlyViewedIdeas.map((idea) => (
          <RecentlyViewedIdeaItem key={idea._id.toString()} idea={idea} />
        ))}
      </section>
      <div className="p-4">
        <div className="flex items-center justify-center">
          {isAuthenticated ? (
            <AuthButton type="Logout" onClick={onLogout} />
          ) : (
            <AuthButton type="Login" onClick={onGoogleLogin} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BaseSidebar;
