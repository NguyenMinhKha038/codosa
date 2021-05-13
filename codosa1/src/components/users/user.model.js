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
  image: String,
});
export default mongoose.model("user", userSchema);
