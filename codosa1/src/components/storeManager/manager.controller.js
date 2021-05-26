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
    const checkExits = await managerService.getOne({
      condition: { email: email },
    });
    if (checkExits) {
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
      role: statusMiddleWare.permission.MANAGER,
      status: statusMiddleWare.personStatus.ACTIVE,
    });
    responseSuccess(res, { email, name });
  } catch (err) {
    next(error);
  }
};

const managerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const manager = await managerService.getOne({ condition: { email: email } });
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
    responseSuccess(res, token);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const checkExits = await userService.getOne({ condition: { _id: userId } });
    if (!checkExits) {
      throw new BaseError({
        name: email,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    await userService.findOneAndDelete({ _id: userId });
    responseSuccess(res, userId);
  } catch (error) {
    next(error);
  }
};
const deleteStaff = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const checkExits = await staffService.getOne({ condition: { _id: userId } });
    if (!checkExits) {
      throw new BaseError({
        name: userId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    await staffService.findOneAndDelete({ _id: userId });
    responseSuccess(res, userId);
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const userId = req.params.id;
    const findUser = userService.getOne({ condition: { _id: userId } });
    if (findUser) {
      const hash = await bcrypt.hash(password, 10);
      await userService.findOneAndUpdate(
        { _id: userId },
        { name: name, password: hash, email: email }
      );
      responseSuccess(res, { email, name });
    }
    throw new BaseError({
      name: userId,
      httpCode: statusCode.BAD_REQUEST,
      description: errorList.FIND_ERROR,
    });
  } catch (error) {
    next(error);
  }
};
const updateStaff = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const staffId = req.params.id;
    const findStaff = staffService.getOne({ condition: { _id: staffId } });
    if (findStaff) {
      const hash = await bcrypt.hash(password, 10);
      await staffService.findOneAndUpdate(
        { _id: staffId },
        { name: name, password: hash, email: email }
      );
      responseSuccess(res, { email, name });
    }
    throw new BaseError({
      name: staffId,
      httpCode: statusCode.BAD_REQUEST,
      description: errorList.FIND_ERROR,
    });
  } catch (error) {
    next(error);
  }
};
const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userService.getOne({ condition: { _id: userId } });
    if (user) {
      responseSuccess(res, user);
    }
    throw new BaseError({
      name: userId,
      httpCode: statusCode.BAD_REQUEST,
      description: errorList.FIND_ERROR,
    });
  } catch (error) {
    next(error);
  }
};

const getStaff = async (req, res, next) => {
  try {
    const staffId = req.params.id;
    const staff = await staffService.getOne({ condition: { _id: staffId } });
    if (staff) {
      responseSuccess(res, staff);
    } else {
      throw new BaseError({
        name: staffId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
  } catch (error) {
    next(error);
  }
};
const getInfo = async (req, res, next) => {
  try {
    const { name, role, email } = req.user;
    responseSuccess(res, { name, role, email });
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
