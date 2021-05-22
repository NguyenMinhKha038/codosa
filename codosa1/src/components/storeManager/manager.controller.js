import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import statusMiddleWare from "../utils/status";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import {managerService} from "./manager.service";
import {userService} from "../users/user.service";
import {staffService} from "../staffs/staff.service";

const managerRegister = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const checkExits = await managerService.findOneByAny({ email: email });
    if (checkExits) {
      throw new BaseError(
        {name:name,
        httpCode:statusCode.ALREADY_EXITS,
        description:errorList.ALREADY_EXITS}
      );
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
    const manager = await managerService.findOneByAny({ email: email });
    if (!manager) {
      throw new BaseError({name:email, httpCode:statusCode.BAD_REQUEST, description:errorList.FIND_ERROR});
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
    const email = req.body.email;
    const checkExits = await userService.findOneByAny({ email: email });
    if (!checkExits) {
      throw new BaseError({name:email, httpCode:statusCode.BAD_REQUEST, description:errorList.FIND_ERROR});
    }
    await userService.findOneAndUpdate(
      { email: email },
      { status: statusMiddleWare.personStatus.DISABLE }
    );
    responseSuccess(res, email);
  } catch (error) {
    next(error);
  }
};
const deleteStaff = async (req, res, next) => {
  try {
    const email = req.body.email;
    const checkExits = await staffService.findOneByAny({ email: email });
    if (!checkExits) {
      throw new BaseError({name:email, httpCode:statusCode.BAD_REQUEST, description:errorList.FIND_ERROR});
    }
    await staffService.findOneAndUpdate(
      { email: email },
      { status: statusMiddleWare.personStatus.DISABLE }
    );
    responseSuccess(res, email);
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const findUser = userService.findOneByAny({ email: email });
    if (findUser) {
      const hash = await bcrypt.hash(password, 10);
      await userService.findOneAndUpdate(
        { email: email },
        { name: name, password: hash }
      );
      responseSuccess(res, { email, name });
    }
    throw new BaseError({name:email, httpCode:statusCode.BAD_REQUEST, description:errorList.FIND_ERROR});
  } catch (error) {
    next(error);
  }
};
const updateStaff = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const findStaff = staffService.findOneByAny({ email: email });
    if (findStaff) {
      const hash = await bcrypt.hash(password, 10);
      await staffService.findOneAndUpdate(
        { email: email },
        { name: name, password: hash }
      );
      responseSuccess(res, { email, name });
    }
    throw new BaseError({name:email, httpCode:statusCode.BAD_REQUEST, description:errorList.FIND_ERROR});
  } catch (error) {
    next(error);
  }
};
const getUser = async (req, res, next) => {
  try {
    const email = req.body.email; //ok
    const user = await userService.findOneByAny({ email: email });
    if (user) {
      responseSuccess(res, user);
    } else {
      throw new BaseError({name:email, httpCode:statusCode.BAD_REQUEST, description:errorList.FIND_ERROR});
    }
  } catch (error) {
    next(error);
  }
};

const getStaff = async (req, res, next) => {
  try {
    const email = req.body.email; //ok
    const staff = await staffService.findByAny({ email: email });
    if (staff) {
      responseSuccess(res, staff);
    } else {
      throw new BaseError({name:email, httpCode:statusCode.BAD_REQUEST, description:errorList.FIND_ERROR});
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
