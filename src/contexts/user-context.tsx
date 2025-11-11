import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { supabase } from '@/lib/client';

interface User {
  email: string;
  id: string;
  role: 'admin' | 'user';
  is_banned: boolean;
  banned_until?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  isAdmin: boolean;
  isBanned: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          role: authUser.app_metadata?.role || 'user',
          is_banned: authUser.app_metadata?.banned || false,
          banned_until: authUser.banned_until,
        });
      }
      setIsLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: session.user.app_metadata?.role || 'user',
          is_banned: session.user.app_metadata?.banned || false,
          banned_until: session.user.banned_until,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const isAdmin = user?.role === 'admin';
  const isBanned = user?.is_banned || false;

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, isAdmin, isBanned }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
