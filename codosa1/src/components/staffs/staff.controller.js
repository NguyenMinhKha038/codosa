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
    const existedStaff = await staffService.getOne({ email });
    if (existedStaff) {
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
    return responseSuccess(res, 201, { email, name });
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
    return responseSuccess(res, 200, token);
  } catch (error) {
    next(error);
  }
};
const getInfo = async (req, res, next) => {
  try {
    const { email, name, role } = req.user;
    return responseSuccess(res, 200, { email: email, name: name, role: role });
  } catch (error) {
    next(error);
  }
};
const managerGetStaff = async (req, res, next) => {
  try {
    const query = req.query
    const staff = await staffService.get(query);
    if (!staff.length) {
      throw new BaseError({
        name: query,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    return responseSuccess(res, 200, {
      name: staff.name,
      email: staff.email,
      status: staff.status,
      role: staff.role,
    });
  } catch (error) {
    next(error);
  }
};
const managerUpdateStaff = async (req, res, next) => {
  try {
    const { name, password } = req.body;
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
      { name: name, password: hash}
    );
    return responseSuccess(res, 200, name );
  } catch (error) {
    next(error);
  }
};
const managerDeleteStaff = async (req, res, next) => {
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
    await staffService.findOneAndDisable({ _id: staffId });
    return responseSuccess(res, 204, staffId);
  } catch (error) {
    next(error);
  }
};
export default {
  staffRegister,
  staffLogin,
  getInfo,
  managerGetStaff,
  managerUpdateStaff,
  managerDeleteStaff
};
