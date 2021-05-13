import product from "../products/product.model";
import order from "../order/order.model";
import category from "../category/category.model";

const reportProduct = async (req, res, next) => {
  try {
    const { _id, toDay, fromDay } = req.body;
    const report = await order.aggregate([
      {
        $match: {
          finishDay: { $gte: new Date(fromDay), $lte: new Date(toDay) },
          
          
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productArr",
        },
      },
      {
        $unwind: "$products",
        //[{$unwind: "$products"}.productId]
      },
     
      {
        $group: {
          _id: "$products.productId",
          amount: { $sum: "$products.amount" },
          revenue: {
            $sum: { $multiply: ["$products.price", "$products.amount"] },
          },
          product: { $push: "$products" },
          name: { $push: "$productArr.name" },
          price:{ $push: "$productArr.price" },
        
      
        },
      },
      {
        $project: {
          _id: "$_id",
          products: "$products[0].productId",
          name: "$name",
          price:"$price",
          amount: "$amount",
          revenue: "$revenue",
          
        },
      },
    ]);
    res.status(200).json({ Result: report });
  } catch (error) {
    next(error);
  }
};

const reportCategory = async (req, res, next) => {
  try {
    const { _id, fromDay, toDay } = req.body;
    const report = await category.aggregate([
      {
        $match: {
          finishDay: { $gte: new Date(fromDay), $lte: new Date(toDay) },
          
        },
      },
    ]);
  } catch (error) {
    next(error);
  }
};

export default { reportProduct, reportCategory };
