import passport from "passport";
import { users, staffs, managers } from "./passport";

const passportUser = (req, res, next) => {
  return passport.authenticate("user", { session: false })(req, res, next);
};

const passportStaff = (req, res, next) => {
  return passport.authenticate("staff", { session: false })(req, res, next);
};
const passportManager = (req, res, next) => {
  return passport.authenticate("manager", { session: false })(req, res, next);
};
const isStaff = async (req, res, next) => {
  const role = req.user.role;
  if (role && role == 1) {
    return next();
  } else {
    res.status(401).json({ message: "Must be Staff" });
  }
};
const isUser = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role && role == 0) {
      next();
    } else {
      res.status(401).json({ Message: "Must be User" });
    }
  } catch (error) {
    next(error);
  }
};
const isManager = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role == 2) {
      return next();
    } else {
      res.status(401).json({ message: req.user });
    }
  } catch (error) {
    next(error);
  }
};

const checkAuth = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role == 1 || role == 2) {
      next();
    } else {
      res.status(401).json({ message: req.user });
    }
  } catch (error) {
    next(error);
  }
};




export default {
  isStaff,
  isManager,
  isUser,
  checkAuth,
  passportUser,
  passportStaff,
  passportManager,
};
