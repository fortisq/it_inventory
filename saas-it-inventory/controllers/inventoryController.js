const Inventory = require('../models/Inventory');

exports.getAllInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find().populate('createdBy updatedBy', 'username');
    res.json(inventoryItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory items', error: error.message });
  }
};

exports.createInventoryItem = async (req, res) => {
  try {
    const newItem = new Inventory({
      ...req.body,
      createdBy: req.user._id
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: 'Error creating inventory item', error: error.message });
  }
};

exports.getInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id).populate('createdBy updatedBy', 'username');
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory item', error: error.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id
      },
      { new: true }
    ).populate('createdBy updatedBy', 'username');
    if (!updatedItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: 'Error updating inventory item', error: error.message });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inventory item', error: error.message });
  }
};
