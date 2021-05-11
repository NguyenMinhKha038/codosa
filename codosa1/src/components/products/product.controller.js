import category from "../category/category.model";
import product from "../products/product.model";
import statusMiddleWare from "../utils/status";
import cart from "../cart/cart.model"
import mongoose from "mongoose";
const addProduct = async (req, res) => {
  const { name, amount, price, categoryName, description } = req.body;
  const checkProduct = await product.findOne({ name: name });
  if (checkProduct) {
    res.status(403).json({ message: "Already exist " });
  }
  let products = new product({
    name: name,
    amount: amount,
    price: price,
    category: categoryName,
    description: description,
    status: statusMiddleWare.productStatus.ACTIVE,
  });

  try {
    const checkCategory = await category.findOne({ name: categoryName });
    if (!checkCategory) {
      let categories = new category({
        name: categoryName,
        status: statusMiddleWare.categoryStatus.ACTIVE,
      });
      await categories.save();
    }
    await products.save();

    res
      .status(200)
      .json({
        message: {
          name: name,
          amount: amount,
          price: price,
          description: description,
        },
      });
  } catch (error) {
    res.status(400).json({ Error: error });
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
