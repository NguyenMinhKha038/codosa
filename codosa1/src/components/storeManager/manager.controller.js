import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "../utils/auth";
import manager from "./manager.model";
import user from "../users/user.model";
import staff from "../staffs/staff.model";
import statusMiddleWare from "../utils/status";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import {baseRes} from "../error/baseRes";

const managerRegister = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const checkExits = await manager.findOne({ email: email });
    if (checkExits) {
      throw new baseError(name,statusCode.ALREADY_EXITS,errorList.already_Exits);
    }
    const hash = await bcrypt.hash(password, 10);
    let managers = await new manager({
      name,
      password: hash,
      email,
      role: statusMiddleWare.permission.MANAGER,
      status: statusMiddleWare.personStatus.ACTIVE,
    });
    await managers.save();
    baseRes(res,statusCode.Created,{email, name},"Successful")
  } catch (err) {
    next(error);
  }
};

const managerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let managers = await manager.findOne({ email: email });
    if (!managers) {
     throw new baseError(email,statusCode.BAD_REQUEST,errorList.foundError);
    }
    await bcrypt.compare(password, managers.password);
    let payload = { name: managers.name, role: managers.role, email: email };
    let token = jwt.sign(payload, process.env.privateKey);
    req.user = token;
    //return res.status(200).json({ token: token });
    baseRes(res,statusCode.OK,token,"Successful")
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const checkExits = await user.findOne({ email: email });
    if (!checkExits) {
      throw new baseError(email,statusCode.BAD_REQUEST,errorList.foundError);
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
const deleteStaff = async (req, res, next) => {
  try {
    const email = req.body.email;
    const checkExits = await staff.findOne({ email: email });
    if (!checkExits) {
      throw new baseError(email,statusCode.BAD_REQUEST,errorList.foundError);
    }
    await staff.findOneAndUpdate(
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
    const findUser = user.findOne({ email: email });
    if (findUser) {
      const hash = await bcrypt.hash(password, 10);
      await user.findOneAndUpdate(
        { email: email },
        { name: name, password: hash }
      );
      baseRes(res,statusCode.OK,{email, name},"Successful")
    }
    throw new baseError(email,statusCode.BAD_REQUEST,errorList.foundError);
  } catch (error) {
    next(error);
  }
};
const updateStaff = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const findStaff = staff.findOne({ email: email });
    if (findStaff) {
      const hash = await bcrypt.hash(password, 10);

      await staff.findOneAndUpdate(
        { email: email },
        { name: name, password: hash }
      );
      baseRes(res,statusCode.OK,{email, name},"Successful")
    }
    throw new baseError(email,statusCode.BAD_REQUEST,errorList.foundError);
  } catch (error) {
    next(error);
  }
};
const getUser = async (req, res, next) => {
  try {
    const email = req.body.email; //ok
    const users = await user.findOne({ email: email });
    if (users) {
      baseRes(res,statusCode.OK,users,"Successful")
    } else {
      throw new baseError(email,statusCode.BAD_REQUEST,errorList.foundError);
    }
  } catch (error) {
    next(error);
  }
};

const getStaff = async (req, res, next) => {
  try {
    const email = req.body.email; //ok
    const staffs = await staff.findOne({ email: email });
    if (staffs) {
      baseRes(res,statusCode.OK,staffs,"Successful")
    } else {
      throw new baseError(email,statusCode.BAD_REQUEST,errorList.foundError);
    }
  } catch (error) {
    next(error);
  }
};
const getInfo = async (req, res, next) => {
  try {
    const { name, role, email } = req.user;
    baseRes(res,statusCode.OK,{ name, role, email },"Successful")
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
