// export class BaseService {
//   constructor(model) {
//     this.model = model;
//   }
//   //CRUD
//   async create(data) {
//     try {
//       const item = this.model.create(data);
//       return item;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async getById(id) {
//     try {
//       const item = await this.model.findById(id);
//       return item;
//     } catch (errors) {
//       throw errors;
//     }
//   }
//   async findByAny(condition,populate,select, skip, session) {
//     try {
//       let item = await this.model.find(condition).populate(populate);
//       return item;
//     } catch (errors) {
//       throw errors;
//     }
//   }
//   async findOneByAny(condition,populate){
//     try {
//       const item = await this.model.findOne(condition).populate(populate);
//       return item;
//     } catch (errors) {
//       throw errors;
//     }
//   }
//   async getAll(populate) {
//     try {
//       const item = await this.model.find().populate(populate);
//       return item;
//     } catch (errors) {
//       throw errors;
//     }
//   }

//   async insert(data) {
//     try {
//       const item = await this.model.create(data);
//       return item;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async findByIdAndUpdate(id, data) {
//     try {
//       let item = await this.model.findByIdAndUpdate(id, data, { new: true });
//       return item;
//     } catch (errors) {
//       throw errors;
//     }
//   }
//   async findOneAndUpdate(condition, data) {
//     try {
//       const item = await this.model.findOneAndUpdate(condition, data, {
//         new: true,
//       });
//       return item;
//     } catch (errors) {
//       throw errors;
//     }
//   }

// }
 export const BaseService = (model) => {
  const create = async (data,option) => {
    try {
      const item = new model(data);
      return item.save(option);
    } catch (error) {
      throw error;
    }
  };
  const getById = async (id) => {
    try {
      const item = await model.findById(id);
      return item;
    } catch (errors) {
      throw errors;
    }
  };
  const findByAny = async (condition, populate,option) => {
    try {
      let item = await model.find(condition,option).populate(populate);
      return item;
    } catch (errors) {
      throw errors;
    }
  };
  const findOneByAny = async (condition, populate) => {
    try {
      const item = await model.findOne(condition).populate(populate);
      return item;
    } catch (errors) {
      throw errors;
    }
  };
  const getAll = async (populate,option) => {
    try {
      const item = await model.find(option).populate(populate);
      return item;
    } catch (errors) {
      throw errors;
    }
  };
  const findByIdAndUpdate = async (id, data) => {
    try {
      let item = await model.findByIdAndUpdate(id, data, { new: true });
      return item;
    } catch (errors) {
      throw errors;
    }
  };
  const findOneAndUpdate = async (condition, data) => {
    try {
      const item = await model.findOneAndUpdate(condition, data, {
        new: true,
      });
      return item;
    } catch (errors) {
      throw errors;
    }
  };
  return {findOneByAny,findOneAndUpdate,findByIdAndUpdate,create,findByAny,getAll}
};
