import categoryModel from "./category.model";
import {BaseService} from "../utils/BaseService"

// class categoryService extends BaseService{
//   constructor(){
//     super(categoryModel);
//   }
  
// }
// export default new categoryService(categoryModel)

export const categoryService ={
  ...BaseService(categoryModel) 
}