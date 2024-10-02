import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../slices/sidebarSlice';
import Sidebar from '../common/sidebar/Sidebar';
import SidebarModal from '../common/sidebar/SidebarModal';
import { useScreenSize } from '../../hooks/useScreenSize';
import { Menu } from 'lucide-react';
import { useSidebar } from '../../hooks/useSideBar';
import { useIdeasLoader } from '../../hooks/useIdeasLoader';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSidebar();
  const isSmallScreen = useScreenSize();

  useIdeasLoader();

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#e0ffff]">
      {!isSmallScreen && <Sidebar />}
      {isSmallScreen && <SidebarModal />}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${isSidebarOpen && !isSmallScreen ? 'ml-64' : 'ml-0'}`}
      >
        <button
          className="fixed left-4 top-4 z-20 rounded-md p-2 text-gray-600 transition-colors duration-200 hover:bg-[#0085ff]/20 hover:text-gray-800"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <div className={`flex-1 flex-col items-center`}>{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
