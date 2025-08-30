// routes/printData.route.ts
import express from "express";
import { printDataController } from "./printData.controller";

const router = express.Router();

router.post("/create-printData", printDataController.createPrintData);
router.get("/get-all-printData", printDataController.getAllPrintData);

export const printDataRouter = router;
