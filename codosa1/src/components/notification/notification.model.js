import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "order",
    require: true,
  }
 
},{timestamps:true});
export default mongoose.model("notification", notificationSchema);
