import mongoose from "mongoose";
import statusMiddleWare from "../utils/status";
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  image: {
    type:Array,
    default:null
  },
  status: {
    type: Number,
    require: true,
    default:statusMiddleWare.categoryStatus.ACTIVE
  },
});
export default mongoose.model("category", categorySchema);
