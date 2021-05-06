import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require:true
  },
  email: {
    type: String,
    unique: true,
  },
  status:{
    type:Number,
    require:true
  },
  image: String,
});
module.exports = mongoose.model("user", userSchema);
