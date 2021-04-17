import expess from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoute from "../src/components/users/user.route";
import databse from "./config/connectdb";
import http from "http";
databse();
dotenv.config();
const app = expess();
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.server = http.createServer(app);
app.use("/user", userRoute);

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Server is running .`);
});
export default app;
