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
      category:category,
      description,
      status: statusMiddleWare.productStatus.ACTIVE,
    });
    console.log(products);
    const checkCategory = await categoryModel.find({ name: category });
   
    if (!checkCategory) {
      let categories = new categoryModel({
        name: category,
        status: statusMiddleWare.categoryStatus.ACTIVE,
      });
      console.log("co1");
      await categories.save();
    }
    console.log("khong6 co");
    await products.save();

    res.status(200).json({
      message: {
        name: name,
        amount: amount,
        price: price,
        description: description,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res) => {
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
    res.status(400).json({ Error: error });
  }
};
const deleteProduct = async (req, res) => {
  const name = req.body.name;
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
    res.status(200).json({ message: "Update successful" });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

export default { addProduct, getProduct, deleteProduct, updateProduct };
