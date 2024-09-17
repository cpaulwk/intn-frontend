import React, { ReactNode, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar } from '../../slices/sidebarSlice';
import Sidebar from '../common/Sidebar';
import SidebarModal from '../common/SidebarModal';
import { Menu } from 'lucide-react';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640); // 640px is the default 'sm' breakpoint in Tailwind
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
