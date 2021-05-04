import mongoose from "mongoose";
const Schema = mongoose.Schema;

const staffSchema = new Schema({
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
  status:String,
  image: String,
});
module.exports = mongoose.model("staff", staffSchema);
