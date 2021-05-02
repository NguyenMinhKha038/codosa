import user from "./user.model";
import cart from "../cart/cart.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "../common/auth";
import dotenv from "dotenv";
dotenv.config();

const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    let users = new user({
      name: name,
      password: hash,
      email: email,
      role: "user",
    }); //ok
    let carts = new cart({
      id: email,
      productName: [],
      total: 0,
    });
    try {
      await users.save();
      await carts.save();
      res.status(200).json({ message: "Tạo thành công" });
    } catch (error) {
      res.status(400).json({ "Lỗi save": error });
    }
  } catch (error) {
    res.status(400).json({ "Lỗi hash": error });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  let users = await user.findOne({ email: email });
  if (!users) {
    res.status(401).json({ msg: "No such user found", users });
  } else {
    try {
      await bcrypt.compare(password, users.password);
      let payload = { name: users.name, role: users.role, email: email };
      let token = jwt.sign(payload, process.env.privateKey);
      req.header.authorization = token;
      res.status(200).json({ token: token });
    } catch (error) {
      res.status(400).json({ Error: error });
    }
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

const deleteAccount = async (req, res) => {
  const password = req.body.password;
  const email = req.user.email;
  try {
    let users = await user.findOne({ email: email });
    await bcrypt.compare(password, users.password);
    users.remove();
  } catch (error) {}
};

export default { userLogin, userRegister, getInfo, deleteAccount };
