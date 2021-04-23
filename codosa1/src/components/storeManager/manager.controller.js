import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "../common/auth";
import manager from "./manager.model";
import user from "../users/user.model";
import staff from "../staffs/staff.model";

const managerRegister = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    let managers = await new manager({
      name: name,
      password: hash,
      email: email,
      role: "manager",
    });
    try {
      await managers.save();
      res.status(200).json({ message: "Tạo thành công" });
    } catch (error) {
      res.status(400).json({ Error: error });
    }
  } catch (err) {
    res.status(400).json({ Error: err });
  }
};

const managerLogin = async (req, res) => {
  const { email, password } = req.body;
  await auth.CheckExist;
  let managers = await manager.findOne({ email: email });
  if (!managers) {
    res.status(401).json({ msg: "No such user found" });
  } else {
    try {
      await bcrypt.compare(password, managers.password);
      let payload = { name: managers.name, role: managers.role, email: email };
      let token = jwt.sign(payload, process.env.PrivateKey);
      req.header.authorization = token;
      res.status(200).json({ token: token });
    } catch (error) {
      res.status(400).json({ Error: error });
    }
  }
};

const deleteUser = async (req, res) => {
  const email = req.body.email;
  try {
    await user.findOneAndDelete({ email: email });
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    req.status(400).json({ message: "Xóa không thành công" });
  }
};
const deleteStaff = async (req, res) => {
  const email = req.body.email;
  try {
    await staff.findOneAndDelete({ email: email });
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    req.status(400).json({ message: "Xóa không thành công" });
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
      res.status(200).json({ message: "Update thành công" });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  } else {
    res.status(400).json({ message: "Không tìm thấy USer" });
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
      res.status(200).json({ message: "Update thành công" });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  } else {
    res.status(400).json({ message: "Không tìm thấy USer" });
  }
};
const getUser = async (req, res) => {
  const email = req.body.email; //ok

  try {
    const users = await user.findOne({ email: email });
    if (users) {
      res.status(200).json({ Info: users });
    } else {
      res.status(400).json({ err: "không thấy" });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const getStaff = async (req, res) => {
  const email = req.body.email; //ok

  try {
    const staffs = await staff.findOne({ email: email });
    if (staffs) {
      res.status(200).json({ Info: staffs });
    } else {
      res.status(400).json({ err: "không thấy" });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
const getInfo = async (req, res) => {
  try {
    const { name, role, email } = req.user;
    res.status(200).json({ Name: name, Role: role, Email: email });
  } catch (error) {
    res.status(400).json({ message: error });
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
