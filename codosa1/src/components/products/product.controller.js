import categoryModel from "../category/category.model";
import product from "../products/product.model";
import statusMiddleWare from "../utils/status";
import mongoose from "mongoose";
const addProduct = async (req, res, next) => {
  const { name, amount, price, category, description } = req.body;

  try {
    const checkProduct = await product.findOne({ name: name });
    if (checkProduct) {
      res.status(403).json({ message: "Already exist " });
    }
    let products = new product({
      name,
      amount,
      price,
      category,
      description,
      status: statusMiddleWare.productStatus.ACTIVE,
    });
    const checkCategory = await categoryModel.find({ name: category });
   
    if (!checkCategory) {
      let categories = new categoryModel({
        name: category,
        status: statusMiddleWare.categoryStatus.ACTIVE,
      });
      await categories.save();
    }
    await products.save();

    res.status(200).json({
      message: {
        name,
        amount,
        price,
        description,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res,next) => {
  const name = req.body.name;

  try {
    const products = await product.find({ name: name });
    if (products) {
      res.status(200).json({
        name: products[0].name,
        amount: products[0].amount,
        price: products[0].price,
      });
    } else {
      res.status(400).json({ message: "Product not found" });
    }
  } catch (error) {
    next(errer);
  }
};
const deleteProduct = async (req, res,next) => {
  const name = req.body.name;
  const checkExits = await product.findOne({name:name});
  if(!checkExits){
    res.status(400).json({ message: "Can not find product" });
  }
  try {
    await product.findOneAndUpdate(
      { name: name },
      { status: statusMiddleWare.productStatus.DISABLE }
    );
    res.status(200).json({ message: "Delete successful" });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};
const updateProduct = async (req, res) => {
  const { name, amount, price, newName, id } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const opts = { session, new: true };
  try {
    const checkExits = await product.findOne({ _id: id });
    if (!checkExits) {
      res.status(400).json({ message: "Can not find product" });
    }
    await product.findOneAndUpdate(
      { _id: id },
      { name: newName, amount: amount, price: price },
      opts
    );
    await session.commitTransaction();
    res.status(200).json({ message: {name: newName, amount: amount, price: price} });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

export default { addProduct, getProduct, deleteProduct, updateProduct };
