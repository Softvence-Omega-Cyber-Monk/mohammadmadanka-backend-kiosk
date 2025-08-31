// src/modules/printing/printing.controller.ts

import { Request, Response } from 'express';

import { PrintingService } from './print.service';
import sendResponse from '../../util/sendResponse';
import catchAsync from '../../util/catchAsync';

// Create a print job using the device token
const createPrintJob = catchAsync(async (req: Request, res: Response) => {
  const userToken = (req as any).user.deviceToken; // The device token is now attached to the request object from the middleware
  const { filePath, jobName } = req.body; // Get file path and job name from request body

  const printJob = await PrintingService.createPrintJob(userToken, filePath, jobName);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Print job created successfully',
    data: printJob,
  });
});

export { createPrintJob };
