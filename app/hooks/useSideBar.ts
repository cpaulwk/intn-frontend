import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearRecentlyViewed } from '../slices/ideaSlice';
import { AppDispatch, RootState } from '../store';
import { useAuth } from './useAuth';
import {
  checkAuthStatus,
  handleGoogleLogin,
  handleLogout,
} from '../utils/auth';

export const useSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);

  const onGoogleLogin = useCallback(async () => {
    try {
      await handleGoogleLogin();
      await checkAuthStatus(dispatch);
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  }, [dispatch]);

  const onLogout = useCallback(async () => {
    try {
      await handleLogout(dispatch);
      dispatch(clearRecentlyViewed());
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [dispatch]);

  return {
    isAuthenticated,
    isSidebarOpen,
    onGoogleLogin,
    onLogout,
  };
};
