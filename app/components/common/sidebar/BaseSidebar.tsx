import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { toggleSidebar } from '../../../slices/sidebarSlice';
import { useSidebar } from '../../../hooks/useSideBar';
import { Menu, LogOut } from 'lucide-react';

interface BaseSidebarProps {
  isOpen: boolean;
  isModal?: boolean;
}

const BaseSidebar: React.FC<BaseSidebarProps> = ({
  isOpen,
  isModal = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const recentlyViewedIdeas = useSelector(
    (state: RootState) => state.recentlyViewed.ideas
  );
  const { onGoogleLogin, onLogout } = useSidebar();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 ${isModal ? 'w-72' : 'w-64'} transform bg-[#c7e7f6] transition-transform duration-300 ease-in-out ${
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
      <nav className="p-4">
        <h2 className="mb-4 text-xl font-bold">Navigation</h2>
        <ul className="">
          <li>
            <Link
              href="/"
              className="block w-full rounded-md p-2 transition-colors duration-200 hover:bg-[#0078e6]/20"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/my-submissions"
              className="block w-full rounded-md p-2 transition-colors duration-200 hover:bg-[#0078e6]/20"
            >
              My Submissions
            </Link>
          </li>
          <li>
            <Link
              href="/my-favorites"
              className="block w-full rounded-md p-2 transition-colors duration-200 hover:bg-[#0078e6]/20"
            >
              My Favorites
            </Link>
          </li>
        </ul>
      </nav>
      <section className="p-4">
        <h2 className="mb-4 text-xl font-bold">Recently Viewed</h2>
        <ul>
          {recentlyViewedIdeas.map((idea) =>
            idea._id ? (
              <li key={idea._id.toString()} className="">
                <Link
                  href={`/ideas/${idea._id.toString()}`}
                  className="block w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-md p-2 transition-colors duration-200 hover:bg-[#0078e6]/20"
                  title={idea.title}
                >
                  {idea.title}
                </Link>
              </li>
            ) : null
          )}
        </ul>
      </section>
      <div className="absolute bottom-0 left-0 w-full p-4">
        <div className="flex items-center justify-between">
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
