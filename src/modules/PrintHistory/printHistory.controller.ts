import { Request, Response } from "express";
import PrintHistoryService from "./printHistory.service";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";

const create = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId || req.query.userId;
  const imgFile = req.file;

  if (!imgFile) {
    throw new Error("image file are required.");
  }

  const result = await PrintHistoryService.create(
    imgFile as Express.Multer.File, userId as string
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "PrintHistoryer created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId || req.query.userId;
  const result = await PrintHistoryService.getAll(userId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "PrintHistoryers retrieved successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await PrintHistoryService.getById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "PrintHistoryer retrieved successfully",
    data: result,
  });
});

const Delete = catchAsync(async (req: Request, res: Response) => {

  const id = req.params.id || req.body.id;
  const publicId = req.body.public_id;
  console.log(publicId)
  const result = await PrintHistoryService.Delete(id, publicId);
  if (!result) {
    throw new Error("PrintHistoryer not found or already deleted.");
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "PrintHistoryer soft deleted successfully",
    data: result,
  });
});

const PrintHistoryController = {
  create,
  getAll,
  getById,
  Delete,
};

export default PrintHistoryController;
