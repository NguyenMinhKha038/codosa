import auth from "../common/auth";
import categoryController from "../category/category.controller";
import notificationController from "../notification/sendMail.controller";
import staff from "../staffs/staff.model"
import product from "../products/product.model";
import cart from "../cart/cart.model";
import order from "../order/order.model";
import socketIo from "../common/socket.io";
import jwt from "jsonwebtoken";

// CRUD order
const createOrder=async(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const payload = await jwt.verify(token, process.env.privateKey);
  const email = payload.email;
  const carts = await cart.findOne({id:email});
  const staffs = await staff.find();
  const productName= carts.productName;
  const address=req.body.address;
  let arrProduct=[];
  for (const value of productName) {
    let products=await product.findOne({name:value.Product});
    arrProduct.push({product:value.Product,price:products.price,amount:value.Amount});
    await product.findOneAndUpdate({name:value.Product},{amount:products.amount-value.Amount});
  }
  const total = arrProduct.reduce((total,value)=>{return total+=value.price*value.amount},0)
  try {
    let orders=new order({
      id:email,
      product:arrProduct,
      status:"Waiting",
      createDay:Date.now(),
      total:total,
      address:address
    })
    let content ={email:email,arrProduct:arrProduct,total:total,address:address};
    await orders.save();
    for (const value of staffs) {
      await notificationController.send(value.email,"Order vừa được tạo", content);
    }
    await socketIo.sendNotification(email);
    
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
  const orders =await order.find({id:email});
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
  const id= req.body._id;
  const address = req.body.address;
  const orders = await order.findOne({_id:id,id:email});
  const status =orders.status;
  if(status!="Processing"||status!="Waiting"){
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

const userDeleteOrder=async(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const payload = await jwt.verify(token, process.env.privateKey);
  const email = payload.email;
  const id= req.body._id;
  const orders = await order.findOne({_id:id,id:email});
  const status = orders.status;
  if(status!="Waiting"){
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
const adminDeleteOrder=async(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const payload = await jwt.verify(token, process.env.privateKey);
  const email = payload.email;
  const id= req.body._id;
  const orders = await order.findOne({_id:id,id:email});
  const status = orders.status;
  if(status=="Finish"){
    res.status(400).json({Message:"Đã giao hàng thành công, không thể xóa"});
  }else{
    try {
      await order.findOneAndUpdate({_id:id,id:email},{status:"Delete"});
      res.status(200).json({Message:"Đã xóa thành công"});
    } catch (error) {
      res.status(400).json({Error:error});
    }
  }
}

//Update status

const processingUpdate=async(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const payload = await jwt.verify(token, process.env.privateKey);
  const email = req.body.email;
  const id= req.body._id;
  const orders = await order.findOne({_id:id,id:email});
  const status = orders.status;
  if(status=="Waiting")
  {
    try {
      await order.findOneAndUpdate({_id:id,id:email},{status:"Processing"});
      res.status(200).json({Message:"Update thành công"});
    } catch (error) {
      res.status(400).json({Error:error});
    }
  }else{
    res.status(400).json({Message:"Order hiện tại không thể xử lý"});
  }
}

const shippingUpdate=async(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const payload = await jwt.verify(token, process.env.privateKey);
  const email = req.body.email;
  const id= req.body._id;
  const orders = await order.findOne({_id:id,id:email});
  const status = orders.status;
  if(status=="Processing")
  {
    try {
      await order.findOneAndUpdate({_id:id,id:email},{status:"Shipping"});
      res.status(200).json({Message:"Update thành công"});
    } catch (error) {
      res.status(400).json({Error:error});
    }
  }else{
    res.status(400).json({Message:"Order hiện tại không thể xử lý"});
  }
}

const finishUpdate= async(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const payload = await jwt.verify(token, process.env.privateKey);
  const email = req.body.email;
  const id= req.body._id;
  const orders = await order.findOne({_id:id,id:email});
  const status = orders.status;
  if(status=="Shipping")
  {
    try {
      await order.findOneAndUpdate({_id:id,id:email},{status:"Finish"});
      res.status(200).json({Message:"Update thành công"});
    } catch (error) {
      res.status(400).json({Error:error});
    }
  }else{
    res.status(400).json({Message:"Order hiện tại không thể xử lý"});
  }
}

//get Order
const getWaitingOrder = async(req,res)=>{
  try {
    const orders = await order.find({status:"Waiting"});
    res.status(200).json({Message:orders});
  } catch (error) {
    res.status(400).json({Error:error});
  }
}

const getProcessingOrder = async(req,res)=>{
  try {
    const orders = await order.find({status:"Processing"});
    res.status(200).json({Message:orders});
  } catch (error) {
    res.status(400).json({Error:error});
  }
}

const getShippingOrder = async(req,res)=>{
  try {
    const orders = await order.find({status:"Shipping"});
    res.status(200).json({Message:orders});
  } catch (error) {
    res.status(400).json({Error:error});
  }
}

const getFinishOrder = async(req,res)=>{
  try {
    const orders = await order.find({status:"Finish"});
    res.status(200).json({Message:orders});
  } catch (error) {
    res.status(400).json({Error:error});
  }
}

const getDeleteOrder = async(req,res)=>{
  try {
    const orders = await order.find({status:"Delete"});
    res.status(200).json({Message:orders});
  } catch (error) {
    res.status(400).json({Error:error});
  }
}

export default {createOrder,getOrder,updateOrder,userDeleteOrder,adminDeleteOrder,processingUpdate,shippingUpdate,finishUpdate,getWaitingOrder,getProcessingOrder,getShippingOrder,getShippingOrder,getFinishOrder,getFinishOrder,getDeleteOrder};