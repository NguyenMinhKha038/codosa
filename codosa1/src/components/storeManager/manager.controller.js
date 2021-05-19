import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import managerModel from "./manager.model";
import userModel from "../users/user.model";
import staffModel from "../staffs/staff.model";
import statusMiddleWare from "../utils/status";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import {reponseSuccess} from "../error/baseResponese";

const managerRegister = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const checkExits = await managerModel.findOne({ email: email });
    if (checkExits) {
      throw new baseError(name,statusCode.ALREADY_EXITS,errorList.ALREADY_EXITS);
    }
    const hash = await bcrypt.hash(password, 10);
    let newManager = new managerModel({
      name,
      password: hash,
      email,
      role: statusMiddleWare.permission.MANAGER,
      status: statusMiddleWare.personStatus.ACTIVE,
    });
    await newManager.save();
    reponseSuccess(res,{email, name})
  } catch (err) {
    next(error);
  }
};

const managerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let managers = await managerModel.findOne({ email: email });
    if (!managers) {
     throw new baseError(email,statusCode.BAD_REQUEST,errorList.FIND_ERROR);
    }
    await bcrypt.compare(password, managers.password);
    let payload = { name: managers.name, role: managers.role, email: managers.email,_id:managers._id };
    let token = jwt.sign(payload, process.env.privateKey);
    req.user = token;
    reponseSuccess(res,token)
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const checkExits = await userModel.findOne({ email: email });
    if (!checkExits) {
      throw new baseError(email,statusCode.BAD_REQUEST,errorList.FIND_ERROR);
    }
    await userModel.findOneAndUpdate(
      { email: email },
      { status: statusMiddleWare.personStatus.DISABLE }
    );
    reponseSuccess(res,email)
  } catch (error) {
    next(error);
  }
};
const deleteStaff = async (req, res, next) => {
  try {
    const email = req.body.email;
    const checkExits = await staffModel.findOne({ email: email });
    if (!checkExits) {
      throw new baseError(email,statusCode.BAD_REQUEST,errorList.FIND_ERROR);
    }
    await staff.findOneAndUpdate(
      { email: email },
      { status: statusMiddleWare.personStatus.DISABLE }
    );
    reponseSuccess(res,email)
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const findUser = userModel.findOne({ email: email });
    if (findUser) {
      const hash = await bcrypt.hash(password, 10);
      await userModel.findOneAndUpdate(
        { email: email },
        { name: name, password: hash }
      );
      reponseSuccess(res,{email, name})
    }
    throw new baseError(email,statusCode.BAD_REQUEST,errorList.FIND_ERROR);
  } catch (error) {
    next(error);
  }
};
const updateStaff = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const findStaff = staffModel.findOne({ email: email });
    if (findStaff) {
      const hash = await bcrypt.hash(password, 10);

      await staffModel.findOneAndUpdate(
        { email: email },
        { name: name, password: hash }
      );
      reponseSuccess(res,{email, name})
    }
    throw new baseError(email,statusCode.BAD_REQUEST,errorList.FIND_ERROR);
  } catch (error) {
    next(error);
  }
};
const getUser = async (req, res, next) => {
  try {
    const email = req.body.email; //ok
    const users = await userModel.findOne({ email: email });
    if (users) {
      reponseSuccess(res,users)
    } else {
      throw new baseError(email,statusCode.BAD_REQUEST,errorList.FIND_ERROR);
    }
  } catch (error) {
    next(error);
  }
};

const getStaff = async (req, res, next) => {
  try {
    const email = req.body.email; //ok
    const staffs = await staffModel.findOne({ email: email });
    if (staffs) {
      reponseSuccess(res,staffs)
    } else {
      throw new baseError(email,statusCode.BAD_REQUEST,errorList.FIND_ERROR);
    }
  } catch (error) {
    next(error);
  }
};
const getInfo = async (req, res, next) => {
  try {
    const { name, role, email } = req.user;
    reponseSuccess(res,{ name, role, email })
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
