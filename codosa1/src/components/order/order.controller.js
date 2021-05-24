import statusMiddleWare from "../utils/status";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import { orderService } from "./order.service";
import mongoose from "mongoose";
import { productService } from "../products/product.service";
import { notificationService } from "../notification/notification.service";
import { cartService } from "../cart/cart.service";
// CRUD order
const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const option = { session, new: true };
  try {
    const userId = req.user._id;
    const { address, phone } = req.body;
    const cart = await cartService.findOneByAny(
      { userId: userId },
      "product.productId",
      option
    );
    if (!cart.product) {
      throw new BaseError({
        name: "Cart",
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    let total = 0;
    let orderInfo = [];
    await cart.product.map(async (value) => {
      total += value.productId.price * value.amount;
      orderInfo.push({
        productId: value.productId._id,
        amount: value.amount,
        price: value.productId.price,
      });
      await productService.findOneAndUpdate(
        { _id: value.productId._id },
        { amount: value.productId.amount - value.amount },
        option
      );
    });
    const order = await orderService.create(
      {
        userId: userId,
        products: orderInfo,
        status: statusMiddleWare.orderStatus.WAITING,
        total,
        address,
        phone,
      },
      option
    );

    await Promise.all([
      await notificationService.create(
        {
          title: "New Order",
          orderId: order._id,
        },
        option
      ),
      cartService.findOneAndUpdate({ userId: userId }, { product: [] }, option),
    ]);
    await session.commitTransaction();
    responseSuccess(res, order);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const order = await orderService.findByAny({ userId: userId });
    if (!order) {
      throw new BaseError({
        name: userId,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    responseSuccess(res, order);
  } catch (error) {
    next(error);
  }
};
const getUserOrder = async (req, res) => {
  try {
    const userId = req.body.userId;
    const order = await orderService.findByAny({ userId: userId });
    if (!order) {
      throw new BaseError({
        name: _id,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    responseSuccess(res, order);
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { orderId, address } = req.body;
    const order = await orderService.findByAny({ _id: orderId });
    const status = order.status;
    if (status > 2) {
      throw new BaseError({
        name: order,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.UPDATE_ORDER_FAILD,
      });
    }
    await orderService.findOneAndUpdate(
      { _id: orderId },
      { address: address, updateDay: Date.now() }
    );
    responseSuccess(res, { orderId, address });
  } catch (error) {
    next(error);
  }
};

const userDeleteOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orderId = req.body._id;
    const order = await orderService.findOneAndUpdate({
      _id: orderId,
      userId: userId,
    });
    const status = order.status;
    if (status != 1) {
      throw new BaseError({
        name: orderId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.DELETE_ORDER_FAILD,
      });
    }
    await orderService.findOneAndUpdate(
      { _id: orderId, userId: userId },
      { status: statusMiddleWare.orderStatus.DELETE }
    );
    responseSuccess(res, orderId);
  } catch (error) {
    next(error);
  }
};
const adminDeleteOrder = async (req, res) => {
  try {
    const orderId = req.body._id;
    const order = await orderService.findByAny({ _id: orderId });
    const status = order.status;
    if (status == 4) {
      throw new BaseError(
        orderId,
        statusCode.BAD_REQUEST,
        errorList.DELETE_ORDER_FAILD
      );
    }
    await orderService.findOneAndUpdate(
      { _id: orderId },
      { status: statusMiddleWare.orderStatus.DELETE }
    );
    responseSuccess(res, orderId);
  } catch (error) {
    next(error);
  }
};

//Update status

const processingUpdate = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;
    const order = await orderService.findOneByAny({ _id: orderId });
    if (status ===1) {
      await orderService.findOneAndUpdate(
        { _id: orderId },
        { status: statusMiddleWare.orderStatus.PROCESSING }
      );
      responseSuccess(res, orderId);
    }
    throw new BaseError({
      name: orderId,
      httpCode: statusCode.BAD_REQUEST,
      description: errorList.UPDATE_PROCESSING_FAILD,
    });
  } catch (error) {
    next(error);
  }
};

const shippingUpdate = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;
    const order = await orderService.findOneByAny({ _id: orderId });
    const status = order.status;
    if (status === 2) {
      await orderService.findOneAndUpdate(
        { _id: orderId },
        {
          status: statusMiddleWare.orderStatus.SHIPPING,
          deliveryDay: Date.now(),
        }
      );
      responseSuccess(res, orderId);
    }
    throw new BaseError({
      name: orderId,
      httpCode: statusCode.BAD_REQUEST,
      description: errorList.UPDATE_SHIPPING_FAILD,
    });
  } catch (error) {
    next(error);
  }
};

const finishUpdate = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;
    const order = await orderService.findOneByAny({ _id: orderId });
    const status = order.status;
    if (status === 3) {
      await orderService.findOneAndUpdate(
        { _id: orderId },
        { status: statusMiddleWare.orderStatus.FINISH, finishDay: Date.now() }
      );
      responseSuccess(res, orderId);
    }
    throw new BaseError({
      name: orderId,
      httpCode: statusCode.BAD_REQUEST,
      description: errorList.UPDATE_FINISH_FAILD,
    });
  } catch (error) {
    next(error);
  }
};

//get Order
const getWaitingOrder = async (req, res, next) => {
  try {
    const orders = await orderService.findByAny({ status: 1 });
    responseSuccess(res, orders);
  } catch (error) {
    next(error);
  }
};
const getProcessingOrder = async (req, res, next) => {
  try {
    const orders = await orderService.findByAny({ status: 2 });
    if (!orders) {
      throw new BaseError(
        "processing",
        statusCode.BAD_REQUEST,
        errorList.FIND_ERROR
      );
    }
    responseSuccess(res, orders);
  } catch (error) {
    next(error);
  }
};

const getShippingOrder = async (req, res, next) => {
  try {
    const orders = await orderService.findByAny({ status: 3 });
    responseSuccess(res, orders);
  } catch (error) {
    next(error);
  }
};

const getFinishOrder = async (req, res, next) => {
  try {
    const orders = await orderService.findByAny({ status: 4 });
    if (!orders) {
      throw new BaseError(
        "processing",
        statusCode.BAD_REQUEST,
        errorList.FIND_ERROR
      );
    }
    responseSuccess(res, orders);
  } catch (error) {
    next(error);
  }
};

const getDeleteOrder = async (req, res, next) => {
  try {
    const orders = await orderService.findByAny({ status: 0 });
    if (!orders) {
      throw new BaseError(
        "processing",
        statusCode.BAD_REQUEST,
        errorList.FIND_ERROR
      );
    }
    responseSuccess(res, orders);
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
