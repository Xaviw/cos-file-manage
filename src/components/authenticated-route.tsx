import { useEffect, type ReactNode } from 'react';
import { useUser } from '@/contexts/user-context';

interface AuthenticatedRouteProps {
  children: ReactNode;
}

export default function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      location.href = '/login';
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
