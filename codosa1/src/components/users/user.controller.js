import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import statusMiddleWare from "../utils/status";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { reponseSuccess } from "../error/baseResponese";
import userService from "./user.service";
import cartService from "../cart/cart.service";
import mongoose from "mongoose";
import userModel from "./user.model";
const userRegister = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const options = { session };
  try {
    const { name, email, password } = req.body;
    const checkExits = await userService.findOneByAny(
      { email: email },
      null,
      options
    );
    console.log(checkExits);
    if (checkExits) {
      throw new baseError(
        { name, email },
        statusCode.ALREADY_EXITS,
        errorList.ALREADY_EXITS
      );
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await userService.create({
      name,
      password: hash,
      email,
      role: statusMiddleWare.permission.USER,
      status: statusMiddleWare.personStatus.ACTIVE,
    });
    await cartService.create({
      userId: newUser._id,
      product: [],
      total: 0,
    });
    await session.commitTransaction();
    reponseSuccess(res, { name, email });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await userService.findOneByAny({ email: email });
    if (!users) {
      throw new baseError(
        { email, password },
        statusCode.NOT_FOUND,
        errorList.FIND_ERROR
      );
    }
    await bcrypt.compare(password, users.password);
    const payload = {
      name: users.name,
      role: users.role,
      email: users.email,
      _id: users._id,
    };
    const token = jwt.sign(payload, process.env.privateKey);
    req.user = token;
    reponseSuccess(res, token);
  } catch (error) {
    next(error);
  }
};

const getInfo = async (req, res) => {
  try {
    const { name, role, email } = req.user;
    reponseSuccess(res, { name, role, email });
  } catch (error) {
    return next(error);
  }
};

export default { userLogin, userRegister, getInfo };
