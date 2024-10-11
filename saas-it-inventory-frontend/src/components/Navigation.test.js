import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './Navigation';
import { AuthProvider } from '../context/AuthContext';

// Mock the AuthContext
jest.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    isAuthenticated: true,
    user: { role: 'user' },
    logout: jest.fn(),
  }),
}));

describe('Navigation Component', () => {
  test('renders navigation links when authenticated', () => {
    render(
      <Router>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </Router>
    );

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Inventory/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });
});
