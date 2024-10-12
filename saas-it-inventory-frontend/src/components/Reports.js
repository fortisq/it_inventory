import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getReports, getReport, generateReport } from '../services/api';
import './Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchReport(id);
    } else {
      fetchReports();
    }
  }, [id]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const data = await getReports();
      setReports(data);
      setError('');
    } catch (error) {
      setError('Error fetching reports. Please try again.');
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReport = async (reportId) => {
    try {
      setIsLoading(true);
      const data = await getReport(reportId);
      setCurrentReport(data);
      setError('');
    } catch (error) {
      setError('Error fetching report. Please try again.');
      console.error('Error fetching report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async (reportId) => {
    try {
      setIsLoading(true);
      const data = await generateReport(reportId);
      // Handle the generated report data (e.g., display it or offer it for download)
      console.log('Generated report:', data);
      setError('');
    } catch (error) {
      setError('Error generating report. Please try again.');
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (currentReport) {
    return (
      <div className="report-detail">
        <h2>{currentReport.title}</h2>
        {error && <div className="error">{error}</div>}
        <p>{currentReport.description}</p>
        <button onClick={() => handleGenerateReport(currentReport.id)}>Generate Report</button>
        <button onClick={() => navigate('/reports')}>Back to Reports List</button>
      </div>
    );
  }

  return (
    <div className="reports">
      <h2>Reports and Analytics</h2>
      {error && <div className="error">{error}</div>}
      <div className="report-list">
        {reports.map((report) => (
          <div key={report.id} className="report-item">
            <h3>{report.title}</h3>
            <p>{report.description}</p>
            <Link to={`/reports/${report.id}`} className="view-report">View Report</Link>
          </div>
        ))}
      </div>
      <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
    </div>
  );
};

export default Reports;
