import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import { managerService } from "./manager.service";

const managerRegister = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const existedManager = await managerService.getOne({ email });
    if (existedManager) {
      throw new BaseError({
        name: name,
        httpCode: statusCode.ALREADY_EXITS,
        description: errorList.ALREADY_EXITS,
      });
    }
    const hash = await bcrypt.hash(password, 10);
    await managerService.create({
      name,
      password: hash,
      email,
    });
    return responseSuccess(res, 201, { email, name });
  } catch (err) {
    next(error);
  }
};

const managerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const manager = await managerService.getOne({ email });
    if (!manager) {
      throw new BaseError({
        name: email,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    await bcrypt.compare(password, manager.password);
    const payload = {
      name: manager.name,
      role: manager.role,
      email: manager.email,
      _id: manager._id,
    };
    const token = jwt.sign(payload, process.env.privateKey);
    req.user = token;
    return responseSuccess(res, 200, token);
  } catch (error) {
    next(error);
  }
};

const getInfo = async (req, res, next) => {
  try {
    const { name, role, email } = req.user;
    return responseSuccess(res, 200, { name: name, role: role, email: email });
  } catch (error) {
    next(error);
  }
};
export default {
  managerRegister,
  managerLogin,
  getInfo,
};
