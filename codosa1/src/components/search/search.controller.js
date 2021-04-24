import product from "../products/product.model";
import category from "../category/category.model";

const search=async(req,res)=>{
  const name=req.body.name;
  const products = await product.find({name:{$regex:name}});
  let arrProduct=products.map(x=>x.name);
  
  if(arrProduct.length==0){
    res.status(200).json({Message:"Không tìm thấy sản phẩm"});
  }
  res.status(200).json({Product:arrProduct});
}

export default {search};