import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/lib/axios';
import { AUTH_API, STORAGE_KEYS } from '@/constants/api.constants';
import type { User, AuthResponse, AuthContextType } from '@/types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.JWT_TOKEN);
      if (token) {
        const response = await api.get<AuthResponse>(AUTH_API.CHECK);
        if (response.data.access_token) {
          await SecureStore.setItemAsync(STORAGE_KEYS.JWT_TOKEN, response.data.access_token);
          if (response.data.refreshToken) {
            await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
          }
        }
        const userData = response.data.user || (response.data as unknown as User);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.JWT_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const isEmail = email.indexOf('@') !== -1;
    const data = isEmail ? { email, password } : { phoneNbr: email, password };
    const response = await api.post<AuthResponse>(AUTH_API.LOGIN, data);

    if (response.data.access_token) {
      await SecureStore.setItemAsync(STORAGE_KEYS.JWT_TOKEN, response.data.access_token);
      if (response.data.refreshToken) {
        await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      }
    }

    const userData = response.data.user || (response.data as unknown as User);
    setUser(userData);
  };

  const signup = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>(AUTH_API.REGISTER, { email, password });
    const userData = response.data.user || (response.data as unknown as User);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post(AUTH_API.LOGOUT);
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }
    await SecureStore.deleteItemAsync(STORAGE_KEYS.JWT_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
