'use client'; // 👈 ESTO ES OBLIGATORIO PARA USAR CONTEXT/HOOKS

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
// Usamos alias @/ para asegurar la ruta a firebase config
import { auth, ensureAuthAndGetUserId } from '@/firebase/config'; 

interface AuthContextType {
  currentUser: User | null;
  userId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user ? user : null);
      const currentUserId = await ensureAuthAndGetUserId();
      setUserId(currentUserId);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []); 

  const value: AuthContextType = {
    currentUser,
    userId,
    isLoading,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};