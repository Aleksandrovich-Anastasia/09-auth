'use client';
import { getMe, checkSession } from '../../lib/api/clientApi';
import { useAuthStore } from '../../lib/store/authStore';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Loader from '../../app/loading';

type Props = {
  children: React.ReactNode;};

const privateRoutes = ['/profile']

const AuthProvider = ({ children }: Props) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      try {
        const isAuthenticated = await checkSession();

        if (isAuthenticated) {
          const user = await getMe();
          if (user) {
            setUser(user);
          } else {
            clearIsAuthenticated();
          }
        } else {
          clearIsAuthenticated();

          const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
          if (isPrivate) {
            router.replace('/login'); 
            return;
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname, setUser, clearIsAuthenticated, router]);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthProvider;