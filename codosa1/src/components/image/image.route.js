import { express, Router } from "express";
import auth from "../utils/auth";
import imageController from "./image.controller";
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const imageRouter = Router();
imageRouter.post("/avatar", upload.single("image"), imageController.addAvatar);
imageRouter.post(
  "/product",
  auth.passport,
  auth.isStaff,
  upload.array("imgArray", 10),
  imageController.addProductImage
);

export default imageRouter;
