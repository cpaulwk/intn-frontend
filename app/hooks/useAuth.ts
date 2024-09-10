import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppDispatch } from '../store';
import { setUser } from '../features/auth/authSlice';
import { checkAuthStatus } from '../utils/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    checkAuthStatus(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const userDataParam = searchParams.get('userData');
    if (userDataParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataParam));
        dispatch(setUser(userData));
        router.replace(window.location.pathname);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [searchParams, router, dispatch]);
};