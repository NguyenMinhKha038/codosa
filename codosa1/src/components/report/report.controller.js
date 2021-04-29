import product from "../products/product.model";
import category from "../category/category.model";
import order from "../order/order.model";

const reportProduct = async(req,res)=>{
  try {
    let total=0;
    const name = req.body.name;
    const toDay = req.body.toDay;
    const fromDay = req.body.fromDay;
    const orders =await order.find({updateDay:{$gte:toDay,$lte:fromDay}});
    const products = await product.findOne({name:name});
    const price = products.price;
    for (const oneOrder of orders) {
      const listProduct = oneOrder.product
      for (const ord of listProduct) {
        if(ord.product==name){
          total+=ord.amount;
        }
      }
    }
    const revenue = price*total
    res.status(200).json({Total:total,Revenue:revenue});
  } catch (error) {
    res.status(400).json({Error:error});
  }
}


export default {reportProduct};