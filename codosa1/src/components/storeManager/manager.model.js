import mongoose from "mongoose";
const Schema = mongoose.Schema;
//sm is Store Manager
const managerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  image: String,
});
module.exports = mongoose.model("manager", managerSchema);
