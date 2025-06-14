'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';
import { authService } from '../services/auth';
import { userService } from '../services/users';

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  login: async () => { throw new Error('Not implemented'); },
  register: async () => { throw new Error('Not implemented'); },
  logout: () => {},
  refreshUser: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userProfile = await userService.getProfile();
          if (mounted) {
            setUser(userProfile);
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        authService.clearStoredUser();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: userData, tokens } = await authService.login({ email, password });
      setUser(userData);
      return userData;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.clearStoredUser();
    setUser(null);
    router.push('/auth/login');
  };

  const refreshUser = async () => {
    try {
      const userProfile = await userService.getProfile();
      setUser(userProfile);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      authService.clearStoredUser();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 