// src/modules/printing/printing.route.ts

import { Router, Request, Response } from "express";

import { checkAccessToken, printDocument } from "./printing.controller"; // Ensure correct import

const EpsonRoute = Router();

EpsonRoute.get("/check-auth", (req: Request, res: Response): void => {
  // if (req.session?.deviceToken) {
  //   res.json({ isAuthenticated: true });
  //   return;
  // }
  res.json({ isAuthenticated: false });
});

// Route
EpsonRoute.post("/print", printDocument);

EpsonRoute.get("/check-token/:userId", checkAccessToken);
// EpsonRoute.post("/print-job", printJobController);


export default EpsonRoute;
