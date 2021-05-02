import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  image: Array,
});
module.exports = mongoose.model("category", categorySchema);
