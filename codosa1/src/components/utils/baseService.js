// export class baseService {
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

// }.
import statusMiddleWare from "./status";
export const baseService = (model) => {
  const create = async (data, option) => {
    try {
      const item = new model(data);
      return item.save(option);
    } catch (error) {
      throw error;
    }
  };
  const findOneAndUpdate = async (query, data, option) => {
    try {
      const item = await model.findOneAndUpdate(query, data, option);
      return item;
    } catch (errors) {
      throw errors;
    }
  };
  const get = async (query) => {
    try {
      const { condition, skip, limit, populate, dataGet, option,sort } = query;
      let item = await model
        .find(condition, dataGet, option)
        .limit(limit)
        .skip(skip)
        .sort(sort)
        .populate(populate);
      return item;
    } catch (error) {
      throw error;
    }
  };
  // const getOne = async ({query, select, options})
  const getOne = async(query)=>{
    try {

      const { condition,populate, dataGet, option } = query;
      //model.findOne()
      let item = await model
        .findOne(condition, dataGet, option)
        .populate(populate);
      return item;
    } catch (error) {
      throw error;
    }
  }
  const findOneAndDelete = async (query, option) => {
    try {
      await model.findOneAndUpdate(
        query,
        { status: statusMiddleWare.personStatus.DISABLE },
        option
      );
    } catch (error) {
      throw error;
    }
  };
  return {
    findOneAndUpdate,
    create,
    get,
    getOne,
    findOneAndDelete,
  };
};

//dung` bind gan method find, findOne.... vao baseService
