const Inventory = require('../models/Inventory');

exports.getInventory = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const items = await Inventory.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Inventory.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addInventoryItem = async (req, res) => {
  try {
    const newItem = new Inventory({
      ...req.body,
      createdBy: req.user._id, // Add the user ID from the authenticated request
      updatedBy: req.user._id
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Inventory.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const existingCategory = await Inventory.findOne({ category });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    const newItem = new Inventory({
      category,
      name: 'Placeholder Item',
      quantity: 0,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });
    await newItem.save();
    res.status(201).json({ message: 'Category added successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
