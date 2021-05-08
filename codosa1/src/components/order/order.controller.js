import product from "../products/product.model";
import cart from "../cart/cart.model";
import order from "../order/order.model";
import statusMiddleWare from "../utils/status";
import notification from "../notification/notification.model";
import startSession from "mongoose";
// CRUD order
const createOrder = async (req, res) => {
  const payload = req.user;
  const email = payload.email;
  const carts = await cart.findOne({ id: email });
  if (carts.total == 0) {
    res.status(400).json({ Message: "Cart is Empty" });
  } else {
    try {
      const session = await startSession();
      session.startTransaction(); //start transaction
      const productName = carts.productName;
      const address = req.body.address;
      if (!address) {
        res.status(400).json({ Message: "Address is Empty" });
      }
      let arrProduct = [];
      for (const value of productName) {
        let products = await product.findOne({ name: value.Product });
        arrProduct.push({
          product: value.Product,
          price: products.price,
          amount: value.Amount,
        });
        await product.findOneAndUpdate(
          { name: value.Product },
          { amount: products.amount - value.Amount }
        );
      }
      // const arr = productName.map(value=>{
      //   let products = await product.findOne({ name: value.Product });
      //   arrProduct.push({
      //         product: value.Product,
      //         price: products.price,
      //         amount: value.Amount,
      //       });
      //       await product.findOneAndUpdate(
      //             { name: value.Product },
      //             { amount: products.amount - value.Amount }
      //           );
      // })
      const total = arrProduct.reduce((total, value) => {
        return (total += value.price * value.amount);
      }, 0);
      let orders = new order({
        id: email,
        product: arrProduct,
        status: "Waiting",
        createDay: Date.now(),
        total: total,
        address: address,
      });
      const notifications = new notification({
        title:"Order mới vừa được tạo",
        content:JSON.stringify(orders),
        Date:Date.now()
      })
      //await notification.save({session});
      //await orders.save({session});
      Promise.all(notification.save({session}),orders.save({session}));
      await cart.findOneAndUpdate({ id: email }, { productName: [], total: 0 },{session}); //new
      await session.commitTransaction();
      session.endSession(); //end transaction
      res.status(200).json({ Message: "Create order successful" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ Error: error });
    }
  }
};

const getOrder = async (req, res) => {
  const payload = req.user;
  const email = payload.email;
  try {
    const orders = await order.find({ id: email });
    if (!orders) {
      res.status(400).json({ Message: "何でもない" });
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
      res.status(400).json({ Message: "何でもない" });
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
      .json({ Message: "Order đang được giao, không thể cập nhật" });
  } else {
    try {
      await order.findOneAndUpdate(
        { _id: id },
        { address: address, updateDay: Date.now() }
      );
      res.status(200).json({ Message: "Đã update thành công" });
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
