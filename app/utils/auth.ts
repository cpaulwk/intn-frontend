import { AppDispatch } from '../store';
import { setUser, clearUser, setAuthenticated } from '../slices/authSlice';
import { clearRecentlyViewed } from '../slices/recentlyViewedSlice';
import axios from 'axios';

let refreshInterval: NodeJS.Timeout | null = null;

export const silentRefresh = async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google/refresh`,
      {},
      { withCredentials: true }
    );
    if (response.data.message === 'Tokens refreshed successfully') {
      await checkAuthStatus(dispatch);
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    console.error(
      'Silent refresh failed:',
      error instanceof Error ? error.message : String(error)
    );
    dispatch(setAuthenticated(false));
    dispatch(clearUser());
    dispatch(clearRecentlyViewed());
    if (refreshInterval) clearInterval(refreshInterval);
    await handleLogout(dispatch);
  }
};

const scheduleNextRefresh = (dispatch: AppDispatch) => {
  if (refreshInterval) clearInterval(refreshInterval);
  const timeUntilExpiry = getTimeUntilExpiry();
  refreshInterval = setTimeout(
    () => {
      silentRefresh(dispatch);
    },
    timeUntilExpiry - 60 * 1000 // Refresh 1 minute before expiry
  ) as unknown as NodeJS.Timeout;
};

const getTimeUntilExpiry = () => {
  // Implement logic to calculate time until token expiry
  // This could be based on the token's expiration claim or a fixed time
  return 15 * 60 * 1000; // 15 minutes for now, adjust as needed
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
      dispatch(setAuthenticated(true));
      dispatch(setUser(response.data.user));
      scheduleNextRefresh(dispatch); // Schedule the next refresh
      return true;
    } else {
      dispatch(setAuthenticated(false));
      dispatch(clearUser());
      dispatch(clearRecentlyViewed());
      return false;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    dispatch(setAuthenticated(false));
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
