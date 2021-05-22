import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  product:[{
    type:Schema.Types.ObjectId,
    ref:"product"
  }],
  image: {
    type:Array,
    default:null
  },
  status: {
    type: Number,
    require: true,
  },
});
export default mongoose.model("category", categorySchema);
