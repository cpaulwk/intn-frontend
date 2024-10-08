import { createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

import { clearUser, setAuthenticated, setUser } from '../slices/authSlice';
import { clearRecentlyViewed } from '../slices/ideaSlice';
import { AppDispatch, RootState } from '../store';

const selectAuthState = (state: RootState) => state.auth;

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

let authCheckPromise: Promise<boolean> | null = null;
let refreshTimeout: NodeJS.Timeout | null = null;

const getTimeUntilExpiry = () => {
  // Implement logic to calculate time until token expiry
  return 15 * 60 * 1000; // 15 minutes for now, adjust as needed
};

export const checkAuthStatus = async (
  dispatch: AppDispatch
): Promise<boolean> => {
  if (authCheckPromise) {
    return authCheckPromise;
  }

  authCheckPromise = new Promise((resolve) => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/google/check`,
          { withCredentials: true }
        );

        if (response.data.isAuthenticated) {
          dispatch(setAuthenticated(true));
          dispatch(setUser(response.data.user));
          scheduleNextRefresh(dispatch);
          resolve(true);
        } else {
          dispatch(setAuthenticated(false));
          dispatch(clearUser());
          dispatch(clearRecentlyViewed());
          resolve(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch(setAuthenticated(false));
        dispatch(clearUser());
        dispatch(clearRecentlyViewed());
        resolve(false);
      }
    };

    checkAuth();
  });

  return authCheckPromise;
};

const scheduleNextRefresh = (dispatch: AppDispatch) => {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  const timeUntilExpiry = getTimeUntilExpiry();
  refreshTimeout = setTimeout(() => {
    checkAuthStatus(dispatch);
  }, timeUntilExpiry - 60000); // Refresh 1 minute before expiry
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
