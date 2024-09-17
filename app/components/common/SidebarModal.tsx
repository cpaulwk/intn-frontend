import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar } from '../../slices/sidebarSlice';
import BaseSidebar from './BaseSidebar';

const SidebarModal: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}
      <BaseSidebar isOpen={isOpen} isModal={true} />
    </>
  );
};

export default SidebarModal;
