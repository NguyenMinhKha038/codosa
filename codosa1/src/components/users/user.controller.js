import user from "./user.model";
import cart from "../cart/cart.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import statusMiddleWare from "../utils/status";
import mongoose from "mongoose";
const userRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const checkExits = await user.findOne({ email: email });
    if (checkExits) {
      return res.status(403).json({ message: "Already exist" });
    }
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
    await cartModel.save(options);
    await session.commitTransaction();
    return res.status(201).json({ message: { name: name, email: email } });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let users = await user.findOne({ email: email });
    if (!users) {
      return res.status(401).json({ message: "No such user found" });
    }
    await bcrypt.compare(password, users.password);
    let payload = {
      name: users.name,
      role: users.role,
      email: email,
      _id: users._id,
    };
    let token = jwt.sign(payload, process.env.privateKey);
    req.user = token;
    const err =new Error("ahihi do ngoc")
    err.statusCode =401
    return next(err)
    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(400).json({ Error: error });
  }
};

const getInfo = async (req, res) => {
  try {
    const { name, role, email } = req.user;
    return res.status(200).json({ Name: name, Role: role, Email: email });
  } catch (error) {
    return next(error)
  }
};



export default { userLogin, userRegister, getInfo };
