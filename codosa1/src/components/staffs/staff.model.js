import mongoose from "mongoose";
import statusMiddleWare from "../utils/status";
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
    type: Number,
    require: true,
    default:statusMiddleWare.permission.STAFF
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  status: {
    type: Number,
    required: true,
    default:statusMiddleWare.permission.USER,
    min:0,
    max:1
  },
  image: {
    type:String,
    default:null
  },
});
const staffModel =mongoose.model("staff", staffSchema);
export default staffModel;
