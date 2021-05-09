import product from "../products/product.model";
import order from "../order/order.model";

const reportProduct = async (req, res) => {
  try {
    let total = 0;
    const name = req.body.name;
    const toDay = req.body.toDay;
    const fromDay = req.body.fromDay;
    // const orders = await order.find({
    //   finishDay: { $gte: fromDay, $lte: toDay },
    // });
    const products = await product.findOne({ name: name });
    const price = products.price;
    const orders = await order.aggregate([
      {
        $match: {
          finishDay: { $gte: new Date(fromDay), $lte: new Date(toDay) },
        },
      },
      {
        $project:{
          product:1,
          price:1,
          amount:1
        }
      }  
    ]);
    
    
    for (const oneOrder of orders) {
      const listProduct = oneOrder.product;
      for (const ord of listProduct) {
        if (ord.product == name) {
          total += ord.amount;
        }
      }
    }
    //const orders = await order.aggregate([{$match:{finishDay: { $gte: fromDay, $lte: toDay }}}]);

    const revenue = price * total;
    res.status(200).json({ Result:orders,Total: total, Revenue: revenue });
    //res.status(200).json({ order:orders});
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

const reportCategory = async (req, res) => {
  try {
    let productSold = [];
    let listProduct = [];
    let total = 0;
    const name = req.body.name;
    const toDay = req.body.toDay;
    const fromDay = req.body.fromDay;
    const products = await product.find({ category: name });
    const orders = await order.find({
      finishDay: { $gte: fromDay, $lte: toDay },
    });
    for (const value of products) {
      listProduct.push(value.name);
    }
    for (const oneOrder of orders) {
      const arrProduct = oneOrder.product;
      for (const ord of arrProduct) {
        if (listProduct.includes(ord.product)) {
          productSold.push({ Product: ord.product, Amount: ord.amount });
          total += ord.price * ord.amount;
        }
      }
    }
    res.status(200).json({ Total: productSold, Revenue: total });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

export default { reportProduct, reportCategory };
