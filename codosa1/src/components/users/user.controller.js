import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import statusMiddleWare from "../utils/status";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import { userService } from "./user.service";
import { cartService } from "../cart/cart.service";
import mongoose from "mongoose";
const userRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userExits = await userService.getOne({ email });
    if (userExits) {
      throw new BaseError({
        name: { name, email },
        httpCode: statusCode.ALREADY_EXITS,
        description: errorList.ALREADY_EXITS,
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await userService.create({
      name,
      password: hash,
      email,
    });
    await cartService.create({
      userId: newUser._id,
    });
    responseSuccess(res, { name, email });
  } catch (error) {
    next(error);
  }
};
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getOne({ email });
    if (!user) {
      throw new BaseError({
        name: { email, password },
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    await bcrypt.compare(password, user.password);
    const payload = {
      name: user.name,
      role: user.role,
      email: user.email,
      _id: user._id,
    };
    const token = jwt.sign(payload, process.env.privateKey);
    req.user = token;
    responseSuccess(res, token);
  } catch (error) {
    next(error);
  }
};

const getInfo = async (req, res) => {
  try {
    const { name, role, email } = req.user;
    responseSuccess(res, { name: name, role: role, email: email });
  } catch (error) {
    next(error);
  }
};

export default { userLogin, userRegister, getInfo };
