import mongoose from "mongoose";
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
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  status: {
    type: Number,
    require: true,
  },
  image: String,
});
export default mongoose.model("manager", managerSchema);
