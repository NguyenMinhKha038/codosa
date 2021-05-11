import product from "../products/product.model";
import cart from "../cart/cart.model";
import order from "../order/order.model";
import statusMiddleWare from "../utils/status";
import notification from "../notification/notification.model";
import statusMiddleware from "../utils/status";
import mongoose from "mongoose";
// CRUD order
const createOrder = async (req, res,next) => {
  const {email,_id}= req.user;
  const {products,address,phone}=req.body;
  const session = await mongoose.startSession();
  const carts = await cart.findOne({ userId: _id }).populate('product.id');
  if (carts.product == null) {
    res.status(400).json({ Message: "Cart is Empty" });
  } else {
    try {
      session.startTransaction(); //start transaction
      const opts ={session,new:true};
      const productOrder = carts.product;
      console.log(typeof productOrder);
      let total = 0;
      productOrder.map((value)=>{total+=value.amount*value.id.price});
      console.log(total)
      const orders = new order({
          id:_id,
          products,
          phone,
          address,
          status:statusMiddleWare.orderStatus.WAITING,
          total
      })
      const notifications = new notification({
        title:"New Order",
        content:orders,
        Date:Date.now()
      })
      Promise.all(notifications.save(opts),orders.save(opts),cart.findOneAndUpdate({ userId: _id }, { product: []}),opts);
      await session.commitTransaction();
      res.status(200).json({ Message: "Create order successful" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ Error: error });
    }
  }
};

const getOrder = async (req, res) => {
  const _id = req.user._id;
  try {
    const orders = await order.find({ id: _id });
    if (!orders) {
      res.status(400).json({ Message: "Nothing" });
    } else {
      res.status(400).json({ Message: orders });
    }
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};
const getUserOrder = async (req, res) => {
  const payload = req.user;
  const email = req.body.email;
  try {
    const orders = await order.find({ id: email });
    if (!orders) {
      res.status(400).json({ Message: "Nothing" });
    } else {
      res.status(400).json({ Message: orders });
    }
  } catch (error) {
    res.status(400).json({ Message: error });
  }
};

const updateOrder = async (req, res) => {
  const payload = req.user;
  const email = payload.email;
  const id = req.body._id;
  const address = req.body.address;
  const orders = await order.findOne({ _id: id, id: email });
  const status = orders.status;
  if (status > 2) {
    res
      .status(400)
      .json({ Message: "Order is being delivery, cant not be update" });
  } else {
    try {
      await order.findOneAndUpdate(
        { _id: id },
        { address: address, updateDay: Date.now() }
      );
      res.status(200).json({ Message: "Update succesfull" });
    } catch (error) {
      res.status(400).json({ Error: error });
    }
  }
};

const userDeleteOrder = async (req, res) => {
  const payload = req.user;
  const email = payload.email;
  const id = req.body._id;
  const orders = await order.findOne({ _id: id, id: email });
  const status = orders.status;
  if (status != 1) {
    res.status(400).json({ Message: "Order is handing, can't update" });
  } else {
    try {
      await order.findOneAndUpdate(
        { _id: id, id: email },
        { status: statusMiddleWare.orderStatus.DELETE }
      );
      res.status(200).json({ Message: "Delete Successful" });
    } catch (error) {
      res.status(400).json({ Error: error });
    }
  }
};
const adminDeleteOrder = async (req, res) => {
  const payload = req.user;
  const email = payload.email;
  const id = req.body._id;
  const orders = await order.findOne({ _id: id });
  const status = orders.status;
  if (status == 4) {
    res.status(400).json({ Message: "Order is finsh, can't delete" });
  } else {
    try {
      await order.findOneAndUpdate(
        { _id: id },
        { status: statusMiddleWare.orderStatus.DELETE }
      );
      res.status(200).json({ Message: "Delete successful" });
    } catch (error) {
      res.status(400).json({ Error: error });
    }
  }
};

//Update status

const processingUpdate = async (req, res) => {
  const payload = req.user;
  const id = req.body._id;
  const orders = await order.findOne({ _id: id });
  const status = orders.status;

  if (status == 1) {
    try {
      await order.findOneAndUpdate(
        { _id: id },
        { status: statusMiddleWare.orderStatus.PROCESSING }
      );
      res.status(200).json({ Message: "Update Sucessful" });
    } catch (error) {
      res.status(400).json({ Error: error });
    }
  } else {
    res.status(400).json({ Message: "This Order can not processing" });
  }
};

const shippingUpdate = async (req, res) => {
  const payload = req.user;
  const id = req.body._id;
  const orders = await order.findOne({ _id: id });
  const status = orders.status;
  if (status == 2) {
    try {
      await order.findOneAndUpdate(
        { _id: id },
        {
          status: statusMiddleWare.orderStatus.SHIPPING,
          deliveryDay: Date.now(),
        }
      );
      res.status(200).json({ Message: "Update Sucessful" });
    } catch (error) {
      res.status(400).json({ Error: error });
    }
  } else {
    res.status(400).json({ Message: "This Order can not processing" });
  }
};

const finishUpdate = async (req, res) => {
  const payload = req.user;
  const id = req.body._id;
  const orders = await order.findOne({ _id: id });
  const status = orders.status;
  if (status == 3) {
    try {
      await order.findOneAndUpdate(
        { _id: id },
        { status: statusMiddleWare.orderStatus.FINISH, finishDay: Date.now() }
      );
      res.status(200).json({ Message: "Update Sucessful" });
    } catch (error) {
      res.status(400).json({ Error: error });
    }
  } else {
    res.status(400).json({ Message: "This Order can not processing" });
  }
};

//get Order
const getWaitingOrder = async (req, res) => {
  try {
    const orders = await order.find({ status: 1 });
    res.status(200).json({ Message: orders });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

const getProcessingOrder = async (req, res) => {
  try {
    const orders = await order.find({ status: 2 });
    res.status(200).json({ Message: orders });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

const getShippingOrder = async (req, res) => {
  try {
    const orders = await order.find({ status: 3 });
    res.status(200).json({ Message: orders });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

const getFinishOrder = async (req, res) => {
  try {
    const orders = await order.find({ status: 4 });
    res.status(200).json({ Message: orders });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

const getDeleteOrder = async (req, res) => {
  try {
    const orders = await order.find({ status: 0 });
    res.status(200).json({ Message: orders });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

export default {
  createOrder,
  getOrder,
  updateOrder,
  userDeleteOrder,
  adminDeleteOrder,
  processingUpdate,
  shippingUpdate,
  finishUpdate,
  getWaitingOrder,
  getProcessingOrder,
  getShippingOrder,
  getShippingOrder,
  getFinishOrder,
  getFinishOrder,
  getDeleteOrder,
  getUserOrder,
};
