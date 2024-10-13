const Inventory = require('../models/Inventory');

exports.getInventory = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find();
    res.json(inventoryItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error: error.message });
  }
};

exports.addInventoryItem = async (req, res) => {
  try {
    const { name, description, quantity } = req.body;
    const newItem = new Inventory({
      name,
      description,
      quantity,
      createdBy: req.user._id
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding inventory item', error: error.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, quantity } = req.body;
    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { name, description, quantity },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
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
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inventory item', error: error.message });
  }
};
