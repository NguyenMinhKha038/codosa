import dotenv from "dotenv";
dotenv.config();
import express from "express";
import swaggerUi from "swagger-ui-express";
import database from "./config/connectDb";
import router from "./components/router";
import swaggerDocument from "../swagger/swagger.json";
import logger from "./components/logger/createLogger";

database();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  return (
    res.status(404).json({
      error: {
        status: 404,
        message: "Page Not Found",
      },
    }),
    logger.error({ message: "Page Not Found" })
  );
});

app.use((error, req, res, next) => {
  if (error.details) {
    if (error.details.body) {
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
    if (error.details.params) {
      error.details.params.forEach((element) => {
        error.message = element.message;
      });
      return res.status(error.statusCode || 500).json({
        error: {
          status: error.statusCode || 500,
          message: error.message || "Internal Server Error",
        },
      });
    }
    if (error.details.query) {
      error.details.query.forEach((element) => {
        error.message = element.message;
      });
      return res.status(error.statusCode || 500).json({
        error: {
          status: error.statusCode || 500,
          message: error.message || "Internal Server Error",
        },
      });
    }
  }
  return (
    res.status(error.httpCode || 500).json({
      error: {
        status: error.httpCode || 500,
        message: error.message || "Internal Server Error",
      },
    }),
    logger.error({ message: error.message })
  );
});
const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;
