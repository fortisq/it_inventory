import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Reports from './Reports';
import * as api from '../services/api';

jest.mock('../services/api');

const mockReports = [
  { id: '1', title: 'Asset Report', description: 'Overview of all assets' },
  { id: '2', title: 'License Report', description: 'Summary of software licenses' },
];

const renderReports = () => {
  render(
    <Router>
      <AuthProvider>
        <Reports />
      </AuthProvider>
    </Router>
  );
};

describe('Reports Component', () => {
  beforeEach(() => {
    api.getReports.mockResolvedValue(mockReports);
    api.getReport.mockResolvedValue(mockReports[0]);
    api.generateReport.mockResolvedValue({ data: 'Generated report data' });
  });

  it('renders the reports list', async () => {
    renderReports();

    await waitFor(() => {
      expect(screen.getByText('Asset Report')).toBeInTheDocument();
      expect(screen.getByText('License Report')).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    renderReports();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    api.getReports.mockRejectedValue(new Error('Failed to fetch reports'));
    renderReports();

    await waitFor(() => {
      expect(screen.getByText('Error fetching reports. Please try again.')).toBeInTheDocument();
    });
  });

  it('navigates to individual report view', async () => {
    renderReports();

    await waitFor(() => {
      userEvent.click(screen.getAllByText('View Report')[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Generate Report')).toBeInTheDocument();
    });
  });

  it('generates a report', async () => {
    renderReports();

    await waitFor(() => {
      userEvent.click(screen.getAllByText('View Report')[0]);
    });

    await waitFor(() => {
      userEvent.click(screen.getByText('Generate Report'));
    });

    await waitFor(() => {
      expect(api.generateReport).toHaveBeenCalledWith('1');
    });
  });
});
