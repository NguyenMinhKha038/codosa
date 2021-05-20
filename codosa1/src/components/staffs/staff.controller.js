import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import statusMiddleWare from "../utils/status";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { reponseSuccess } from "../error/baseResponese";
import staffService from "./staff.service";
import userService from "../users/user.service";
const staffRegister = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const checkExits = await staffService.findOneByAny({ email: email });
    if (checkExits) {
      throw new baseError(
        name,
        statusCode.ALREADY_EXITS,
        errorList.ALREADY_EXITS
      );
    }
    const hash = await bcrypt.hash(password, 10);
    let newStaff = await staffService.create({
      name,
      password: hash,
      email,
      role: statusMiddleWare.permission.STAFF,
      status: statusMiddleWare.permission.USER,
    });
    reponseSuccess(res,{email, name});
  } catch (error) {
    next(error);
  }
};

const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let staffs = await staffService.findOneByAny({ email: email });
    if (!staffs) {
      throw new baseError(email, statusCode.NOT_FOUND, errorList.FIND_ERROR);
    }
    await bcrypt.compare(password, staffs.password);
    let payload = {
      name: staffs.name,
      role: staffs.role,
      _id: staffs._id,
      email: email,
    };
    let token = jwt.sign(payload, process.env.privateKey);
    req.user = token;
    reponseSuccess(res, token);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const checkExits = await userService.findOneByAny({ email: email });
    if (!checkExits) {
      throw new baseError(email, statusCode.NOT_FOUND, errorList.FIND_ERROR);
    }
    await userService.findOneAndUpdate(
      { email: email },
      { status: statusMiddleWare.personStatus.DISABLE }
    );
    reponseSuccess(res, email);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await userService.findOneAndUpdate(
      { email: email },
      { name: name, password: hash }
    );
    reponseSuccess(res, { email, name, password });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const users = await userService.findOneByAny({ email: email });
    if (users) {
      reponseSuccess(res, users);
    } else {
      throw new baseError(email, statusCode.NOT_FOUND, errorList.FIND_ERROR);
    }
  } catch (error) {
    next(error);
  }
};

const getInfo = async (req, res, next) => {
  try {
    const { email, name, role } = req.user;
    reponseSuccess(res, { email, name, role });
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
