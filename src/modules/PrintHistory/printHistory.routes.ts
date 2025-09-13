import { Router } from "express";
import printHistoryController from "./printHistory.controller";
import { Multiupload, upload } from "../../util/uploadImgToCloudinary";

const printHistoryRoutes = Router();

printHistoryRoutes.post(
  "/upoload-printHistory/:userId",
  Multiupload, // ✅ use fields instead of single
  printHistoryController.create
);
printHistoryRoutes.get("/getAll/:userId", printHistoryController.getAll);
printHistoryRoutes.get("/getSingle/:id", printHistoryController.getById);
printHistoryRoutes.delete("/delete/:id", printHistoryController.Delete);

export default printHistoryRoutes;
