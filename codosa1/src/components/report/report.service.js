import orderModel from "../order/order.model";
import { BaseService } from "../utils/BaseService";

const service = (orderModel) => {
  const reportProduct = async (query) => {
    try {
      let item = await orderModel.aggregate([
        {
          $match: query,
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
      return item;
    } catch (errors) {
      throw errors;
    }
  };

  const reportCategory = async (query) => {
    try {
      let item = await orderModel.aggregate([
        {
          $match: query,
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
      return item;
    } catch (errors) {
      throw errors;
    }
  };

  return { reportProduct, reportCategory, ...BaseService(orderModel) };
};

export const reportService = {
  ...service(orderModel),
};
