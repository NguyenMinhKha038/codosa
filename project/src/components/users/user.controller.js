import user from "./user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRegister = async (req, res) => {
  const { email, name, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    let users = await new user({
      name: name,
      password: hash,
      role: role,
      email: email,
    });
    try {
      await users.save();
      res.send("tạo ok");
    } catch (error) {
      res.send(error);
    }
  } catch (err) {
    res.send("not");
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  // we get the user with the name and save the resolved promise
  let users = await user.findOne({ email: email });
  if (!users) {
    res.status(401).json({ msg: "No such user found", users });
  } else {
    try {
      await bcrypt.compare(password, users.password);
      let payload = { name: users.name, role: users.role, email: email };
      let token = jwt.sign(payload, process.env.PrivateKey);
      req.header.authorization = token;
      res.status(200).json({ token: token });
    } catch (error) {
      res.send("Không đúng mk");
    }
  }
};

const testToken = (req, res) => {
  res.send("token Ok");
};

export default { userLogin, userRegister, testToken };
