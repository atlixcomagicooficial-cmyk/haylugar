'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
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
    console.log("Iniciando Auth Provider...");
    
    // Safety check
    if (!auth) {
      console.error("Firebase Auth no está inicializado.");
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Estado de Auth cambiado:", user ? "Usuario encontrado" : "Sin usuario");
      setCurrentUser(user ? user : null);
      
      try {
        const currentUserId = await ensureAuthAndGetUserId();
        console.log("UserID obtenido:", currentUserId);
        setUserId(currentUserId);
      } catch (err) {
        console.error("Error obteniendo UserID:", err);
      } finally {
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Error en el listener de Auth:", error);
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

  // CAMBIO IMPORTANTE: Renderizamos children SIEMPRE.
  // Esto permite que page.tsx maneje la UI de carga y muestre los errores de timeout.
  return (
    <AuthContext.Provider value={value}>
      {children}
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