import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import BaseSidebar from './BaseSidebar';

const Sidebar: React.FC = () => {
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);

  return <BaseSidebar isOpen={isOpen} />;
};

export default Sidebar;
