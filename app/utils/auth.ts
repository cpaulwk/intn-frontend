import { AppDispatch } from '../store';
import { setUser, clearUser } from '../slices/authSlice';
import axios from 'axios';

export const checkAuthStatus = async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google/check`,
      { withCredentials: true }
    );
    if (response.data.isAuthenticated) {
      dispatch(setUser(response.data.user));
    } else {
      dispatch(clearUser());
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    dispatch(clearUser());
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
    // Always clear the user data, regardless of the server response
    dispatch(clearUser());
  }
};
