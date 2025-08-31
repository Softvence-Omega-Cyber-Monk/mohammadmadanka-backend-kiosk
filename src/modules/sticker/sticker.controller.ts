import { Request, Response } from "express";
import stickerService from "./sticker.service";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";

const create = catchAsync(async (req: Request, res: Response) => {
  const imgFile = req.file;

  if (!imgFile) {
    throw new Error("image file are required.");
  }

  const result = await stickerService.create(
    imgFile as Express.Multer.File
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "sticker created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await stickerService.getAll();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "stickers retrieved successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await stickerService.getById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "sticker retrieved successfully",
    data: result,
  });
});

const Delete = catchAsync(async (req: Request, res: Response) => {

  const id = req.params.id || req.body.id;
  const publicId = req.body.public_id;
  console.log(publicId)
  const result = await stickerService.Delete(id, publicId);
  if (!result) {
    throw new Error("sticker not found or already deleted.");
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "sticker soft deleted successfully",
    data: result,
  });
});

const stickerController = {
  create,
  getAll,
  getById,
  Delete,
};

export default stickerController;
