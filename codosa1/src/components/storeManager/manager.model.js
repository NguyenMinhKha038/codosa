import mongoose from "mongoose";
const Schema = mongoose.Schema;
//sm is Store Manager
const managerSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
});
module.exports = mongoose.model("manager", managerSchema);
