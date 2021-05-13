import user from "./user.model";
import cart from "../cart/cart.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import statusMiddleWare from "../utils/status";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const userRegister = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const session = await mongoose.startSession();
    session.startTransaction(); //start transaction
    const options = { session };
    const hash = await bcrypt.hash(password, 10);

    const userModel = new user({
      name,
      password: hash,
      email,
      role: statusMiddleWare.permission.USER,
      status: statusMiddleWare.personStatus.ACTIVE,
    });
    const users = await userModel.save(options);

    const cartModel = new cart({
      userId: users._id,
      product: [],
      total: 0,
    });
    const carts = await cartModel.save(options);
    await session.commitTransaction();
    res.status(200).json({ message: { name: name, email: email } });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  let users = await user.findOne({ email: email });
  if (!users) {
    res.status(401).json({ message: "No such user found" });
  } else {
    try {
      await bcrypt.compare(password, users.password);
      let payload = {
        name: users.name,
        role: users.role,
        email: email,
        _id: users._id,
      };
      let token = jwt.sign(payload, process.env.privateKey);
      req.user = token;
      res.status(200).json({ token: token });
    } catch (error) {
      res.status(400).json({ Error: error });
    }
  }
};

const getInfo = async (req, res) => {
  try {
    const { name, role, email } = req.user;
    res.status(200).json({ Name: name, Role: role, Email: email });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const deleteAccount = async (req, res) => {
  const password = req.body.password;
  const email = req.user.email;
  try {
    let users = await user.findOne({ email: email });
    await bcrypt.compare(password, users.password);
    users.remove();
  } catch (error) {
    req.status(400).json({Error:error});
  }
};

export default { userLogin, userRegister, getInfo, deleteAccount };
