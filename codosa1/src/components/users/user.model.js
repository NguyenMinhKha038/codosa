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
  },
  email: {
    type: String,
    unique: true,
  },
  image: String,
});
module.exports = mongoose.model("user", userSchema);
