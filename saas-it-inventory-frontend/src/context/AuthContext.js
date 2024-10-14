import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/api/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUserData }));
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
