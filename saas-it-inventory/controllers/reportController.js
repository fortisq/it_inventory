const Asset = require('../models/Asset');
const Subscription = require('../models/Subscription');
const Inventory = require('../models/Inventory');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

exports.getAssetReport = async (req, res) => {
  try {
    const assetData = await fetchAssetData();
    res.json(assetData);
  } catch (error) {
    console.error('Error fetching asset report:', error);
    res.status(500).json({ message: 'Error fetching asset report', error: error.message });
  }
};

exports.getSubscriptionReport = async (req, res) => {
  try {
    const subscriptionData = await fetchSubscriptionData();
    res.json(subscriptionData);
  } catch (error) {
    console.error('Error fetching subscription report:', error);
    res.status(500).json({ message: 'Error fetching subscription report', error: error.message });
  }
};

exports.getInventoryReport = async (req, res) => {
  try {
    const inventoryData = await fetchInventoryData();
    res.json(inventoryData);
  } catch (error) {
    console.error('Error fetching inventory report:', error);
    res.status(500).json({ message: 'Error fetching inventory report', error: error.message });
  }
};

exports.generateReport = async (req, res) => {
  const { reportType, format } = req.params;

  try {
    let data;
    switch (reportType) {
      case 'assets':
        data = await fetchAssetData();
        break;
      case 'subscriptions':
        data = await fetchSubscriptionData();
        break;
      case 'inventory':
        data = await fetchInventoryData();
        break;
      case 'all':
        data = {
          assets: await fetchAssetData(),
          subscriptions: await fetchSubscriptionData(),
          inventory: await fetchInventoryData()
        };
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    if (format === 'pdf') {
      const pdfBuffer = await generatePDFReport(data, reportType);
      res.contentType('application/pdf');
      res.send(pdfBuffer);
    } else if (format === 'excel') {
      const excelBuffer = await generateExcelReport(data, reportType);
      res.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.attachment(`${reportType}_report.xlsx`);
      res.send(excelBuffer);
    } else {
      res.status(400).json({ message: 'Invalid format' });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};

async function fetchAssetData() {
  const totalAssets = await Asset.countDocuments();
  const totalAssetValue = await Asset.aggregate([
    { $group: { _id: null, total: { $sum: '$value' } } }
  ]);
  const assetsNeedingMaintenance = await Asset.countDocuments({ needsMaintenance: true });
  const assetsByStatus = await Asset.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  const assetsByType = await Asset.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } }
  ]);
  const assetAgeDistribution = await Asset.aggregate([
    {
      $project: {
        age: {
          $floor: {
            $divide: [{ $subtract: [new Date(), '$purchaseDate'] }, 365 * 24 * 60 * 60 * 1000]
          }
        }
      }
    },
    { $group: { _id: '$age', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  return {
    totalAssets,
    totalAssetValue: totalAssetValue[0]?.total || 0,
    assetsNeedingMaintenance,
    assetsByStatus: Object.fromEntries(assetsByStatus.map(item => [item._id, item.count])),
    assetsByType: Object.fromEntries(assetsByType.map(item => [item._id, item.count])),
    assetAgeDistribution: Object.fromEntries(assetAgeDistribution.map(item => [item._id, item.count]))
  };
}

async function fetchSubscriptionData() {
  console.log('Fetching subscription data...');
  
  const totalSubscriptions = await Subscription.countDocuments();
  console.log('Total subscriptions:', totalSubscriptions);

  const totalLicenses = await Subscription.aggregate([
    { $group: { _id: null, total: { $sum: '$numberOfLicenses' } } }
  ]);
  console.log('Total licenses:', totalLicenses[0]?.total || 0);

  const totalCost = await Subscription.aggregate([
    { $group: { _id: null, total: { $sum: '$cost' } } }
  ]);
  console.log('Total cost:', totalCost[0]?.total || 0);

  const expiringSoon = await Subscription.countDocuments({
    endDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
  });
  console.log('Expiring soon:', expiringSoon);

  const subscriptionsByVendor = await Subscription.aggregate([
    { $group: { _id: '$provider', count: { $sum: 1 } } }
  ]);
  const subscriptionsByVendorObj = Object.fromEntries(subscriptionsByVendor.map(item => [item._id || 'Unknown', item.count]));
  console.log('Subscriptions by vendor:', JSON.stringify(subscriptionsByVendorObj, null, 2));

  const subscriptionDurationDistribution = await Subscription.aggregate([
    {
      $project: {
        durationMonths: {
          $let: {
            vars: {
              monthDiff: {
                $divide: [
                  { $subtract: ['$endDate', '$startDate'] },
                  1000 * 60 * 60 * 24 * 30
                ]
              }
            },
            in: {
              $cond: {
                if: { $lt: ['$$monthDiff', 1] },
                then: 'Less than 1 month',
                else: {
                  $concat: [
                    { $toString: { $ceil: '$$monthDiff' } },
                    ' months'
                  ]
                }
              }
            }
          }
        },
        cost: 1,
        numberOfLicenses: 1
      }
    },
    {
      $group: {
        _id: '$durationMonths',
        count: { $sum: 1 },
        totalCost: { $sum: '$cost' },
        totalLicenses: { $sum: '$numberOfLicenses' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  const subscriptionDurationDistributionObj = Object.fromEntries(
    subscriptionDurationDistribution.map(item => [
      item._id,
      {
        count: item.count,
        totalCost: item.totalCost,
        totalLicenses: item.totalLicenses
      }
    ])
  );
  console.log('Subscription duration distribution:', JSON.stringify(subscriptionDurationDistributionObj, null, 2));

  return {
    totalSubscriptions,
    totalLicenses: totalLicenses[0]?.total || 0,
    totalCost: totalCost[0]?.total || 0,
    expiringSoon,
    subscriptionsByVendor: subscriptionsByVendorObj,
    subscriptionDurationDistribution: subscriptionDurationDistributionObj
  };
}

async function fetchInventoryData() {
  const totalItems = await Inventory.countDocuments();
  const totalValue = await Inventory.aggregate([
    { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$unitCost'] } } } }
  ]);
  const lowStockItems = await Inventory.countDocuments({ 
    $expr: { $lt: ['$quantity', '$reorderPoint'] }
  });
  const itemsByCategory = await Inventory.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  const itemsByLocation = await Inventory.aggregate([
    { $group: { _id: '$location', count: { $sum: 1 } } }
  ]);
  const averageTurnoverRate = await Inventory.aggregate([
    {
      $group: {
        _id: null,
        avgTurnover: { $avg: '$turnoverRate' }
      }
    }
  ]);

  return {
    totalItems,
    totalValue: totalValue[0]?.total || 0,
    lowStockItems,
    itemsByCategory: Object.fromEntries(itemsByCategory.map(item => [item._id, item.count])),
    itemsByLocation: Object.fromEntries(itemsByLocation.map(item => [item._id, item.count])),
    averageTurnoverRate: averageTurnoverRate[0]?.avgTurnover || 0
  };
}

async function generatePDFReport(data, reportType) {
  const doc = new PDFDocument();
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  doc.fontSize(18).text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, { align: 'center' });
  doc.moveDown();

  if (reportType === 'all') {
    for (const [key, value] of Object.entries(data)) {
      await addReportSection(doc, key, value);
    }
  } else {
    await addReportSection(doc, reportType, data);
  }

  doc.end();
  return Buffer.concat(buffers);
}

async function addReportSection(doc, sectionName, sectionData) {
  doc.fontSize(14).text(sectionName.charAt(0).toUpperCase() + sectionName.slice(1));
  doc.moveDown(0.5);

  for (const [key, value] of Object.entries(sectionData)) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      doc.fontSize(12).text(key.charAt(0).toUpperCase() + key.slice(1) + ':');
      doc.moveDown(0.2);
      const chartBuffer = await generateChart(value, key);
      doc.image(chartBuffer, { width: 400 });
    } else {
      doc.fontSize(12).text(`${key}: ${JSON.stringify(value)}`);
    }
    doc.moveDown(0.5);
  }
  doc.moveDown();
}

async function generateChart(data, title) {
  const width = 600;
  const height = 400;
  const chartCallback = (ChartJS) => {
    ChartJS.defaults.responsive = true;
    ChartJS.defaults.maintainAspectRatio = false;
  };
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

  const configuration = {
    type: 'bar',
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: title,
        data: Object.values(data),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title
        }
      }
    }
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  return image;
}

async function generateExcelReport(data, reportType) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(reportType);

  worksheet.addRow([`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`]);
  worksheet.addRow([]);

  if (reportType === 'all') {
    for (const [key, value] of Object.entries(data)) {
      await addExcelSection(worksheet, key, value);
    }
  } else {
    await addExcelSection(worksheet, reportType, data);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

async function addExcelSection(worksheet, sectionName, sectionData) {
  worksheet.addRow([sectionName.charAt(0).toUpperCase() + sectionName.slice(1)]);
  
  for (const [key, value] of Object.entries(sectionData)) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      worksheet.addRow([key.charAt(0).toUpperCase() + key.slice(1)]);
      for (const [subKey, subValue] of Object.entries(value)) {
        worksheet.addRow([subKey, JSON.stringify(subValue)]);
      }
    } else {
      worksheet.addRow([key, JSON.stringify(value)]);
    }
  }
  worksheet.addRow([]);
}

module.exports = {
  getAssetReport: exports.getAssetReport,
  getSubscriptionReport: exports.getSubscriptionReport,
  getInventoryReport: exports.getInventoryReport,
  generateReport: exports.generateReport
};
