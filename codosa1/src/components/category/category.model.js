import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  image: Array,
  status:String
});
module.exports = mongoose.model("category", categorySchema);
