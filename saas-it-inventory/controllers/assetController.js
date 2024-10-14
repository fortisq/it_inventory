const Asset = require('../models/Asset');

const assetController = {
  getAssets: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },
        populate: [
          { path: 'createdBy', select: 'username' },
          { path: 'updatedBy', select: 'username' }
        ]
      };

      const query = search
        ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { type: { $regex: search, $options: 'i' } },
              { status: { $regex: search, $options: 'i' } },
              { assignedTo: { $regex: search, $options: 'i' } }
            ]
          }
        : {};

      const result = await Asset.paginate(query, options);
      res.json({
        assets: result.docs,
        totalPages: result.totalPages,
        currentPage: result.page,
        totalAssets: result.totalDocs
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addAsset: async (req, res) => {
    try {
      const assetData = {
        ...req.body,
        createdBy: req.user._id,
        updatedBy: req.user._id
      };

      const asset = new Asset(assetData);
      
      // Calculate next maintenance date
      asset.nextMaintenanceDate = asset.calculateNextMaintenanceDate();

      const newAsset = await asset.save();
      res.status(201).json(newAsset);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateAsset: async (req, res) => {
    try {
      const asset = await Asset.findById(req.params.id);
      if (!asset) {
        return res.status(404).json({ message: 'Asset not found' });
      }

      // Update asset fields
      Object.assign(asset, req.body);
      asset.updatedBy = req.user._id;

      // Recalculate next maintenance date if necessary
      if (req.body.lastMaintenanceDate || req.body.maintenanceFrequency) {
        asset.nextMaintenanceDate = asset.calculateNextMaintenanceDate();
      }

      const updatedAsset = await asset.save();
      res.json(updatedAsset);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteAsset: async (req, res) => {
    try {
      await Asset.findByIdAndDelete(req.params.id);
      res.json({ message: 'Asset deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = assetController;
