import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../../slices/sidebarSlice';
import BaseSidebar from './BaseSidebar';
import { useSidebar } from '../../../hooks/useSideBar';

const SidebarModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSidebar();

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}
      <BaseSidebar isOpen={isSidebarOpen} isModal={true} />
    </>
  );
};

export default SidebarModal;
