import { Router } from "express";
import bannerController from "./banner.controller";
import { upload } from "../../util/uploadImgToCloudinary";

const bannerRoutes = Router();

bannerRoutes.post(
  "/upoload-banner",
  upload.single("file"),
  bannerController.create
);
bannerRoutes.get("/getAll", bannerController.getAll);
bannerRoutes.get("/getSingle/:id", bannerController.getById);
bannerRoutes.delete("/delete/:id", bannerController.Delete);

export default bannerRoutes;
