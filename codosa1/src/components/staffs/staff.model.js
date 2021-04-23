import mongoose from "mongoose";
const Schema = mongoose.Schema;

const staffSchema = new Schema({
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
module.exports = mongoose.model("staff", staffSchema);
