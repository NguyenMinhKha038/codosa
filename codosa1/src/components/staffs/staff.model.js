import mongoose from "mongoose";
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
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  image: String,
});
export default mongoose.model("staff", staffSchema);
