import category from "./category.model";
import product from "../products/product.model";
import statusMiddleWare from "../utils/status";

const addCategory = async (req, res, next) => {
  const categoryName = req.body.category;
  try {
    const checkCategory = await category.findOne({ name: categoryName });
    if (checkCategory) {
      res.status(403).json({ message: "Already exist" });
    }
    let categories = new category({
      name: categoryName,
      status: statusMiddleWare.categoryStatus.ACTIVE,
    });

    await categories.save();
    res.status(200).json({ name: categoryName });
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (req, res,next) => {
  const categories = req.body.category;

  await Promise.all(
    category.findOneAndUpdate(
      { name: categories },
      { status: statusMiddleWare.categoryStatus.DISABLE }
    ),
    product.updateMany(
      { category: categories },
      { status: statusMiddleWare.categoryStatus.DISABLE }
    )
  )
    .then((value) => {
      res.status(200).json({ message: "Delete successful" });
    })
    .catch((error) => {
      next(error);
    });
};
const getListCategory = async (req, res,next) => {
  const categories = await category.find({});
  let list = categories.map((x) => x._id);
  if (list.length == 0) {
    res.status(200).json({ message: "Cant not found" });
  }
  res.status(200).json({ category: categories });
};
const getAllProduct = async (req, res) => {
  const categories = req.body.category;
  try {
    const listProduct = await product.findMany({ category: categories });
    if (listProduct.length == 0) {
      res.status(200).json({ Message: "Cant not found" });
    }
    res.status(200).json({ Product: listProduct });
  } catch (error) {
    next(error);
  }
};
const updateCategory = async (req, res) => {
  const { name, newName } = req.body;
  try {
    await Promise.all(
      category.findOneAndUpdate({ name: name }, { name: newName }),
      product.updateMany({ category: name }, { category: newName })
    );
    res.status(200).json({ message:{name:name,newName:newName} });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};
export default {
  addCategory,
  deleteCategory,
  getListCategory,
  updateCategory,
  getAllProduct,
};
