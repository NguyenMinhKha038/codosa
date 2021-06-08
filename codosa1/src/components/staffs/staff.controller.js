import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import { staffService } from "./staff.service";
import { userService } from "../users/user.service";
const staffRegister = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const staffExits = await staffService.getOne({ email });
    if (staffExits) {
      throw new BaseError({
        name: name,
        httpCode: statusCode.ALREADY_EXITS,
        description: errorList.ALREADY_EXITS,
      });
    }
    const hash = await bcrypt.hash(password, 10);
    await staffService.create({
      name,
      password: hash,
      email,
    });
    responseSuccess(res, 201, { email, name });
  } catch (error) {
    next(error);
  }
};

const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let staff = await staffService.getOne({ email });
    if (!staff) {
      throw new BaseError({
        name: email,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    await bcrypt.compare(password, staff.password);
    let payload = {
      name: staff.name,
      role: staff.role,
      _id: staff._id,
      email: email,
    };
    let token = jwt.sign(payload, process.env.privateKey);
    req.user = token;
    responseSuccess(res, 200, token);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const checkExits = await userService.getOne({ _id: userId });
    if (!checkExits) {
      throw new BaseError({
        name: email,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    await userService.findOneAndDisable({ _id: userId });
    responseSuccess(res, 204, email);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { email, name, password } = req.body;
    const user = await userService.getOne({ _id: userId });
    if (!user) {
      throw new BaseError({
        name: email,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    const hash = await bcrypt.hash(password, 10);
    await userService.findOneAndUpdate(
      { email: email },
      { name: name, password: hash }
    );
    responseSuccess(res, 200, { email, name });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userService.getOne({ _id: userId });
    if (!user) {
      throw new BaseError({
        name: email,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    responseSuccess(res, 200, {
      name: user.name,
      status: user.status,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const getInfo = async (req, res, next) => {
  try {
    const { email, name, role } = req.user;
    responseSuccess(res, 200, { email: email, name: name, role: role });
  } catch (error) {
    next(error);
  }
};
export default {
  staffRegister,
  staffLogin,
  deleteUser,
  updateUser,
  getUser,
  getInfo,
};
