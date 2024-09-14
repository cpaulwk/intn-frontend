import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { handleGoogleLogin, handleLogout, checkAuthStatus } from '../utils/auth';
import { clearRecentlyViewed } from '../slices/addRecentlyViewed';

export const useSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const onGoogleLogin = useCallback(async () => {
    try {
      await handleGoogleLogin();
      // After redirecting back from Google, we need to check the auth status
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
    onGoogleLogin,
    onLogout
  };
};