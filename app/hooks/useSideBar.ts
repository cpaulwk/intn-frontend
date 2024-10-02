import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  handleGoogleLogin,
  handleLogout,
  checkAuthStatus,
} from '../utils/auth';
import { clearRecentlyViewed } from '../slices/ideaSlice';
import { useAuth } from './useAuth';

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
