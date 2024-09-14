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
    <div className="flex h-screen bg-gradient-to-br from-[#e0ffff] overflow-hidden">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {!isSidebarOpen && (
          <button
            className="fixed top-4 left-4 z-20 p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-[#0085ff]/20 transition-colors duration-200"
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        )}
        <div className={`mx-auto ${isSidebarOpen ? 'w-[calc(100%-16rem)]' : 'px-20'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;