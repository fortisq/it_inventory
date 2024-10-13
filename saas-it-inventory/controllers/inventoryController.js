const Inventory = require('../models/Inventory');
const logger = require('../utils/logger');

exports.getAllInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find().sort({ createdAt: -1 });
    res.json(inventoryItems);
  } catch (error) {
    logger.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Error fetching inventory', error: error.message });
  }
};

exports.createInventoryItem = async (req, res) => {
  try {
    const { name, description, quantity } = req.body;
    const newItem = new Inventory({
      name,
      description,
      quantity,
      createdBy: req.user._id
    });
    await newItem.save();
    logger.info(`New inventory item created: ${newItem._id}`);
    res.status(201).json(newItem);
  } catch (error) {
    logger.error('Error adding inventory item:', error);
    res.status(500).json({ message: 'Error adding inventory item', error: error.message });
  }
};

exports.getInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json(item);
  } catch (error) {
    logger.error(`Error fetching inventory item ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching inventory item', error: error.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, quantity } = req.body;
    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { name, description, quantity },
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    logger.info(`Inventory item updated: ${id}`);
    res.json(updatedItem);
  } catch (error) {
    logger.error(`Error updating inventory item ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error updating inventory item', error: error.message });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Inventory.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    logger.info(`Inventory item deleted: ${id}`);
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting inventory item ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error deleting inventory item', error: error.message });
  }
};

exports.getPaginatedInventoryItems = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }
    };

    const inventoryItems = await Inventory.paginate({}, options);
    res.json(inventoryItems);
  } catch (error) {
    logger.error('Error fetching paginated inventory:', error);
    res.status(500).json({ message: 'Error fetching paginated inventory', error: error.message });
  }
};

exports.searchInventoryItems = async (req, res) => {
  try {
    const { query } = req.params;
    const inventoryItems = await Inventory.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    res.json(inventoryItems);
  } catch (error) {
    logger.error(`Error searching inventory items with query "${req.params.query}":`, error);
    res.status(500).json({ message: 'Error searching inventory items', error: error.message });
  }
};
