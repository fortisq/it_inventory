const Asset = require('../models/Asset');

exports.getAssets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(search, 'i');
    const query = {
      $or: [
        { name: searchRegex },
        { type: searchRegex }
      ]
    };

    const totalAssets = await Asset.countDocuments(query);
    const assets = await Asset.find(query).skip(skip).limit(limit);

    res.json({
      assets,
      currentPage: page,
      totalPages: Math.ceil(totalAssets / limit),
      totalAssets
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets', error: error.message });
  }
};

exports.addAsset = async (req, res) => {
  try {
    const { name, type, status, assignedTo } = req.body;
    const newAsset = new Asset({
      name,
      type,
      status,
      assignedTo,
      createdBy: req.user._id
    });
    await newAsset.save();
    res.status(201).json(newAsset);
  } catch (error) {
    res.status(500).json({ message: 'Error adding asset', error: error.message });
  }
};

exports.updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, status, assignedTo } = req.body;
    const updatedAsset = await Asset.findByIdAndUpdate(
      id,
      { name, type, status, assignedTo },
      { new: true }
    );
    if (!updatedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.json(updatedAsset);
  } catch (error) {
    res.status(500).json({ message: 'Error updating asset', error: error.message });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAsset = await Asset.findByIdAndDelete(id);
    if (!deletedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting asset', error: error.message });
  }
};
