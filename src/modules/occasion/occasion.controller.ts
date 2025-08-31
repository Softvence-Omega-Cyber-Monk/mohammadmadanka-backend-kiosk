import { Request, Response } from 'express';
    import OccasionService from './occasion.service';
    import catchAsync from '../../util/catchAsync';
    import sendResponse from '../../util/sendResponse';

const create = catchAsync(async (req: Request, res: Response) => {
  const imgFile = req.file;

  if (!imgFile) {
    throw new Error("image file are required.");
  }
  const result = await OccasionService.create(imgFile as Express.Multer.File, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await OccasionService.getAll();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Categorys retrieved successfully",
    data: result,
  });
});

const getAllname = catchAsync(async (req: Request, res: Response) => {
  const result = await OccasionService.getAllname();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Categorys retrieved successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await OccasionService.getById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category retrieved successfully",
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const result = await OccasionService.update(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id || req.body.id;
const result = await OccasionService.softDelete(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category soft deleted successfully",
    data: result,
  });
});

    const occasionController = {
      create,
      getAll,
      getById,
      update,
      softDelete,
      getAllname,
    };

    export default occasionController;
