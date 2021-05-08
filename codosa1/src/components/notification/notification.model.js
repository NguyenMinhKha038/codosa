import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  title: {
      type:String,
      require:true
  },
  content: {
      type:Array,
      require:true
  },
  Date:{
      type: Date,
      require:true
  }
});
module.exports = mongoose.model("notification", notificationSchema);