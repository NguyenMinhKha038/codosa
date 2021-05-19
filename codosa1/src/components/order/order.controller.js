import product from "../products/product.model";
import cart from "../cart/cart.model";
import order from "../order/order.model";
import statusMiddleWare from "../utils/status";
import notification from "../notification/notification.model";
import statusMiddleware from "../utils/status";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import {baseRes} from "../error/baseRes";
import mongoose from "mongoose";
// CRUD order
const createOrder = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const session = await mongoose.startSession();
    session.startTransaction(); //start transaction
    const opts = { session, new: true };
    const { address, phone } = req.body;
    const carts = await cart
      .findOne({ userId: _id })
      .populate("product.productId");
    if (carts.product.length == 1) {
      //return res.status(400).json({ Message: "Cart is Empty" });
      throw new baseError("Cart",statusCode.NOT_FOUND,errorList.foundError)
    } else {
      let total = 0;
      let orderInfo = [];
      await carts.product.map(async (value) => {
        total += value.productId.price * value.amount;
        orderInfo.push({
          productId: value.productId._id,
          amount: value.amount,
          price: value.productId.price,
        });
        await product.findOneAndUpdate(
          { _id: value.productId._id },
          { amount: value.productId.amount - value.amount },
          opts
        );
      });
      const orders = new order({
        userId: _id,
        products: orderInfo,
        status: statusMiddleWare.orderStatus.WAITING,
        total,
        address,
        phone,
      });
      await orders.save(opts);
      const notifications = new notification({
        title: "New Order",
        orderId: orders._id,
      });
      await Promise.all([
        notifications.save(opts),
        cart.findOneAndUpdate({ userId: _id }, { product: [] }, opts),
      ]);
      await session.commitTransaction();
      //return res.status(200).json({ Message: orders });
      baseRes(res,statusCode.Created,orders,"Successful")
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const _id = req.user._id;
    const orders = await order.find({ id: _id });
    if (!orders) {
      //return res.status(400).json({ Message: "No such order find" });
      throw new baseError(_id,statusCode.NOT_FOUND,errorList.foundError)
    } 
    baseRes(res,statusCode.Created,orders,"Successful")
    //return res.status(400).json({ Message: orders });
  } catch (error) {
    next(error);
  }
};
const getUserOrder = async (req, res) => {
  try {
    const email = req.body.email;
    const orders = await order.find({ id: email });
    if (!orders) {
      throw new baseError(_id,statusCode.NOT_FOUND,errorList.foundError)
    }
    baseRes(res,statusCode.Created,orders,"Successful")
    
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { orderId, address } = req.body;
    const orders = await order.findOne({ _id: orderId });
    const status = orders.status;
    if (status > 2) {
      throw new baseError(orders,statusCode.NOT_FOUND,errorList.updateOrderFail)
    }
    await order.findOneAndUpdate(
      { _id: id },
      { address: address, updateDay: Date.now() }
    );
    return res.status(200).json({ address: address });
  } catch (error) {
    next(error);
  }
};

const userDeleteOrder = async (req, res, next) => {
  try {
    const email = req.user.email;
    const id = req.body._id;
    const orders = await order.findOne({ _id: id, id: email });
    const status = orders.status;
    if (status != 1) {
      return res.status(400).json({ Message: "Order is handing, can't delete" });
    }
    await order.findOneAndUpdate(
      { _id: id, id: email },
      { status: statusMiddleWare.orderStatus.DELETE }
    );
    return res.status(200).json({ Message: "Delete Successful" });
  } catch (error) {
    next(error);
  }
};
const adminDeleteOrder = async (req, res) => {
  try {
    const id = req.body._id;
    const orders = await order.findOne({ _id: id });
    const status = orders.status;
    if (status == 4) {
      return res.status(400).json({ Message: "Order is finsh, can't delete" });
    }
    await order.findOneAndUpdate(
      { _id: id },
      { status: statusMiddleWare.orderStatus.DELETE }
    );
    return res.status(200).json({ Message: "Delete successful" });
  } catch (error) {
    next(error);
  }
};

//Update status

const processingUpdate = async (req, res, next) => {
  try {
    const _id = req.body._id;
    const orders = await order.findOne({ _id: _id });
    const status = orders.status;
    if (status == 1) {
      await order.findOneAndUpdate(
        { _id: _id },
        { status: statusMiddleWare.orderStatus.PROCESSING }
      );
      return res.status(200).json({ Message: "Update Sucessful" });
    }
    return res.status(400).json({ Message: "This Order can not processing" });
  } catch (error) {
    next(error);
  }
};

const shippingUpdate = async (req, res) => {
  try {
    const orderId = req.body._id;
    const orders = await order.findOne({ _id: orderId });
    const status = orders.status;
    if (status == 2) {
      await order.findOneAndUpdate(
        { _id: orderId },
        {
          status: statusMiddleWare.orderStatus.SHIPPING,
          deliveryDay: Date.now(),
        }
      );
      return res.status(200).json({ Message: "Update Sucessful" });
    }
    return res.status(400).json({ Message: "This Order can not processing" });
  } catch (error) {
    next(error);
  }
};

const finishUpdate = async (req, res, next) => {
  try {
    const id = req.body._id;
    const orders = await order.findOne({ _id: id });
    const status = orders.status;
    if (status == 3) {
      await order.findOneAndUpdate(
        { _id: id },
        { status: statusMiddleWare.orderStatus.FINISH, finishDay: Date.now() }
      );
      return res.status(200).json({ Message: "Update Sucessful" });
    }
    return res.status(400).json({ Message: "This Order can not processing" });
  } catch (error) {
    next(error);
  }
};

//get Order
const getWaitingOrder = async (req, res, next) => {
  try {
    const orders = await order.find({ status: 1 });
    return res.status(200).json({ Message: orders });
  } catch (error) {
    next(error);
  }
};
const getProcessingOrder = async (req, res, next) => {
  try {
    const orders = await order.find({ status: 2 });
    if (!orders) {
      return res.status(400).json({ Message: "No such order found" });
    }
    return res.status(200).json({ orders: orders });
  } catch (error) {
    next(error);
  }
};

const getShippingOrder = async (req, res, next) => {
  try {
    const orders = await order.find({ status: 3 });
    return res.status(200).json({ Message: orders });
  } catch (error) {
    next(error);
  }
};

const getFinishOrder = async (req, res, next) => {
  try {
    const orders = await order.find({ status: 4 });
    return res.status(200).json({ Message: orders });
  } catch (error) {
    next(error);
  }
};

const getDeleteOrder = async (req, res, next) => {
  try {
    const orders = await order.find({ status: 0 });
    return res.status(200).json({ Message: orders });
  } catch (error) {
    next(error);
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
