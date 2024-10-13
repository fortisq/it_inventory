import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser, updateUserProfile } from '../services/api';

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
          console.log("Fetching current user");
          const response = await getCurrentUser();
          console.log("Current user data:", response.data);
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

  const login = async (username, password) => {
    try {
      console.log("Attempting login in AuthContext");
      const response = await apiLogin(username, password);
      console.log("Login response:", response);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setSuccess('Login successful');
      setError(null);
      console.log("User set in state:", response.data.user);
    } catch (err) {
      console.error("Login error in AuthContext:", err);
      setError(err.response?.data?.message || 'An error occurred during login');
      setSuccess(null);
    }
  };

  const register = async (username, email, password, firstName, lastName) => {
    try {
      const response = await apiRegister(username, email, password, firstName, lastName);
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

  const updateProfile = async (userData) => {
    try {
      const response = await updateUserProfile(userData);
      setUser(response.data);
      setSuccess('Profile updated successfully');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating the profile');
      setSuccess(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  const clearMessages = () => {
    clearError();
    clearSuccess();
  };

  const isAuthenticated = () => {
    console.log("Checking authentication, user:", user);
    return !!user;
  };

  const isAdmin = () => {
    return user && (user.role === 'admin' || user.role === 'superadmin');
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
      updateProfile,
      isAuthenticated, 
      isAdmin,
      error, 
      success, 
      setError,
      setSuccess,
      clearError, 
      clearSuccess,
      clearMessages
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
