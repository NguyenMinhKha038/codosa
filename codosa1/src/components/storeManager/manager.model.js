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
  image: {
    type: String,
    max: 50,
  },
});
export default mongoose.model("manager", managerSchema);
