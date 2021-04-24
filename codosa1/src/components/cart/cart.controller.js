import cart from "./cart.model";
import product from "../products/product.model";

const getCart=async(req,res)=>{
  const email=req.user.Email;
  try {
    const carts = await cart.findOne({id:email});
    res.status(200).json({Cart:carts});
  } catch (error) {
    res.status(400).json({Error:error});
  }
}

const updateCart=async(req,res)=>{
  const {productName,amount} = req.body;
  const email=req.user.email;
  const products = await product.findOne({name:productName});
  const carts = await cart.findOne({id:email});
  const total=carts.total+products.price*amount;
  const arrProduct=[...carts.productName];

  try {
    
    arrProduct.push({Product:productName,Amount:amount});
    await cart.findOneAndUpdate({id:email},{total:total,productName:arrProduct});
    res.status(200).json({Message:"Cập nhật giỏ hàng thành công"})
  } catch (error) {
    res.status(400).json({Error:error});
  }
}
export default{getCart,updateCart}