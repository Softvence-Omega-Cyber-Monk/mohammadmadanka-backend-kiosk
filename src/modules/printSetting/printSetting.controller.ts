import { Request, Response } from 'express';
import PrintSettingService from './printSetting.service';
import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';

/**
 * Create or replace the single brand image.
 */
const createOrReplace = catchAsync(async (req: Request, res: Response) => {
  const imgFile = req.file;
  if (!imgFile) {
    throw new Error('Image file is required.');
  }

  const result = await PrintSettingService.createOrReplace(
    imgFile as Express.Multer.File,
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Brand image created/replaced successfully',
    data: result,
  });
});

/**
 * Get the latest/only brand image.
 */
const getLatest = catchAsync(async (_req: Request, res: Response) => {
  const result = await PrintSettingService.getLatest();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Latest brand image retrieved successfully',
    data: result,
  });
});

const printSettingController = {
  createOrReplace,
  getLatest,
};

export default printSettingController;
