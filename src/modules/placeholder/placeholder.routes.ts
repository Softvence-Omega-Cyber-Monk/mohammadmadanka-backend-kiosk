import { Router } from "express";
import placeholderController from "./placeholder.controller";
import { upload, uploadMultiple } from "../../util/uploadImgToCloudinary";

const placeholderRoutes = Router();

placeholderRoutes.post(
  "/upoload-placeholder",
  uploadMultiple,
  placeholderController.createBulk
);
placeholderRoutes.get("/getAll", placeholderController.getAll);
placeholderRoutes.get("/getSingle/:id", placeholderController.getById);
placeholderRoutes.delete("/delete/:id", placeholderController.Delete);

export default placeholderRoutes;
