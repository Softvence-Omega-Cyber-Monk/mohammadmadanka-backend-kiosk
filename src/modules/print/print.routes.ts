// src/modules/printing/printing.routes.ts

import { Router } from 'express';
import { createPrintJob } from './print.controller';
import { ensureAuthenticated } from '../../middleware/epsonAuth';

const PrintRouter = Router();

// Route to create a print job
PrintRouter.post('/print',ensureAuthenticated, createPrintJob);

export default PrintRouter;
