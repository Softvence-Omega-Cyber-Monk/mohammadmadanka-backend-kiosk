// src/modules/printing/printing.route.ts

import { Router } from 'express';
import multer from 'multer';
import { printImage } from './printing.controller'; // Ensure correct import
import { ensureAuthenticated } from '../../middleware/epsonAuth'; // Ensure middleware is working

const EpsonRoute = Router();
const upload = multer({ dest: 'uploads/' });  // Handle file upload

// Use the ensureAuthenticated middleware to check if the user is authenticated
EpsonRoute.post('/print', ensureAuthenticated, upload.single('file'), printImage); // Correct callback function

export default EpsonRoute;
