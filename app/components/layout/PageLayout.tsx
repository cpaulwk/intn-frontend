import React, { ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar } from '../../slices/sidebarSlice';
import Sidebar from '../common/Sidebar';
import { Menu } from 'lucide-react';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#e0ffff]">
      <Sidebar />
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        {!isSidebarOpen && (
          <button
            className="fixed left-4 top-4 z-20 rounded-md p-2 text-gray-600 transition-colors duration-200 hover:bg-[#0085ff]/20 hover:text-gray-800"
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        )}
        <div
          className={`flex-1 overflow-hidden ${isSidebarOpen ? 'w-[calc(100%-16rem)]' : 'px-20'}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
