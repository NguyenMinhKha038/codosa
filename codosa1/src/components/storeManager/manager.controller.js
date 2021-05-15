import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "../utils/auth";
import manager from "./manager.model";
import user from "../users/user.model";
import staff from "../staffs/staff.model";
import statusMiddleWare from "../utils/status";

const managerRegister = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    await auth.checkManagerExist;
    const hash = await bcrypt.hash(password, 10);
    let managers = await new manager({
      name,
      password: hash,
      email,
      role: statusMiddleWare.permission.MANAGER,
      status: statusMiddleWare.personStatus.ACTIVE,
    });

    await managers.save();
    res.status(200).json({ message: { name: name, email: email } });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
};

const managerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let managers = await manager.findOne({ email: email });
    if (!managers) {
      res.status(401).json({ msg: "No such user found" });
    } else {
      await bcrypt.compare(password, managers.password);
      let payload = { name: managers.name, role: managers.role, email: email };
      let token = jwt.sign(payload, process.env.privateKey);
      req.user = token;
      res.status(200).json({ token: token });
    }
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

const deleteUser = async (req, res,next) => {
  const email = req.body.email;
  const checkExits = await user.findOne({email:email});
  if(!checkExits){
    res.status(400).json({ message: "No such user found" });
  }
  try {
    await user.findOneAndUpdate(
      { email: email },
      { status: statusMiddleWare.personStatus.DISABLE }
    );
    res.status(204).json({ message: "Successful" });
  } catch (error) {
    next(error)
  }
};
const deleteStaff = async (req, res) => {
  const email = req.body.email;
  const checkExits = await staff.findOne({email:email});
  if(!checkExits){
    req.status(400).json({ message: "No such user found!" });
  }
  try {
    await staff.findOneAndUpdate(
      { email: email },
      { status: statusMiddleWare.personStatus.DISABLE }
    );
    res.status(200).json({ message: "Successful" });
  } catch (error) {
    req.status(400).json({ message: "Failed!" });
  }
};
const updateUser = async (req, res) => {
  const { email, name, password } = req.body;
  const findUser = user.findOne({ email: email });
  if (findUser) {
    const hash = await bcrypt.hash(password, 10);
    try {
      await user.findOneAndUpdate(
        { email: email },
        { name: name, password: hash }
      );
      res.status(200).json({ message: "Update successful" });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  } else {
    res.status(400).json({ message: "User not found" });
  }
};
const updateStaff = async (req, res) => {
  const { email, name, password } = req.body;

  const findStaff = staff.findOne({ email: email });
  if (findStaff) {
    const hash = await bcrypt.hash(password, 10);
    try {
      await staff.findOneAndUpdate(
        { email: email },
        { name: name, password: hash }
      );
      res.status(200).json({ message: "Update successful" });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  } else {
    res.status(400).json({ message: "User not found" });
  }
};
const getUser = async (req, res) => {
  const email = req.body.email; //ok

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

const getStaff = async (req, res) => {
  const email = req.body.email; //ok

  try {
    const staffs = await staff.findOne({ email: email });
    if (staffs) {
      res.status(200).json({ Info: staffs });
    } else {
      res.status(400).json({ err: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};
const getInfo = async (req, res) => {
  try {
    const { name, role, email } = req.user;
    res.status(200).json({ Name: name, Role: role, Email: email });
  } catch (error) {
    res.status(400).json({ Error: error });
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
