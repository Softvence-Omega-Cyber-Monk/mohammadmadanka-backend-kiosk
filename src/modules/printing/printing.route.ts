// src/modules/printing/printing.route.ts

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { printDocument } from './printing.controller'; // Ensure correct import

// Extend express-session types to include deviceToken
declare module 'express-session' {
  interface SessionData {
    deviceToken?: string;
  }
}

const EpsonRoute = Router();

// const upload = multer({ dest: 'uploads/' });  // Handle file upload


EpsonRoute.post("/print", printDocument);


export default EpsonRoute;

