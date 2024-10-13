import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Message from './Message';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, error, success, clearError, clearSuccess, isAuthenticated } = useAuth();

  useEffect(() => {
    return () => {
      clearError();
      clearSuccess();
    };
  }, [clearError, clearSuccess]);

  useEffect(() => {
    console.log("Authentication status:", isAuthenticated());
    if (isAuthenticated()) {
      console.log("User is authenticated, navigating to profile");
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    if (!username.trim()) {
      return 'Username is required';
    }
    if (!password.trim()) {
      return 'Password is required';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submitted");
    const validationError = validateForm();
    if (validationError) {
      clearError();
      clearSuccess();
      return;
    }

    setIsLoading(true);
    console.log("Attempting login with username:", username);
    try {
      await login(username, password);
      console.log("Login function completed");
    } catch (err) {
      console.error("Login error:", err);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <Message type="error">{error}</Message>}
      {success && <Message type="success">{success}</Message>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
