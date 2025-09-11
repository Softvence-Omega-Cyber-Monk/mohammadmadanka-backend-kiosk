import { Router } from "express";
import printHistoryController from "./printHistory.controller";
import { upload } from "../../util/uploadImgToCloudinary";

const printHistoryRoutes = Router();

printHistoryRoutes.post(
  "/upoload-printHistory",
  upload.single("file"),
  printHistoryController.create
);
printHistoryRoutes.get("/getAll", printHistoryController.getAll);
printHistoryRoutes.get("/getSingle/:id", printHistoryController.getById);
printHistoryRoutes.delete("/delete/:id", printHistoryController.Delete);

export default printHistoryRoutes;
