import React from 'react';
import BaseSidebar from './BaseSidebar';
import { useSidebar } from '../../../hooks/useSideBar';

const Sidebar: React.FC = () => {
  const { isSidebarOpen } = useSidebar();

  return <BaseSidebar isOpen={isSidebarOpen} />;
};

export default Sidebar;
