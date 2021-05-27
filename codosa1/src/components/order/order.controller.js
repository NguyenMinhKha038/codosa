import statusMiddleWare from "../utils/status";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import { orderService } from "./order.service";
import mongoose, { isValidObjectId } from "mongoose";
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
    const cart = await cartService.getOne({
      condition: { userId: userId },
      populate: "product.productId",
      option: option,
    });
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
    next(error);
  } finally {
    session.endSession();
  }
};

const getOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const order = await orderService.get({ condition: { userId: userId } });
    if (order.length == 0) {
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
const getUserOrder = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const order = await orderService.get({ condition: { userId: userId } });
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
  const session = await mongoose.startSession();
  session.startTransaction();
  const option = { session, new: true };
  try {
    const { address, phone } = req.body;
    const orderId = req.params.id;
    const order = await orderService.getOne({
      condition: { _id: orderId },
      option: option,
    });
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
      { address: address, updateDay: Date.now() },
      option
    );
    await session.commitTransaction();
    responseSuccess(res, { orderId, address });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const userDeleteOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const option = { session, new: true };
  try {
    const userId = req.user._id;
    const orderId = req.params.id;
    const order = await orderService.getOne({
      condition: {
        _id: orderId,
      },
      option: option,
    });
    const status = order.status;
    if (status != 1) {
      throw new BaseError({
        name: orderId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.DELETE_ORDER_FAILD,
      });
    }
    await orderService.findOneAndDelete({ _id: orderId }, option);
    await session.commitTransaction();
    responseSuccess(res, orderId);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
const adminDeleteOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const option = { session, new: true };
  try {
    const orderId = req.params.id;
    const order = await orderService.getOne({
      condition: { _id: orderId },
      option: option,
    });
    const status = order.status;
    if (status == 4) {
      throw new BaseError(
        orderId,
        statusCode.BAD_REQUEST,
        errorList.DELETE_ORDER_FAILD
      );
    }
    await orderService.findOneAndDelete({ _id: orderId }, option);
    await session.commitTransaction();
    responseSuccess(res, orderId);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
//Update status
const updateStatus = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const option = { session, new: true };
  try {
    const { orderId, status } = req.params;
    const orderStatus = [
      statusMiddleWare.orderStatus.PROCESSING,
      statusMiddleWare.orderStatus.SHIPPING,
      statusMiddleWare.orderStatus.FINISH,
    ];
    const order = await orderService.getOne({
      condition: { _id: orderId },
      option: option,
    });
    if (order && order.status + 1 == status) {
      await orderService.findOneAndUpdate(
        { _id: orderId },
        { status: orderStatus[status] },
        option
      );
      await session.commitTransaction();
      responseSuccess(res, order);
    } else {
      throw new BaseError({
        name: orderId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.UPDATE_FAILD,
      });
    }
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
//get Order
const adminGetOrder = async (req, res, next) => {
  try {
    const status = req.params.status;
    const orders = await orderService.get({ condition: { status: status } });
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
  updateStatus,
  adminGetOrder,
  getUserOrder,
};
