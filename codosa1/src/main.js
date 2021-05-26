import dotenv from "dotenv";
dotenv.config();
import express from "express";
import swaggerUi from "swagger-ui-express";
import database from "./config/connectDb";
import router from "./components/router";
import swaggerDocument from "../swagger/swagger.json";
database();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api",router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use((req, res, next) => {
  const error = new Error("Not found");
  error.httpCode = 404;
  next(error);
});

app.use((error, req, res, next) => {
  if (error.details) {
    error.details.body.forEach((element) => {
      error.message = element.message;
    });
    return res.status(error.statusCode || 500).json({
      error: {
        status: error.statusCode || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }
  return res.status(error.httpCode || 500).json({
    error: {
      status: error.httpCode || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;
