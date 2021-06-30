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
import Promise from "bluebird";
import orderModel from "./order.model";
mongoose.Promise = Promise;
// CRUD order
const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const option = { session, new: true };
  try {
    const userId = req.user._id;
    const { address, phone } = req.body;
    const cart = await cartService.getOne({ userId: userId }, null, {
      populate: "products.productId",
      option
    });
    if (!cart.products.length) {
      throw new BaseError({
        name: "Cart",
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.CART_EMPTY,
      });
    }
    let total = 0;
    let orderInfo = [];
    await Promise.map(cart.products, (value) => {
      total += value.productId.price * value.quantity;
      orderInfo.push({
        productId: value.productId._id,
        quantity: value.quantity,
        price: value.productId.price,
      });
      productService.findOneAndUpdate(
        { _id: value.productId._id },
        { quantity: value.productId.quantity - value.quantity },
        option
      );
    });
    const order = await orderService.create(
      {
        userId: userId,
        products: orderInfo,
        total,
        address,
        phone,
      },
      option
    );
    await Promise.all([
      notificationService.create(
        {
          title: "New Order",
          orderId: order._id,
        },
        option
      ),
      cartService.findOneAndUpdate(
        { userId: userId },
        { products: [] },
        option
      ),
    ]);
    await session.commitTransaction();
    return responseSuccess(res, 200, orderInfo);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const userGetOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page, perPage } = req.query;
    const order = await orderService.get({ userId }, null, {
      populate: "products.productId",
    });
    if (!order.length) {
      throw new BaseError({
        name: userId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    return responseSuccess(res, 200, order);
  } catch (error) {
    next(error);
  }
};
const adminGetOrder = async (req, res, next) => {
  try {
    const query = req.query;
    const order = await orderService.get(query);
    if (!order.length) {
      throw new BaseError({
        name: query,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    return responseSuccess(res, 200, order);
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { address, phone } = req.body;
    const orderId = req.params.orderId;
    const userId = req.user._id;
    const order = await orderService.getOne({
      _id: orderId,
      userId: userId,
    });
    const status = order.status;
    if (status > 2 || status === 0) {
      throw new BaseError({
        name: order,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.UPDATE_ORDER_FAILD,
      });
    }
    const orderUpdated = await orderService.findOneAndUpdate(
      { _id: orderId, userId: userId },
      { address: address, phone: phone, updateDay: Date.now() }
    );
    return responseSuccess(res, 200, orderUpdated);
  } catch (error) {
    next(error);
  }
};

const userDeleteOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.orderId;
    const order = await orderService.getOne({
      _id: orderId,
      userId: userId,
    });
    const status = order.status;
    if (status !== 1) {
      throw new BaseError({
        name: orderId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.DELETE_ORDER_FAILD,
      });
    }
    await orderService.findOneAndDisable({ _id: orderId, userId: userId });
    return responseSuccess(res, 204, orderId);
  } catch (error) {
    next(error);
  }
};
const adminDeleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.getOne({ _id: orderId });
    const status = order.status;
    if (!order || status === 4) {
      throw new BaseError(
        orderId,
        statusCode.BAD_REQUEST,
        errorList.DELETE_ORDER_FAILD
      );
    }
    await orderService.findOneAndDisable({ _id: orderId });
    return responseSuccess(res, 204, orderId);
  } catch (error) {
    next(error);
  }
};
//Update status
const updateStatus = async (req, res, next) => {
  try {
    const { orderId, status } = req.params;

    const order = await orderService.getOne({ _id: orderId });
    if (order && order.status + 1 === Number(status)) {
      if (Number(status) === 4) {
        const updatedOrder = await orderService.findOneAndUpdate(
          { _id: orderId },
          { status: status, finishDay: Date.now() }
        );
        return responseSuccess(res, 200, updatedOrder);
      }
      if (Number(status) === 3) {
        const updatedOrder = await orderService.findOneAndUpdate(
          { _id: orderId },
          { status: status, deliveryDay: Date.now() }
        );
        return responseSuccess(res, 200, updatedOrder);
      }
      const updatedOrder = await orderService.findOneAndUpdate(
        { _id: orderId },
        { status: status }
      );
      return responseSuccess(res, 200, updatedOrder);
    }
    throw new BaseError({
      name: orderId,
      httpCode: statusCode.BAD_REQUEST,
      description: errorList.UPDATE_FAILD,
    });
  } catch (error) {
    next(error);
  }
};
//get Order

export default {
  createOrder,
  userGetOrder,
  updateOrder,
  userDeleteOrder,
  adminDeleteOrder,
  updateStatus,
  adminGetOrder,
};
