const Configuration = require('../models/Configuration');

exports.getConfigurations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalConfigurations = await Configuration.countDocuments();
    const configurations = await Configuration.find().skip(skip).limit(limit);

    res.json({
      configurations,
      currentPage: page,
      totalPages: Math.ceil(totalConfigurations / limit),
      totalConfigurations
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching configurations', error: error.message });
  }
};

exports.createConfiguration = async (req, res) => {
  try {
    const newConfiguration = new Configuration(req.body);
    await newConfiguration.save();
    res.status(201).json(newConfiguration);
  } catch (error) {
    res.status(400).json({ message: 'Error creating configuration', error: error.message });
  }
};

exports.updateConfiguration = async (req, res) => {
  try {
    const updatedConfiguration = await Configuration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedConfiguration) {
      return res.status(404).json({ message: 'Configuration not found' });
    }
    res.json(updatedConfiguration);
  } catch (error) {
    res.status(400).json({ message: 'Error updating configuration', error: error.message });
  }
};

exports.deleteConfiguration = async (req, res) => {
  try {
    const deletedConfiguration = await Configuration.findByIdAndDelete(req.params.id);
    if (!deletedConfiguration) {
      return res.status(404).json({ message: 'Configuration not found' });
    }
    res.json({ message: 'Configuration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting configuration', error: error.message });
  }
};
