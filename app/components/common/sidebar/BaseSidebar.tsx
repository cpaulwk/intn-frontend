import React, { useRef } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { toggleSidebar } from '../../../slices/sidebarSlice';
import { useSidebar } from '../../../hooks/useSideBar';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import RecentlyViewedIdeaItem from './content/RecentlyViewedIdeaItem';
import { useIdeas } from '../../../hooks/useIdeas';
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
  const { recentlyViewed } = useIdeas();

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
        {recentlyViewed.length > 0 ? (
          <ul className="h-full overflow-y-auto">
            {recentlyViewed.map((idea) => (
              <RecentlyViewedIdeaItem key={idea._id.toString()} idea={idea} />
            ))}
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
    </div>
  );
};

export default BaseSidebar;
