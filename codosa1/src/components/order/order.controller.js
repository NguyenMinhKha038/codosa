import product from "../products/product.model";
import cart from "../cart/cart.model";
import order from "../order/order.model";
import statusMiddleWare from "../utils/status";
import notification from "../notification/notification.model";
import statusMiddleware from "../utils/status";
import mongoose from "mongoose";
// CRUD order
const createOrder = async (req, res, next) => {
  const { email, _id } = req.user;
  console.log("ok")
  const { products, address, phone } = req.body;
  console.log(products)
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const opts = { session, new: true };
  const carts = await cart.findOne({ userId: _id }).populate("product.productId");
  
  if (carts.product.length == 1) {
  
    res.status(400).json({ Message: "Cart is Empty" });
  } else {
    try {
      let total = 0;
      products.map((value) => {
        
        total += value.amount * value.price;
      });
      const orders = new order({
        id: _id,
        products,
        phone,
        address,
        status: statusMiddleWare.orderStatus.WAITING,
        total,
      });
      const notifications = new notification({
        title: "New Order",
        content: orders,
        Date: Date.now(),
      });
      await Promise.all([
        notifications.save(opts),
        orders.save(opts),
        cart.findOneAndUpdate({ userId: _id }, { product: [] }, opts),
      ]);
      await session.commitTransaction();
      res.status(200).json({ Message: orders });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }
};

const getOrder = async (req, res,next) => {
  const _id = req.user._id;
  try {
    const orders = await order.find({ id: _id });
    if (!orders) {
      res.status(400).json({ Message: "No such order find" });
    } else {
      res.status(400).json({ Message: orders });
    }
  } catch (error) {
    next(error);
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

const updateOrder = async (req, res,next) => {
  const id = req.body._id;
  const address = req.body.address;
  const orders = await order.findOne({ _id: id});
  const status = orders.status;
  if (status > 2) {
    res
      .status(400)
      .json({ Message: "Order is being delivery or finish, cant not be update" });
  } else {
    try {
      await order.findOneAndUpdate(
        { _id: id },
        { address: address, updateDay: Date.now() }
      );
      res.status(200).json({ address: address });
    } catch (error) {
      next(error);
    }
  }
};

const userDeleteOrder = async (req, res,next) => {
  const email = req.user.email;
  const id = req.body._id;
  const orders = await order.findOne({ _id: id, id: email });
  const status = orders.status;
  if (status != 1) {
    res.status(400).json({ Message: "Order is handing, can't delete" });
  } else {
    try {
      await order.findOneAndUpdate(
        { _id: id, id: email },
        { status: statusMiddleWare.orderStatus.DELETE }
      );
      res.status(200).json({ Message: "Delete Successful" });
    } catch (error) {
      next(error);
    }
  }
};
const adminDeleteOrder = async (req, res) => {
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

const processingUpdate = async (req, res,next) => {
  const _id = req.body._id;
  const orders = await order.findOne({ _id: _id });
  const status = orders.status;

  if (status == 1) {
    try {
      await order.findOneAndUpdate(
        { _id: _id },
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
const getWaitingOrder = async (req, res,next) => {
  try {
    const orders = await order.find({ status: 1 });
    res.status(200).json({ Message: orders });
  } catch (error) {
    next(error);
  }
};
const getProcessingOrder = async (req, res,next) => {
  try {
    const orders = await order.find({ status: 2 });
    if(!orders){
      res.status(400).json({Message:"No such order found"});
    }
    res.status(200).json({ orders: orders });
  } catch (error) {
    next(error);
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
