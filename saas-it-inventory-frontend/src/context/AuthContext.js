import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await getCurrentUser();
          setUser(response.data);
        } catch (err) {
          console.error('Error fetching user data:', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setSuccess('Login successful');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      setSuccess(null);
    }
  };

  const register = async (email, password, firstName, lastName) => {
    try {
      const response = await apiRegister(email, password, firstName, lastName);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setSuccess('Registration successful');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
      setSuccess(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSuccess('Logout successful');
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated, 
      isAdmin,
      error, 
      success, 
      setError,
      setSuccess,
      clearError, 
      clearSuccess 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
