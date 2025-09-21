'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('user');
        
        if (authToken && userStr) {
          const user = JSON.parse(userStr);
          setUserInfo(user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Redirect to auth page with return URL
          const currentPath = window.location.pathname;
          router.push(`/auth?redirect=${encodeURIComponent(currentPath)}`);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        router.push('/auth');
      }
    };

    checkAuth();
  }, [router]);

  // Loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected content
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // This shouldn't render due to the redirect, but just in case
  return null;
}
