import staff from "../staffs/staff.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../users/user.model";
import dotenv from "dotenv";
import statusMiddleWare from "../utils/status"
dotenv.config();
const staffRegister = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    let staffs = await new staff({
      name: name,
      password: hash,
      email: email,
      role: statusMiddleWare.permission.STAFF,
      status:statusMiddleWare.permission.USER
    });
    try {
      await staffs.save();
      res.status(200).json({ message: "Successfull" });
    } catch (error) {
      res.status(400).json({ Error: error });
    }
  } catch (err) {
    res.status(400).json({ Error: err });
  }
};

const staffLogin = async (req, res) => {
  const { email, password } = req.body;
  let staffs = await staff.findOne({ email: email });
  if (!staffs) {
    res.status(401).json({ message: "No such user found" });
  } else {
    try {
      await bcrypt.compare(password, staffs.password);
      let payload = {
        name: staffs.name,
        role: staffs.role,
        email: email
       
      };
      let token = jwt.sign(payload, process.env.privateKey);
      req.header.authorization = token;
      res.status(200).json({ token: token });
    } catch (error) {
      res.status(400).json({ message: "Password incorrect" });
    }
  }
};

const deleteUser = async (req, res) => {
  const email = req.body.email;
  try {
    await user.findOneAndUpdate({ email: email },{status:statusMiddleWare.personStatus.DISABLE});
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

const getInfo = async (req, res) => {
  try {
    const payload = req.user
    const email = payload.email;
    const name = payload.name;
    const role = payload.role;
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
