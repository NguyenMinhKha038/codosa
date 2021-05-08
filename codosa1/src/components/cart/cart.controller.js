import cart from "./cart.model";
import product from "../products/product.model";

const getCart = async (req, res) => {
  const email = req.user.Email;
  try {
    const carts = await cart.findOne({ id: email });
    if (!carts) {
      res.status(200).json({ Message: "Cart is Emty" });
    } else {
      res.status(200).json({ Cart: carts });
    }
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};
const addCart = async (req, res) => {
  const { productName, amount ,id} = req.body;
  const email = req.user.email;
  const session = client.startSession(); 
  session.startTransaction();//start transaction
  const opts = { session, returnOriginal: false };
  const products = await product.findOne({ name: productName,_id:id });
  const carts = await cart.findOne({ id: email });
  const total = carts.total + products.price * amount;
  const arrProduct = [...carts.productName];

  try {
    arrProduct.push({ Product: productName, Amount: amount });
    await cart.findOneAndUpdate(
      { id: email },
      { total: total, productName: arrProduct },
      opts
    );
    res.status(200).json({ Cart: arrProduct, Total: total });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ Error: error });
  }
  finally {
    await session.commitTransaction();
    session.endSession(); //end transaction
  }
};

const updateCart = async (req, res) => {
  const { productName, amount } = req.body;
  const email = req.user.email;
  const products = await product.findOne({ name: productName });
  let total = 0;
  const carts = await cart.findOne({ id: email });
  const arrProduct = [...carts.productName];
  let newArrProduct = [];
  //const total = carts.total + products.price * amount;
  for (const index in arrProduct) {
    if (productName == arrProduct[index].Product) {
      const oldAmount = arrProduct[index].Amount;
      arrProduct.splice(arrProduct.indexOf(arrProduct[index].Product), 1);
      total =
        carts.total - products.price * oldAmount + products.price * amount;
      arrProduct.push({ Product: productName, Amount: amount });
    }
  }
  try {
    await cart.findOneAndUpdate(
      { id: email },
      { total: total, productName: arrProduct }
    );
    res.status(200).json({ Cart: arrProduct, Total: total });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};
export default { getCart, addCart, updateCart };
