import mongoose from "mongoose";
import statusMiddleWare from "../utils/status";
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
    type: Number,
    require: true,
    default:statusMiddleWare.permission.USER
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  status: {
    type: Number,
    require: true,
    max:1,
    min:0,
    default:statusMiddleWare.personStatus.ACTIVE
  },
  image: {
    type: String,
    default:null
  },
});
export default mongoose.model("user", userSchema);


const userModel = mongoose.model("user", userSchema);
