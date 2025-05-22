'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = {
  displayName: string;
  id: string;
  photos: { value: string }[];
  _json: any;
} | null;

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/user', {
        credentials: 'include',
      });
      const data = await response.json();
      
      setUser(data.user);
      setIsAuthenticated(data.isAuthenticated);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    window.location.href = 'http://localhost:3001/auth/logout';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 