const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const auth = require('../middleware/auth');
const winston = require('winston');
const mongoose = require('mongoose');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

logger.info('Assets route file loaded');
logger.info(`Mongoose version: ${mongoose.version}`);

router.use((req, res, next) => {
  logger.info(`Assets route middleware: ${req.method} ${req.url}`);
  logger.info('Request body:', JSON.stringify(req.body, null, 2));
  next();
});

router.get('/', auth, async (req, res) => {
  logger.info('GET /api/assets route hit');
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    logger.error('Error fetching assets:', JSON.stringify(err, null, 2));
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  logger.info('POST /api/assets route hit - Beginning of route handler');
  try {
    logger.info('Asset schema:', JSON.stringify(Asset.schema.obj, null, 2));
    logger.info('Request body:', JSON.stringify(req.body, null, 2));
    logger.info('User ID:', req.user._id);
    logger.info('Status value received:', req.body.status);
    logger.info('Status value type:', typeof req.body.status);
    logger.info('Allowed status values:', Asset.schema.path('status').enumValues);
    
    logger.info('Creating new Asset object');
    const assetData = {
      name: req.body.name,
      type: req.body.type,
      serialNumber: req.body.serialNumber,
      purchaseDate: req.body.purchaseDate,
      purchasePrice: req.body.purchasePrice,
      currentValue: req.body.currentValue,
      location: req.body.location,
      assignedTo: req.body.assignedTo,
      status: req.body.status,
      maintenanceSchedule: req.body.maintenanceSchedule,
      lastMaintenanceDate: req.body.lastMaintenanceDate,
      createdBy: req.user._id,
      updatedBy: req.user._id
    };
    logger.info('Asset data:', JSON.stringify(assetData, null, 2));
    
    let asset;
    try {
      logger.info('Attempting to create new Asset instance');
      asset = new Asset(assetData);
      logger.info('Asset instance created successfully');
      logger.info('Asset object created:', JSON.stringify(asset, null, 2));
      logger.info('Asset object status:', asset.status);
      logger.info('Is status in enum:', Asset.schema.path('status').enumValues.includes(asset.status));
    } catch (createError) {
      logger.error('Error creating Asset object:', JSON.stringify(createError, null, 2));
      throw createError;
    }

    // Validate the asset before saving
    logger.info('Attempting to validate asset');
    const validationError = asset.validateSync();
    if (validationError) {
      logger.error('Validation error:', JSON.stringify(validationError, null, 2));
      if (validationError.errors.status) {
        logger.error('Status validation error:', JSON.stringify(validationError.errors.status, null, 2));
        logger.error('Status validation error message:', validationError.errors.status.message);
      }
      throw validationError;
    }
    logger.info('Asset validation passed');

    logger.info('Attempting to save asset');
    const newAsset = await asset.save();
    logger.info('Asset saved successfully:', JSON.stringify(newAsset, null, 2));
    logger.info('POST /api/assets route completed successfully - Sending response');
    res.status(201).json(newAsset);
  } catch (err) {
    logger.error('Error in POST /api/assets route:', JSON.stringify(err, null, 2));
    logger.error('Error stack:', err.stack);
    if (err.name === 'ValidationError') {
      logger.error('Validation error details:', JSON.stringify(err.errors, null, 2));
      const validationErrors = Object.values(err.errors).map(error => error.message);
      logger.error('Validation errors:', validationErrors);
      res.status(400).json({ message: 'Validation error', errors: validationErrors });
    } else {
      logger.error('Other error:', err.message);
      res.status(400).json({ message: err.message, details: err.errors });
    }
  }
});

router.get('/:id', auth, getAsset, (req, res) => {
  res.json(res.asset);
});

router.patch('/:id', auth, getAsset, async (req, res) => {
  if (req.body.name != null) {
    res.asset.name = req.body.name;
  }
  if (req.body.type != null) {
    res.asset.type = req.body.type;
  }
  if (req.body.serialNumber != null) {
    res.asset.serialNumber = req.body.serialNumber;
  }
  if (req.body.purchaseDate != null) {
    res.asset.purchaseDate = req.body.purchaseDate;
  }
  if (req.body.purchasePrice != null) {
    res.asset.purchasePrice = req.body.purchasePrice;
  }
  if (req.body.currentValue != null) {
    res.asset.currentValue = req.body.currentValue;
  }
  if (req.body.location != null) {
    res.asset.location = req.body.location;
  }
  if (req.body.assignedTo != null) {
    res.asset.assignedTo = req.body.assignedTo;
  }
  if (req.body.status != null) {
    res.asset.status = req.body.status;
  }
  if (req.body.maintenanceSchedule != null) {
    res.asset.maintenanceSchedule = req.body.maintenanceSchedule;
  }
  if (req.body.lastMaintenanceDate != null) {
    res.asset.lastMaintenanceDate = req.body.lastMaintenanceDate;
  }
  res.asset.updatedBy = req.user._id;

  try {
    const updatedAsset = await res.asset.save();
    res.json(updatedAsset);
  } catch (err) {
    logger.error('Error updating asset:', JSON.stringify(err, null, 2));
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, getAsset, async (req, res) => {
  try {
    await res.asset.remove();
    res.json({ message: 'Asset deleted' });
  } catch (err) {
    logger.error('Error deleting asset:', JSON.stringify(err, null, 2));
    res.status(500).json({ message: err.message });
  }
});

async function getAsset(req, res, next) {
  let asset;
  try {
    asset = await Asset.findById(req.params.id);
    if (asset == null) {
      logger.warn(`Asset not found with id: ${req.params.id}`);
      return res.status(404).json({ message: 'Cannot find asset' });
    }
  } catch (err) {
    logger.error('Error finding asset:', JSON.stringify(err, null, 2));
    return res.status(500).json({ message: err.message });
  }

  res.asset = asset;
  next();
}

module.exports = router;
