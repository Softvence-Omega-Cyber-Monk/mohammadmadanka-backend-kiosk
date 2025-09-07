// src/modules/printing/printing.route.ts

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { printImage } from './printing.controller'; // Ensure correct import
import { ensureAuthenticated } from '../../middleware/epsonAuth'; // Ensure middleware is working

// Extend express-session types to include deviceToken
declare module 'express-session' {
  interface SessionData {
    deviceToken?: string;
  }
}

const EpsonRoute = Router();
const upload = multer({ dest: 'uploads/' });  // Handle file upload

// Use the ensureAuthenticated middleware to check if the user is authenticated

EpsonRoute.get("/check-auth", (req: Request, res: Response): void => {
  if (req.session?.deviceToken) {
    res.json({ isAuthenticated: true });
    return;
  }
  res.json({ isAuthenticated: false });
});
// EpsonRoute.post('/print', ensureAuthenticated, upload.single('file'), printImage); // Correct callback function
EpsonRoute.post('/epson/print', upload.single('file'), printImage); // Correct callback function


export default EpsonRoute;

