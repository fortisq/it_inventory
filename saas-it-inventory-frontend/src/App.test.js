import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the api
jest.mock('./services/api', () => ({
  login: jest.fn(),
  register: jest.fn(),
  getAssets: jest.fn(),
  getLicenses: jest.fn(),
  getCurrentUser: jest.fn(),
  createTenant: jest.fn(),
  getTenants: jest.fn(),
}));

// Mock the AuthContext
jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  }),
}));

test('renders login link when not authenticated', () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </MemoryRouter>
  );
  
  const loginElement = screen.getByText(/Login/i);
  expect(loginElement).toBeInTheDocument();
});
