import { AppDispatch } from '../store';
import { setUser, clearUser } from '../slices/authSlice';
import { clearRecentlyViewed } from '../slices/recentlyViewedSlice';
import axios from 'axios';

let refreshTimeout: NodeJS.Timeout | null = null;

export const silentRefresh = async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google/refresh`,
      {},
      { withCredentials: true }
    );
    if (response.data.message === 'Tokens refreshed successfully') {
      await checkAuthStatus(dispatch);
      scheduleNextRefresh(dispatch);
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    console.error('Silent refresh failed:', error);
    if (refreshTimeout) clearTimeout(refreshTimeout);
    await handleLogout(dispatch);
  }
};

const scheduleNextRefresh = (dispatch: AppDispatch) => {
  if (refreshTimeout) clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(
    () => silentRefresh(dispatch),
    14 * 60 * 1000 // 14 minutes
  ) as unknown as NodeJS.Timeout;
};

export const checkAuthStatus = async (
  dispatch: AppDispatch
): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google/check`,
      { withCredentials: true }
    );

    if (response.data.isAuthenticated) {
      dispatch(setUser(response.data.user));
      scheduleNextRefresh(dispatch);
      return true;
    } else {
      dispatch(clearUser());
      dispatch(clearRecentlyViewed());
      return false;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    dispatch(clearUser());
    dispatch(clearRecentlyViewed());
    return false;
  }
};

export const handleGoogleLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = `${process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL}`;
  }
};

export const handleLogout = async (dispatch: AppDispatch) => {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google/logout`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    dispatch(clearUser());
    dispatch(clearRecentlyViewed());
  }
};
