import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import statusMiddleWare from "../utils/status";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import { managerService } from "./manager.service";
import { userService } from "../users/user.service";
import { staffService } from "../staffs/staff.service";

const managerRegister = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const managerExits = await managerService.getOne({ email });
    if (managerExits) {
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
    responseSuccess(res, 201, { email, name });
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
    responseSuccess(res, 200, token);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
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
const deleteStaff = async (req, res, next) => {
  try {
    const staffId = req.params.id;
    const staffExits = await staffService.getOne({ _id: staffId });
    if (!staffExits) {
      throw new BaseError({
        name: staffId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    await staffService.findOneAndDisable({ _id: staffId });
    responseSuccess(res, 204, staffId);
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
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
      { name: name, password: hash, email: email }
    );
    responseSuccess(res, 200, { email, name });
  } catch (error) {
    next(error);
  }
};
const updateStaff = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const staffId = req.params.id;
    const staff = staffService.getOne({ _id: staffId });
    if (!staff) {
      throw new BaseError({
        name: staffId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    const hash = await bcrypt.hash(password, 10);
    await staffService.findOneAndUpdate(
      { _id: staffId },
      { name: name, password: hash, email: email }
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

const getStaff = async (req, res, next) => {
  try {
    const staffId = req.params.id;
    const staff = await staffService.getOne({ _id: staffId });
    if (!staff) {
      throw new BaseError({
        name: staffId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    responseSuccess(res, 200, {
      name: staff.name,
      email: staff.email,
      status: staff.status,
      role: staff.role,
    });
  } catch (error) {
    next(error);
  }
};
const getInfo = async (req, res, next) => {
  try {
    const { name, role, email } = req.user;
    responseSuccess(res, 200, { name: name, role: role, email: email });
  } catch (error) {
    next(error);
  }
};
export default {
  managerRegister,
  managerLogin,
  deleteUser,
  deleteStaff,
  updateUser,
  updateStaff,
  getUser,
  getStaff,
  getInfo,
};
