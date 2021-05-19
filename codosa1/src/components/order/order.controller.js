import productModel from "../products/product.model";
import cartModel from "../cart/cart.model";
import orderModel from "../order/order.model";
import statusMiddleWare from "../utils/status";
import notification from "../notification/notification.model";
import statusMiddleware from "../utils/status";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import {reponseSuccess} from "../error/baseResponese";
import mongoose from "mongoose";
// CRUD order
const createOrder = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction(); //start transaction
    const opts = { session, new: true };
    const { userId } = req.user;
    const { address, phone } = req.body;
    const carts = await cart
      .findOne({ userId: userId })
      .populate("product.productId");
    if (carts.product.length == 1) {
      throw new baseError("Cart",statusCode.NOT_FOUND,errorList.FIND_ERROR)
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
        await productModel.findOneAndUpdate(
          { _id: value.productId._id },
          { amount: value.productId.amount - value.amount },
          opts
        );
      });
      const orders = new orderModel({
        userId: userId,
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
        cartModel.findOneAndUpdate({ userId: userId }, { product: [] }, opts),
      ]);
      await session.commitTransaction();
      reponseSuccess(res,orders)
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orders = await orderModel.find({ userId: userId });
    if (!orders) {
      throw new baseError(userId,statusCode.NOT_FOUND,errorList.FIND_ERROR)
    } 
    reponseSuccess(res,orders)
  } catch (error) {
    next(error);
  }
};
const getUserOrder = async (req, res) => {
  try {
    const userId = req.body.userId;
    const orders = await order.find({ userId: userId });
    if (!orders) {
      throw new baseError(_id,statusCode.NOT_FOUND,errorList.FIND_ERROR)
    }
    reponseSuccess(res,orders)
    
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { orderId, address } = req.body;
    const orders = await orderModel.findOne({ _id: orderId });
    const status = orders.status;
    if (status > 2) {
      throw new baseError(orders,statusCode.NOT_FOUND,errorList.UPDATE_ORDER_FAILD)
    }
    await orderModel.findOneAndUpdate(
      { _id: orderId },
      { address: address, updateDay: Date.now() }
    );
    reponseSuccess(res,{ orderId, address })
  } catch (error) {
    next(error);
  }
};

const userDeleteOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orderId = req.body._id;
    const orders = await orderModel.findOne({ _id: orderId, userId: userId });
    const status = orders.status;
    if (status != 1) {
      throw new baseError(email,statusCode.BAD_REQUEST,errorList.DELETE_ORDER_FAILD);
    }
    await orderModel.findOneAndUpdate(
      { _id: orderId, userId: userId },
      { status: statusMiddleWare.orderStatus.DELETE }
    );
    reponseSuccess(res,orderId)
  } catch (error) {
    next(error);
  }
};
const adminDeleteOrder = async (req, res) => {
  try {
    const orderId = req.body._id;
    const orders = await orderModel.findOne({ _id: orderId });
    const status = orders.status;
    if (status == 4) {
      throw new baseError(orderId,statusCode.BAD_REQUEST,errorList.DELETE_ORDER_FAILD);
    }
    await orderModel.findOneAndUpdate(
      { _id: orderId },
      { status: statusMiddleWare.orderStatus.DELETE }
    );
    reponseSuccess(res,orderId)
  } catch (error) {
    next(error);
  }
};

//Update status

const processingUpdate = async (req, res, next) => {
  try {
    const orderId = req.body._id;
    const orders = await orderModel.findOne({ _id: orderId });
    const status = orders.status;
    if (status == 1) {
      await orderModel.findOneAndUpdate(
        { _id: orderId },
        { status: statusMiddleWare.orderStatus.PROCESSING }
      );
      reponseSuccess(res,orderId)
    }
    throw new baseError(orderId,statusCode.BAD_REQUEST,errorList.UPDATE_PROCESSING_FAILD);
  } catch (error) {
    next(error);
  }
};

const shippingUpdate = async (req, res) => {
  try {
    const orderId = req.body._id;
    const orders = await orderModel.findOne({ _id: orderId });
    const status = orders.status;
    if (status == 2) {
      await orderModel.findOneAndUpdate(
        { _id: orderId },
        {
          status: statusMiddleWare.orderStatus.SHIPPING,
          deliveryDay: Date.now(),
        }
      );
      reponseSuccess(res,orderId);
    }
    throw new baseError(orderId,statusCode.BAD_REQUEST,errorList.UPDATE_SHIPPING_FAILD);
  } catch (error) {
    next(error);
  }
};

const finishUpdate = async (req, res, next) => {
  try {
    const orderId = req.body._id;
    const orders = await orderModel.findOne({ _id: orderId });
    const status = orders.status;
    if (status == 3) {
      await orderModel.findOneAndUpdate(
        { _id: orderId },
        { status: statusMiddleWare.orderStatus.FINISH, finishDay: Date.now() }
      );
      reponseSuccess(res,orderId)
    }
    throw new baseError(orderId,statusCode.BAD_REQUEST,errorList.UPDATE_FINISH_FAILD)
  } catch (error) {
    next(error);
  }
};

//get Order
const getWaitingOrder = async (req, res, next) => {
  try {
    const orders = await orderModel.find({ status: 1 });
    reponseSuccess(res,orders)
  } catch (error) {
    next(error);
  }
};
const getProcessingOrder = async (req, res, next) => {
  try {
    const orders = await orderModel.find({ status: 2 });
    if (!orders) {
      throw new baseError("processing",statusCode.BAD_REQUEST,errorList.FIND_ERROR)
    }
    reponseSuccess(res,orders)
  } catch (error) {
    next(error);
  }
};

const getShippingOrder = async (req, res, next) => {
  try {
    const orders = await orderModel.find({ status: 3 });
    reponseSuccess(res,orders)
  } catch (error) {
    next(error);
  }
};

const getFinishOrder = async (req, res, next) => {
  try {
    const orders = await orderModel.find({ status: 4 });
    if (!orders) {
      throw new baseError("processing",statusCode.BAD_REQUEST,errorList.FIND_ERROR)
    }
    reponseSuccess(res,orders)
  } catch (error) {
    next(error);
  }
};

const getDeleteOrder = async (req, res, next) => {
  try {
    const orders = await orderModel.find({ status: 0 });
    if (!orders) {
      throw new baseError("processing",statusCode.BAD_REQUEST,errorList.FIND_ERROR)
    }
    reponseSuccess(res,orders)
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
