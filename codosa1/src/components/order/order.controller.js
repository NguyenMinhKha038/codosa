import auth from "../common/auth";
import categoryController from "../category/category.controller";
import categoryy from "../category/category.model";
import product from "../products/product.model";
import cart from "../cart/cart.model";
import order from "../order/order.model";
import jwt from "jsonwebtoken";


const createOrder=async(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const payload = await jwt.verify(token, process.env.privateKey);
  const email = payload.email;
  const carts = await cart.findOne({id:email});
  const productName= carts.productName;
  const address=req.body.address;
  let arrProduct=[];
  for (const value of productName) {
    let products=await product.findOne({name:value.Product});
    arrProduct.push({product:value.Product,price:products.price,amount:value.Amount});
  }
  const total = arrProduct.reduce((total,value)=>{return total+=value.price*value.amount},0)
  try {
    let orders=new order({
      id:email,
      product:arrProduct,
      status:1,
      createDay:Date.now(),
      total:total,
      address:address
    })
    
    await orders.save();
   res.status(200).json({Message:"Tạo order thành công"})
  } catch (error) {
    res.status(400).json({Error:error});
  }

}

const getOrder = async(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const payload = await jwt.verify(token, process.env.privateKey);
  const email = payload.email||req.body.email;
 try {
  const orders =await order.find({id:email,status:Number});
  if(!orders){
    res.status(400).json({Message:"Không tồn tại order nào"});
  }else{
    res.status(400).json({Message:orders});
  }
 } catch (error) {
   res.status(400).json({Message:error})
 }
}

const updateOrder = async(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const payload = await jwt.verify(token, process.env.privateKey);
  const email = payload.email;
  const id= req.body.id;
  const address = req.body.address;
  const orders = await order.findOne({_id:id,id:email});
  const status =orders.status;
  if(status>2){
    res.status(400).json({Message:"Order đang được giao, không thể cập nhật"});
  }else{
    try {
      await order.findOneAndUpdate({_id:id},{address:address,updateDay:Date.now()});
      res.status(200).json({Message:"Đã update thành công"});
    } catch (error) {
      res.status(400).json({Error:error});
    }
  }

}

const deleteOrder=async(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const payload = await jwt.verify(token, process.env.privateKey);
  const email = payload.email;
  const id= req.body.id;
  const orders = await order.findOne({_id:id,id:email});
  const status = orders.status;
  if(status>1){
    res.status(400).json({Message:"Order đang được xử lý, không thể cập nhật"});
  }else{
    try {
      await order.findOneAndUpdate({_id:id,id:email},{status:"Delete"});
      res.status(200).json({Message:"Đã xóa thành công"});
    } catch (error) {
      res.status(400).json({Error:error});
    }
  }
}

export default {createOrder,getOrder,updateOrder,deleteOrder};