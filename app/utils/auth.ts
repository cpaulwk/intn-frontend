import { AppDispatch } from '../store';
import { setUser, clearUser } from '../features/auth/authSlice';
import axios from 'axios';

export const checkAuthStatus = async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/check`, { withCredentials: true });
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
