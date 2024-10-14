import React, { useState, useEffect, useCallback } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { FaDownload, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import api from '../services/api';
import { barChartOptions, createChartData } from '../utils/chartGenerator';
import { downloadReport, downloadPDFReport, downloadAllReports } from '../utils/reportDownload';
import './Reports.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Reports = () => {
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [reportData, setReportData] = useState({
    assets: null,
    subscriptions: null,
    inventory: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      const [assetResponse, subscriptionResponse, inventoryResponse] = await Promise.all([
        api.get('/api/reports/assets'),
        api.get('/api/reports/subscriptions'),
        api.get('/api/reports/inventory')
      ]);

      setReportData({
        assets: assetResponse.data,
        subscriptions: subscriptionResponse.data,
        inventory: inventoryResponse.data
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to fetch report data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleDownload = async (reportType, format = 'excel') => {
    try {
      setDownloadStatus('Generating report...');
      if (reportType === 'all') {
        if (format === 'excel') {
          downloadAllReports(reportData);
        } else {
          await downloadPDFReport(reportData);
        }
      } else {
        if (format === 'excel') {
          downloadReport(reportData[reportType], reportType);
        } else {
          await downloadPDFReport({ [reportType]: reportData[reportType] });
        }
      }
      setDownloadStatus('Report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading report:', error);
      setDownloadStatus(`Failed to download report: ${error.message}`);
    } finally {
      setTimeout(() => setDownloadStatus(null), 3000);
    }
  };

  if (loading) {
    return <div className="reports-loading">Loading report data...</div>;
  }

  if (error) {
    return (
      <div className="reports-error">
        {error}
        <button className="retry-button" onClick={fetchReportData}>Retry</button>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const updatedBarChartOptions = {
    ...barChartOptions,
    ...chartOptions,
    scales: {
      ...barChartOptions.scales,
      y: {
        ...barChartOptions.scales.y,
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
  };

  const assetChartData = createChartData(reportData.assets?.assetsByStatus, 'Assets by Status');
  const assetBarChartData = createChartData(reportData.assets?.assetsByType, 'Assets by Type');
  const subscriptionChartData = createChartData(reportData.subscriptions?.subscriptionsByVendor, 'Subscriptions by Vendor');
  const subscriptionBarChartData = createChartData(reportData.subscriptions?.subscriptionsByVendor, 'Subscriptions by Vendor');
  const inventoryChartData = createChartData(reportData.inventory?.itemsByCategory, 'Items by Category');
  const inventoryBarChartData = createChartData(reportData.inventory?.itemsByLocation, 'Items by Location');

  return (
    <div className="reports-container">
      <h1 className="reports-title">Reports Dashboard</h1>
      <div className="download-buttons">
        <button onClick={() => handleDownload('all', 'excel')} className="download-button" aria-label="Download All Reports as Excel">
          <FaFileExcel /> Download All Reports (Excel)
        </button>
        <button onClick={() => handleDownload('all', 'pdf')} className="download-button" aria-label="Download All Reports as PDF">
          <FaFilePdf /> Download All Reports (PDF)
        </button>
      </div>
      {downloadStatus && <div className="download-status" aria-live="polite">{downloadStatus}</div>}
      
      <ReportSection
        title="Asset Summary"
        reportType="assets"
        data={reportData.assets}
        chartData={assetChartData}
        barChartData={assetBarChartData}
        handleDownload={handleDownload}
        chartOptions={chartOptions}
        barChartOptions={updatedBarChartOptions}
      />

      <ReportSection
        title="Subscription Summary"
        reportType="subscriptions"
        data={reportData.subscriptions}
        chartData={subscriptionChartData}
        barChartData={subscriptionBarChartData}
        handleDownload={handleDownload}
        chartOptions={chartOptions}
        barChartOptions={updatedBarChartOptions}
      />

      <ReportSection
        title="Inventory Summary"
        reportType="inventory"
        data={reportData.inventory}
        chartData={inventoryChartData}
        barChartData={inventoryBarChartData}
        handleDownload={handleDownload}
        chartOptions={chartOptions}
        barChartOptions={updatedBarChartOptions}
      />
    </div>
  );
};

const ReportSection = React.memo(({ title, reportType, data, chartData, barChartData, handleDownload, chartOptions, barChartOptions }) => (
  <div className="report-section">
    <div className="section-header">
      <h2>{title}</h2>
      <div>
        <button onClick={() => handleDownload(reportType, 'pdf')} className="download-button" aria-label={`Download ${title} as PDF`}>
          <FaDownload /> PDF
        </button>
        <button onClick={() => handleDownload(reportType, 'excel')} className="download-button" aria-label={`Download ${title} as Excel`}>
          <FaDownload /> Excel
        </button>
      </div>
    </div>
    <div className="report-content">
      <div className="report-grid">
        {Object.entries(data || {}).map(([key, value]) => {
          if (key !== 'assetsByStatus' && key !== 'assetsByType' && key !== 'subscriptionsByVendor' && key !== 'itemsByCategory' && key !== 'itemsByLocation') {
            return (
              <div key={key} className="report-item">
                <h3>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                <p className="report-number">
                  {typeof value === 'number' 
                    ? value.toFixed(2) 
                    : typeof value === 'object' 
                      ? JSON.stringify(value)
                      : value}
                </p>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="chart-grid">
        {chartData && chartData.datasets && chartData.datasets[0] && (
          <div className="chart-item">
            <h3>{chartData.datasets[0].label}</h3>
            <div className="chart-container">
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
        {barChartData && barChartData.datasets && barChartData.datasets[0] && (
          <div className="chart-item">
            <h3>{barChartData.datasets[0].label}</h3>
            <div className="chart-container">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
));

export default Reports;
