import { Request, Response } from 'express';
    import PrintSettingService from './printSetting.service';
    import catchAsync from '../../util/catchAsync';
    import sendResponse from '../../util/sendResponse';

    const create = catchAsync(async (req: Request, res: Response) => {
      
       const imgFile = req.file;

    if (!imgFile) {
      throw new Error("Image file is required.");
    }

    const result = await PrintSettingService.create(imgFile as Express.Multer.File, req.body);
      sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'PrintSetting created successfully',
      data: result,
      });
    });

    

    const printSettingController = {
      create,
    };

    export default printSettingController;
