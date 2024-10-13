import React, { useState, useEffect } from 'react';
import { getReports, generateReport } from '../services/api';

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getReports();
      setReports(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch reports. Please try again later.');
      setLoading(false);
    }
  };

  const handleGenerateReport = async (reportType) => {
    try {
      setLoading(true);
      await generateReport(reportType);
      await fetchReports(); // Refresh the list of reports
      setLoading(false);
    } catch (err) {
      setError('Failed to generate report. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Reports</h2>
      <div>
        <h3>Generate New Report</h3>
        <button onClick={() => handleGenerateReport('inventory')}>Generate Inventory Report</button>
        <button onClick={() => handleGenerateReport('assets')}>Generate Assets Report</button>
        <button onClick={() => handleGenerateReport('subscriptions')}>Generate Subscriptions Report</button>
      </div>
      <div>
        <h3>Available Reports</h3>
        {reports.length === 0 ? (
          <p>No reports available. Generate a new report to see it here.</p>
        ) : (
          <ul>
            {reports.map((report) => (
              <li key={report.id}>
                {report.name} - Generated on: {new Date(report.generatedAt).toLocaleString()}
                <a href={report.downloadUrl} target="_blank" rel="noopener noreferrer">Download</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Reports;
