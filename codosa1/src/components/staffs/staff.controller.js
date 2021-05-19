import staff from "../staffs/staff.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../users/user.model";
import statusMiddleWare from "../utils/status";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import {baseRes} from "../error/baseRes";
const staffRegister = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const checkExits = await staff.findOne({ email: email });
    if (checkExits) {
      throw new baseError(name,statusCode.ALREADY_EXITS,errorList.already_Exits);
    }
    const hash = await bcrypt.hash(password, 10);
    let staffs = await new staff({
      name,
      password: hash,
      email,
      role: statusMiddleWare.permission.STAFF,
      status: statusMiddleWare.permission.USER,
    });
    await staffs.save();
    baseRes(res,statusCode.Created,staffs,"Successful")
  } catch (error) {
    next(error);
  }
};

const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let staffs = await staff.findOne({ email: email });
    if (!staffs) {
      throw new baseError(email,statusCode.NOT_FOUND,errorList.foundError);
    } else {
      await bcrypt.compare(password, staffs.password);
      let payload = {
        name: staffs.name,
        role: staffs.role,
        email: email,
      };
      let token = jwt.sign(payload, process.env.privateKey);
      req.user = token;
      baseRes(res,statusCode.OK,token,"Successful")
    }
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const checkExits = await user.findOne({ email: email });
    if (!checkExits) {
      throw new baseError(email,statusCode.NOT_FOUND,errorList.foundError);
    }
    await user.findOneAndUpdate(
      { email: email },
      { status: statusMiddleWare.personStatus.DISABLE }
    );
    baseRes(res,statusCode.OK,email,"Successful")
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await user.findOneAndUpdate(
      { email: email },
      { name: name, password: hash }
    );
    baseRes(res,statusCode.OK,{ email, name, password },"Successful")
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const users = await user.findOne({ email: email });
    if (users) {
      baseRes(res,statusCode.OK,users,"Successful")
    } else {
      throw new baseError(email,statusCode.NOT_FOUND,errorList.foundError);
    }
  } catch (error) {
    next(error);
  }
};

const getInfo = async (req, res, next) => {
  try {
    const { email, name, role } = req.user;
    baseRes(res,statusCode.OK,{ email, name, role },"Successful")
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
