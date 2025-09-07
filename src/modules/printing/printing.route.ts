// src/modules/printing/printing.route.ts

import { Router } from 'express';
import multer from 'multer';
import { printDocument } from './printing.controller'; // Ensure correct import


const EpsonRoute = Router();

const upload = multer({ dest: "uploads/" }); // files stored in uploads folder



EpsonRoute.post("/print", upload.single("file"), printDocument);


export default EpsonRoute;

