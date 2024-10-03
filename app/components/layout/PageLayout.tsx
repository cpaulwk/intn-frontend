import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../slices/sidebarSlice';
import Sidebar from '../common/sidebar/Sidebar';
import SidebarModal from '../common/sidebar/SidebarModal';
import { useScreenSize } from '../../hooks/useScreenSize';
import { Menu } from 'lucide-react';
import { useSidebar } from '../../hooks/useSideBar';
import { useIdeasLoader } from '../../hooks/useIdeasLoader';
import Header from '../common/Header';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  isLoading?: boolean;
  error?: string | null;
  isAuthenticated?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  isLoading,
  error,
  isAuthenticated,
}) => {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSidebar();
  const isSmallScreen = useScreenSize();

  useIdeasLoader();

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#e0ffff]">
      {!isSmallScreen && <Sidebar />}
      {isSmallScreen && <SidebarModal />}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          isSidebarOpen && !isSmallScreen ? 'ml-64' : 'ml-0'
        }`}
      >
        <button
          className="fixed left-4 top-4 z-20 rounded-md p-2 text-gray-600 transition-colors duration-200 hover:bg-[#0085ff]/20 hover:text-gray-800"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="flex h-full flex-col">
          <Header />
          {title && (
            <h2 className="mb-4 mt-2 text-center text-2xl font-bold">
              {title}
            </h2>
          )}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-gray-600">Loading...</p>
              </div>
            ) : error ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-red-600">{error}</p>
              </div>
            ) : !isAuthenticated ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-gray-600">
                  Please log in to view this content.
                </p>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
