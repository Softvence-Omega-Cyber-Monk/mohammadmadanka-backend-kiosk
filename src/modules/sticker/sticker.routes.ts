import { Router } from "express";
import stickerController from "./sticker.controller";
import { upload, uploadMultiple } from "../../util/uploadImgToCloudinary";

const stickerRoutes = Router();

// stickerRoutes.post(
//   "/upoload-sticker",
//   upload.single("file"),
//   stickerController.create
// );
stickerRoutes.post("/bulk-upload", uploadMultiple,stickerController.createBulk);
stickerRoutes.get("/getAll", stickerController.getAll);
stickerRoutes.get("/getSingle/:id", stickerController.getById);
stickerRoutes.delete("/delete/:id", stickerController.Delete);

export default stickerRoutes;
