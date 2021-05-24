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
    type: Number,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require:true
  },
  status: {
    type: Number,
    require: true,
  },
  image: {
    type:String,
    max:50
  },
});
export default mongoose.model("user", userSchema);
