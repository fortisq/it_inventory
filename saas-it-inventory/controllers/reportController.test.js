const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const reportController = require('./reportController');
const Report = require('../models/Report');
const Asset = require('../models/Asset');
const License = require('../models/License');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Report Controller', () => {
  let req, res, tenant, user;

  beforeEach(() => {
    tenant = new mongoose.Types.ObjectId();
    user = new mongoose.Types.ObjectId();
    req = {
      user: { tenant, _id: user },
      params: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getAllReports', () => {
    it('should return all reports for a tenant', async () => {
      await Report.create([
        { name: 'Report 1', description: 'Description 1', type: 'asset', tenant, createdBy: user },
        { name: 'Report 2', description: 'Description 2', type: 'license', tenant, createdBy: user },
      ]);

      await reportController.getAllReports(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: 'Report 1' }),
        expect.objectContaining({ name: 'Report 2' }),
      ]));
    });
  });

  describe('getReport', () => {
    it('should return a specific report', async () => {
      const report = await Report.create({
        name: 'Test Report',
        description: 'Test Description',
        type: 'asset',
        tenant,
        createdBy: user,
      });

      req.params.id = report._id.toString();

      await reportController.getReport(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Report',
        description: 'Test Description',
      }));
    });

    it('should return 404 if report not found', async () => {
      req.params.id = new mongoose.Types.ObjectId().toString();

      await reportController.getReport(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Report not found' });
    });
  });

  describe('generateReport', () => {
    it('should generate an asset report', async () => {
      const report = await Report.create({
        name: 'Asset Report',
        description: 'Asset Report Description',
        type: 'asset',
        tenant,
        createdBy: user,
      });

      await Asset.create([
        { name: 'Asset 1', type: 'Hardware', tenant },
        { name: 'Asset 2', type: 'Software', tenant },
      ]);

      req.params.id = report._id.toString();

      await reportController.generateReport(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        reportName: 'Asset Report',
        data: expect.arrayContaining([
          expect.objectContaining({ name: 'Asset 1' }),
          expect.objectContaining({ name: 'Asset 2' }),
        ]),
      }));
    });

    it('should return 404 if report not found', async () => {
      req.params.id = new mongoose.Types.ObjectId().toString();

      await reportController.generateReport(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Report not found' });
    });
  });
});
