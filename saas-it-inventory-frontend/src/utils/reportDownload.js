import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';
import { generateChartPNG } from './chartGenerator';

Chart.register(...registerables);

const formatDataForExcel = (data) => {
  const formattedData = [];
  
  if (data.assets) {
    formattedData.push(
      { Section: 'Asset Summary' },
      { Metric: 'Total Assets', Value: data.assets.totalAssets },
      { Metric: 'Total Asset Value', Value: `$${data.assets.totalAssetValue.toFixed(2)}` },
      { Metric: 'Assets Needing Maintenance', Value: data.assets.assetsNeedingMaintenance },
      { Section: 'Assets by Status' },
      ...Object.entries(data.assets.assetsByStatus).map(([status, count]) => ({ Status: status, Count: count })),
      { Section: 'Assets by Type' },
      ...Object.entries(data.assets.assetsByType).map(([type, count]) => ({ Type: type, Count: count })),
      { Section: 'Asset Age Distribution' },
      ...Object.entries(data.assets.assetAgeDistribution).map(([age, count]) => ({ 'Age (years)': age, Count: count }))
    );
  }

  if (data.subscriptions) {
    formattedData.push(
      { Section: 'Subscription Summary' },
      { Metric: 'Total Subscriptions', Value: data.subscriptions.totalSubscriptions },
      { Metric: 'Total Seats', Value: data.subscriptions.totalSeats },
      { Metric: 'Total Cost', Value: `$${data.subscriptions.totalCost.toFixed(2)}` },
      { Metric: 'Expiring Soon', Value: data.subscriptions.expiringSoon },
      { Section: 'Subscriptions by Vendor' },
      ...Object.entries(data.subscriptions.subscriptionsByVendor).map(([vendor, count]) => ({ Vendor: vendor, Count: count })),
      { Section: 'Subscription Duration Distribution' },
      ...data.subscriptions.subscriptionDurationDistribution.map(item => ({
        Duration: item.duration,
        Count: item.count,
        'Total Cost': `$${item.totalCost.toFixed(2)}`,
        'Total Licenses': item.totalLicenses
      }))
    );
  }

  if (data.inventory) {
    formattedData.push(
      { Section: 'Inventory Summary' },
      { Metric: 'Total Items', Value: data.inventory.totalItems },
      { Metric: 'Total Value', Value: `$${data.inventory.totalValue.toFixed(2)}` },
      { Metric: 'Low Stock Items', Value: data.inventory.lowStockItems },
      { Metric: 'Average Turnover Rate', Value: data.inventory.averageTurnoverRate.toFixed(2) },
      { Section: 'Items by Category' },
      ...Object.entries(data.inventory.itemsByCategory).map(([category, count]) => ({ Category: category, Count: count })),
      { Section: 'Items by Location' },
      ...Object.entries(data.inventory.itemsByLocation).map(([location, count]) => ({ Location: location, Count: count }))
    );
  }

  return formattedData;
};

export const downloadReport = (data, reportType) => {
  const formattedData = formatDataForExcel(data);
  const worksheet = utils.json_to_sheet(formattedData);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, reportType);
  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(blob, `${reportType}_report.xlsx`);
};

export const downloadAllReports = (data) => {
  const workbook = utils.book_new();
  
  ['Assets', 'Subscriptions', 'Inventory'].forEach((reportType) => {
    const formattedData = formatDataForExcel({ [reportType.toLowerCase()]: data[reportType.toLowerCase()] });
    const worksheet = utils.json_to_sheet(formattedData);
    utils.book_append_sheet(workbook, worksheet, reportType);
  });

  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(blob, 'all_reports.xlsx');
};

export const downloadPDFReport = async (data) => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 10;
  let yOffset = margin;

  const addPageIfNeeded = (height) => {
    if (yOffset + height > pageHeight - margin) {
      pdf.addPage();
      yOffset = margin;
    }
  };

  const addSection = async (title, tableData, pieChartData, barChartData) => {
    addPageIfNeeded(80);

    pdf.setFontSize(14);
    pdf.text(title, margin, yOffset);
    yOffset += 8;

    // Add table
    pdf.setFontSize(8);
    pdf.autoTable({
      startY: yOffset,
      head: [Object.keys(tableData[0])],
      body: tableData.map(Object.values),
      theme: 'grid',
      styles: { fontSize: 7 },
      columnStyles: { 0: { cellWidth: 40 } },
      margin: { left: margin, right: margin },
      tableWidth: 'auto',
    });
    yOffset = pdf.lastAutoTable.finalY + 5;

    // Add charts side by side
    const chartWidth = (pageWidth - 3 * margin) / 2;
    const chartHeight = 50;

    try {
      const pieChartUrl = await generateChartPNG(...pieChartData, 300, 150);
      pdf.addImage(pieChartUrl, 'PNG', margin, yOffset, chartWidth, chartHeight);
      URL.revokeObjectURL(pieChartUrl);

      const barChartUrl = await generateChartPNG(...barChartData, 300, 150);
      pdf.addImage(barChartUrl, 'PNG', margin * 2 + chartWidth, yOffset, chartWidth, chartHeight);
      URL.revokeObjectURL(barChartUrl);

      yOffset += chartHeight + 10;
    } catch (error) {
      console.error('Error generating charts:', error);
      pdf.setTextColor(255, 0, 0);
      pdf.text('Error generating charts', margin, yOffset);
      pdf.setTextColor(0, 0, 0);
      yOffset += 10;
    }
  };

  pdf.setFontSize(16);
  pdf.text('Comprehensive IT Inventory Report', margin, yOffset);
  yOffset += 8;
  pdf.setFontSize(10);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, yOffset);
  yOffset += 10;

  if (data.assets) {
    const assetTableData = [
      { Metric: 'Total Assets', Value: data.assets.totalAssets },
      { Metric: 'Total Asset Value', Value: `$${data.assets.totalAssetValue.toFixed(2)}` },
      { Metric: 'Assets Needing Maintenance', Value: data.assets.assetsNeedingMaintenance },
      { Metric: 'Average Asset Age', Value: `${calculateAverageAssetAge(data.assets.assetAgeDistribution).toFixed(2)} years` },
    ];
    await addSection('Asset Summary', assetTableData, 
      ['pie', Object.keys(data.assets.assetsByStatus), [{
        data: Object.values(data.assets.assetsByStatus),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]],
      ['bar', Object.keys(data.assets.assetsByType), [{
        label: 'Assets by Type',
        data: Object.values(data.assets.assetsByType),
        backgroundColor: '#36A2EB',
      }]]
    );
  }

  if (data.subscriptions) {
    const subscriptionTableData = [
      { Metric: 'Total Subscriptions', Value: data.subscriptions.totalSubscriptions },
      { Metric: 'Total Seats', Value: data.subscriptions.totalSeats },
      { Metric: 'Total Cost', Value: `$${data.subscriptions.totalCost.toFixed(2)}` },
      { Metric: 'Expiring Soon', Value: data.subscriptions.expiringSoon },
      { Metric: 'Average Cost per Seat', Value: `$${(data.subscriptions.totalCost / data.subscriptions.totalSeats).toFixed(2)}` },
    ];
    await addSection('Subscription Summary', subscriptionTableData,
      ['pie', Object.keys(data.subscriptions.subscriptionsByVendor), [{
        data: Object.values(data.subscriptions.subscriptionsByVendor),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]],
      ['bar', data.subscriptions.subscriptionDurationDistribution.map(item => item.duration), [{
        label: 'Number of Subscriptions',
        data: data.subscriptions.subscriptionDurationDistribution.map(item => item.count),
        backgroundColor: '#FF6384',
      }]]
    );
  }

  if (data.inventory) {
    const inventoryTableData = [
      { Metric: 'Total Items', Value: data.inventory.totalItems },
      { Metric: 'Total Value', Value: `$${data.inventory.totalValue.toFixed(2)}` },
      { Metric: 'Low Stock Items', Value: data.inventory.lowStockItems },
      { Metric: 'Average Turnover Rate', Value: data.inventory.averageTurnoverRate.toFixed(2) },
      { Metric: 'Average Value per Item', Value: `$${(data.inventory.totalValue / data.inventory.totalItems).toFixed(2)}` },
    ];
    await addSection('Inventory Summary', inventoryTableData,
      ['pie', Object.keys(data.inventory.itemsByCategory), [{
        data: Object.values(data.inventory.itemsByCategory),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]],
      ['bar', Object.keys(data.inventory.itemsByLocation), [{
        label: 'Items by Location',
        data: Object.values(data.inventory.itemsByLocation),
        backgroundColor: '#FFCE56',
      }]]
    );
  }

  pdf.save('comprehensive_it_inventory_report.pdf');
};

function calculateAverageAssetAge(ageDistribution) {
  const totalAssets = Object.values(ageDistribution).reduce((sum, count) => sum + count, 0);
  const weightedSum = Object.entries(ageDistribution).reduce((sum, [age, count]) => sum + (Number(age) * count), 0);
  return totalAssets > 0 ? weightedSum / totalAssets : 0;
}

function getMostCommonItem(itemCounts) {
  return Object.entries(itemCounts).reduce((a, b) => a[1] > b[1] ? a : b, ['N/A', 0])[0];
}

function calculateAverageSubscriptionDuration(durationDistribution) {
  const totalSubscriptions = durationDistribution.reduce((sum, item) => sum + item.count, 0);
  const weightedSum = durationDistribution.reduce((sum, item) => sum + (parseDuration(item.duration) * item.count), 0);
  return totalSubscriptions > 0 ? weightedSum / totalSubscriptions : 0;
}

function parseDuration(duration) {
  return parseInt(duration.split(' ')[0], 10);
}

function calculateInventoryValueDistribution(itemsByCategory, totalValue) {
  if (totalValue === 0) return 'N/A (Total value is 0)';
  const distribution = Object.entries(itemsByCategory)
    .map(([category, count]) => `${category}: ${((count / totalValue) * 100).toFixed(2)}%`)
    .join(', ');
  return distribution || 'N/A';
}
