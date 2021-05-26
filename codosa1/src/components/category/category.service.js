import categoryModel from "./category.model";
import {baseService} from "../utils/baseService"

// class categoryService extends baseService{
//   constructor(){
//     super(categoryModel);
//   }
  
// }
// export default new categoryService(categoryModel)

export const categoryService ={
  ...baseService(categoryModel) 
}