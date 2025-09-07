// src/modules/printing/printing.route.ts

import { Router, Request, Response } from "express";
import multer from "multer";
import { printDocument } from "./printing.controller"; // Ensure correct import

const EpsonRoute = Router();

EpsonRoute.get("/check-auth", (req: Request, res: Response): void => {
  if (req.session?.deviceToken) {
    res.json({ isAuthenticated: true });
    return;
  }
  res.json({ isAuthenticated: false });
});

const upload = multer({ dest: "uploads/" }); // files stored in uploads folder

EpsonRoute.post("/print", upload.single("file"), printDocument);

export default EpsonRoute;
