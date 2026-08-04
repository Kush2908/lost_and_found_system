import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProfile, loginUser, registerUser, logoutUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flashMessage, setFlashMessage] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await getProfile();
        setUser(data.user);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    const { data } = await loginUser({ username, password });
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await registerUser(userData);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
    }
  };

  const setFlash = (type, message) => {
    setFlashMessage({ type, message });
  };

  const clearFlash = () => {
    setFlashMessage(null);
  };

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    flashMessage,
    setFlash,
    clearFlash,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
