import mongoose from "mongoose";
const URI =process.env.DATACONNECTION
  //"mongodb+srv://Tieuholy381998:Tieuholy381998@cluster0.s3fyo.mongodb.net/dbname?retryWrites=true&w=majority";
  //"mongodb://localhost:27017/webstore"
const connectDB = async () => {
  try {
     await mongoose.connect(URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
    })
    console.log("connected...");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
