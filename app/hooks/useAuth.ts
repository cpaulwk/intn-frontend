import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppDispatch, RootState } from '../store';
import { setUser } from '../slices/authSlice';
import { checkAuthStatus } from '../utils/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

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

  return { isAuthenticated };
};
