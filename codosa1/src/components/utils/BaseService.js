import mongoose from "mongoose";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { reponseSuccess } from "../error/baseResponese";
export class BaseService {
  constructor(model) {
    this.model = model;
  }
  //CRUD
  async create(data) {
    try {
      const item = this.model.create(data);
      return item;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const item = await this.model.findById(id);
      return item;
    } catch (errors) {
      throw errors;
    }
  }
  async findByAny(condition,populate="") {
    try {
      let item = await this.model.find(condition).populate(populate);
      return item;
    } catch (errors) {
      throw errors;
    }
  }
  async findOneByAny(condition,populate){
    try {
      const item = await this.model.findOne(condition).populate(populate);
      return item;
    } catch (errors) {
      throw errors;
    }
  }
  async getAll(populate) {
    try {
      const item = await this.model.find().populate(populate);
      return item;
    } catch (errors) {
      throw errors;
    }
  }


  async getByEmail(email) {
    try {
      const item = await this.model.find(email);
      return item;
    } catch (errors) {
      throw errors;
    }
  }

  async insert(data) {
    try {
      const item = await this.model.create(data);
      return item;
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUpdate(id, data) {
    try {
      let item = await this.model.findByIdAndUpdate(id, data, { new: true });
      return item;
    } catch (errors) {
      throw errors;
    }
  }
  async findOneAndUpdate(condition, data) {
    try {
      const item = await this.model.findOneAndUpdate(condition, data, {
        new: true,
      });
      return item;
    } catch (errors) {
      throw errors;
    }
  }
  
}
