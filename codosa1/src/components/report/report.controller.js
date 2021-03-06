import orderModel from "../order/order.model";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import {reponseSuccess} from "../error/baseResponese";

const reportProduct = async (req, res, next) => {
  try {
    const { toDay, fromDay } = req.body;
    const report = await orderModel.aggregate([
      {
        $match: {
          finishDay: { $gte: new Date(fromDay), $lte: new Date(toDay) },
        },
      },

      {
        $unwind: "$products",
      },
      {
        $addFields: { buyPrice: "$products.price" },
      },
      {
        $group: {
          _id: "$products.productId",
          amount: { $sum: "$products.amount" },
          revenue: {
            $sum: { $multiply: ["$products.price", "$products.amount"] },
          },
        },
      },

      {
        $project: {
          productId: "$_id",
          amount: "$amount",
          revenue: "$revenue",
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
    ]);
    if (report.length ==0) {
      throw new baseError("Product",statusCode.NOT_FOUND,errorList.FIND_ERROR);
    }
    reponseSuccess(res,report)
  } catch (error) {
    next(error);
  }
};

const reportCategory = async (req, res, next) => {
  try {
    const { fromDay, toDay } = req.body;
    const report = await orderModel.aggregate([
      {
        $match: {
          finishDay: { $gte: new Date(fromDay), $lte: new Date(toDay) },
        },
      },

      {
        $unwind: "$products",
      },

      {
        $group: {
          _id: "$products.productId",
          amount: { $sum: "$products.amount" },
          revenue: {
            $sum: { $multiply: ["$products.price", "$products.amount"] },
          },
        },
      },
      {
        $project: {
          productId: "$_id",
          amount: "$amount",
          revenue: "$revenue",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $group: {
          _id: "$product.category",
          revenue: {
            $sum: { $add: "$revenue" },
          },
        },
      },

      {
        $addFields: { name: "$product.name" },
      },
    ]);
    reponseSuccess(res,report)
  } catch (error) {
    next(error);
  }
};

export default { reportProduct, reportCategory };
