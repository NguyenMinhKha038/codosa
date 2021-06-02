import mongoose from "mongoose";
import statusMiddleWare from "../utils/status";
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
    type: Number,
    required: true,
    default:statusMiddleWare.permission.MANAGER
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  status: {
    type: Number,
    require: true,
    default:statusMiddleWare.personStatus.ACTIVE,
    min:0,
    max:1
  },
  image: {
    type: String,
    default:null

  },
});
const managerModel = mongoose.model("manager", managerSchema);
export default managerModel;
