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
    responseSuccess(res, 201, { name, email });
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
    responseSuccess(res, 200, token);
  } catch (error) {
    next(error);
  }
};

const getInfo = async (req, res) => {
  try {
    const { name, role, email } = req.user;
    responseSuccess(res, 200, { name: name, role: role, email: email });
  } catch (error) {
    next(error);
  }
};
const adminDeleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userExits = await userService.getOne({ _id: userId });
    if (!userExits) {
      throw new BaseError({
        name: email,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    await userService.findOneAndDisable({ _id: userId });
    responseSuccess(res, 204, userId);
  } catch (error) {
    next(error);
  }
};
const adminUpdateUser = async (req, res, next) => {
  try {
    const {  name, password } = req.body;
    const userId = req.params.id;
    const user = userService.getOne({ _id: userId });
    if (!user) {
      throw new BaseError({
        name: userId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    const hash = await bcrypt.hash(password, 10);
    await userService.findOneAndUpdate(
      { _id: userId },
      { name: name, password: hash }
    );
    responseSuccess(res, 200,  name );
  } catch (error) {
    next(error);
  }
};
const adminGetUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userService.getOne({ _id: userId });
    if (!user) {
      throw new BaseError({
        name: userId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    responseSuccess(res, 200, {
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

export default { userLogin, userRegister, getInfo,adminDeleteUser,adminUpdateUser,adminGetUser };
