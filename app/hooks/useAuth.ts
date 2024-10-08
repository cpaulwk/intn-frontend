import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../store';
import { checkAuthStatus } from '../utils/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const authSuccess = searchParams.get('auth') === 'success';
    if (authSuccess) {
      checkAuthStatus(dispatch).then(() => {
        router.replace(window.location.pathname);
      });
    }
  }, [searchParams, router, dispatch]);

  useEffect(() => {
    checkAuthStatus(dispatch);
  }, [dispatch]);

  return { isAuthenticated, user };
};
