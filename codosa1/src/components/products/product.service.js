import productModel from "./product.model";
import {BaseService} from "../utils/BaseService"

class productService extends BaseService{
  constructor(){
    super(productModel);
  }
  async findManyAndUpdate(condition,data){
    try {
      let item = await this.model.updateMany(condition, data, {
        new: true,
      });
      return item;
    } catch (errors) {
      throw errors;
    }
  
  }
  async findMany(condition){
    try {
      let item = await this.model.find(condition, {
        new: true,
      });
      return item;
    } catch (errors) {
      throw errors;
    }
  }
  async search(name,page,perPage){
    try {
      let item = await this.model.find({
        name: { $regex: name, $options: "$i" },
      }).skip(page > 0 ? (page - 1) * perPage : 0)
      .limit(Number(perPage));
      return item;
    } catch (error) {
      throw error
    }
  }
  
}
export default new productService(productModel)