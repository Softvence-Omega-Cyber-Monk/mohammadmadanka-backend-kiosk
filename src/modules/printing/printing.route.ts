// src/modules/printing/printing.route.ts

import { Router, Request, Response } from "express";

import {
  checkAccessToken,
  printFrontImage,
  printGift,
  printInsideImage,
} from "./printing.controller"; // Ensure correct import

const EpsonRoute = Router();

EpsonRoute.get("/check-auth", (req: Request, res: Response): void => {

  res.json({ isAuthenticated: false });
});

// Route
EpsonRoute.post("/print-frontImage", printFrontImage);
EpsonRoute.post("/print-insideImage", printInsideImage);
EpsonRoute.post("/print-gift", printGift);

EpsonRoute.get("/check-token/:userId", checkAccessToken);

export default EpsonRoute;
