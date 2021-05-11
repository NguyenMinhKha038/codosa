import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type:String,
    require:true
  },
  image: Array,
  status:{
    type:Number,
    require:true
  }
});
module.exports = mongoose.model("category", categorySchema);
