// src/modules/printing/printing.route.ts

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { printDocument } from './printing.controller'; // Ensure correct import


const EpsonRoute = Router();
// const upload = multer({ dest: 'uploads/' });  // Handle file upload

// // Use the ensureAuthenticated middleware to check if the user is authenticated

// EpsonRoute.get("/check-auth", (req: Request, res: Response): void => {
//   if (req.session?.deviceToken) {
//     res.json({ isAuthenticated: true });
//     return;
//   }
//   res.json({ isAuthenticated: false });
// });
// // EpsonRoute.post('/print', ensureAuthenticated, upload.single('file'), printImage); // Correct callback function
// EpsonRoute.post('/epson/print', ensureAuthenticated, upload.single('file'), printImage); // Correct callback function




const upload = multer({ dest: "uploads/" }); // files stored in uploads folder



EpsonRoute.post("/print", upload.single("file"), printDocument);


export default EpsonRoute;

