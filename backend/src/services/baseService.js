import { logger } from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

export class BaseService {
  constructor(model) {
    this.model = model;
  }

  async findById(id) {
    try {
      const doc = await this.model.findById(id);
      if (!doc) {
        throw new AppError('Document not found', 404);
      }
      return doc;
    } catch (error) {
      logger.error(`Error finding document by ID: ${error.message}`);
      throw error;
    }
  }

  async findAll(projection = null) {
    try {
      return await this.model.find({}, projection);
    } catch (error) {
      logger.error(`Error finding all documents: ${error.message}`);
      throw error;
    }
  }

  async create(data) {
    try {
      const doc = new this.model(data);
      await doc.save();
      return doc;
    } catch (error) {
      logger.error(`Error creating document: ${error.message}`);
      throw error;
    }
  }
} 