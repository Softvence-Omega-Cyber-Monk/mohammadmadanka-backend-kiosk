import { Request, Response } from "express";
import PlaceholderService from "./placeholder.service";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";

const create = catchAsync(async (req: Request, res: Response) => {
  const imgFile = req.file;

  if (!imgFile) {
    throw new Error("image file are required.");
  }

  const result = await PlaceholderService.create(
    imgFile as Express.Multer.File
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Placeholder created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await PlaceholderService.getAll();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Placeholders retrieved successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await PlaceholderService.getById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Placeholder retrieved successfully",
    data: result,
  });
});

const Delete = catchAsync(async (req: Request, res: Response) => {

  const id = req.params.id || req.body.id;
  const publicId = req.body.public_id;
  console.log(publicId)
  const result = await PlaceholderService.Delete(id, publicId);
  if (!result) {
    throw new Error("Placeholder not found or already deleted.");
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Placeholder soft deleted successfully",
    data: result,
  });
});

const placeholderController = {
  create,
  getAll,
  getById,
  Delete,
};

export default placeholderController;
