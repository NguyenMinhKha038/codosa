import staff from "../staffs/staff.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../users/user.model";
import dotenv from "dotenv";
import auth from "../utils/auth";
import statusMiddleWare from "../utils/status";
dotenv.config();
const staffRegister = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    auth.checkStaffExist;
    const hash = await bcrypt.hash(password, 10);
    let staffs = await new staff({
      name,
      password: hash,
      email,
      role: statusMiddleWare.permission.STAFF,
      status: statusMiddleWare.permission.USER,
    });
    await staffs.save();
    res.status(200).json({ message: staffs });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

const staffLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let staffs = await staff.findOne({ email: email });
    if (!staffs) {
      res.status(401).json({ message: "No such user found" });
    } else {
      await bcrypt.compare(password, staffs.password);
      let payload = {
        name: staffs.name,
        role: staffs.role,
        email: email,
      };
      let token = jwt.sign(payload, process.env.privateKey);
      req.user = token;
      res.status(200).json({ token: token });
    }
  } catch (error) {
    res.status(400).json({ message: "Password incorrect" });
  }
};

const deleteUser = async (req, res) => {
  const email = req.body.email;
  try {
    await user.findOneAndUpdate(
      { email: email },
      { status: statusMiddleWare.personStatus.DISABLE }
    );
    res.status(200).json({ message: "Delete successful" });
  } catch (error) {
    req.status(400).json({ message: "Delete Failed" });
  }
};

const updateUser = async (req, res) => {
  const { email, name, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    await user.findOneAndUpdate(
      { email: email },
      { name: name, password: hash }
    );
    res.status(200).json({ message: "Update successful" });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

const getUser = async (req, res) => {
  const email = req.body.email;
  try {
    const users = await user.findOne({ email: email });
    if (users) {
      res.status(200).json({ Info: users });
    } else {
      res.status(400).json({ Error: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

const getInfo = async (req, res) => {
  try {
    const { email, name, role } = req.user;
    res.status(200).json({ Name: name, Role: role, Email: email });
  } catch (error) {
    res.status(400).json({ Error: error });
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
