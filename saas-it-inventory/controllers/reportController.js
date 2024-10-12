const Report = require('../models/Report');
const Asset = require('../models/Asset');
const License = require('../models/License');

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({ tenant: req.user.tenant });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, tenant: req.user.tenant });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error: error.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, tenant: req.user.tenant });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    let reportData;
    switch (report.type) {
      case 'asset':
        reportData = await Asset.find({ tenant: req.user.tenant });
        break;
      case 'license':
        reportData = await License.find({ tenant: req.user.tenant });
        break;
      // Add more cases for different report types
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    // Here you would typically process the data and generate a formatted report
    // For this example, we're just sending back the raw data
    res.json({
      reportName: report.name,
      generatedAt: new Date(),
      data: reportData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};
