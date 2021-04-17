import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    unique: true,
    maxlength: 6,
  },
  email: {
    type: String,
    unique: true,
  },
});
module.exports = mongoose.model("user", userSchema);
