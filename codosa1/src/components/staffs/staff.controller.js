import staff from "../staffs/staff.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "../common/auth";
import user from "../users/user.model";
import dotenv from "dotenv";
import product from "../products/product.controller";
dotenv.config();
const staffRegister = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    let staffs = await new staff({
      name: name,
      password: hash,
      email: email,
      role: "staff",
    });
    try {
      await staffs.save();
      res.status(200).json({ message: "Tạo OK" });
    } catch (error) {
      res.status(400).json({ "Lỗi save": error });
    }
  } catch (err) {
    res.status(400).json({ Error: err });
  }
};

const staffLogin = async (req, res) => {
  const { email, password } = req.body;
  let staffs = await staff.findOne({ email: email });
  if (!staffs) {
    res.status(401).json({ msg: "No such user found", staffs });
  } else {
    try {
      await bcrypt.compare(password, staffs.password);
      let payload = { name: staffs.name, role: staffs.role, email: email };
      let token = jwt.sign(payload, process.env.PrivateKey);
      req.header.authorization = token;
      res.status(200).json({ token: token });
    } catch (error) {
      res.status(400).json({ message: "Không đúng mật khẩu" });
    }
  }
};

const deleteUser = async (req, res) => {
  const email = req.body.email;
  try {
    await user.deleteOne({ email: email });
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    req.status(400).json({ message: "Xóa không thành công" });
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
    res.status(200).json({ message: "Update thành công" });
  } catch (error) {
    res.status(400).json({ message: error });
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

const getInfo = async (req, res) => {
  try {
    const { name, role, email } = res.user;
    res.status(200).json({ Name: name, Role: role, Email: email });
  } catch (error) {
    res.status.json({ message: error });
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
