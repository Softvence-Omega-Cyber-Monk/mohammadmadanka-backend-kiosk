import { Request, Response } from "express";
import bannerService from "./banner.service";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";

const create = catchAsync(async (req: Request, res: Response) => {
  const imgFile = req.file;

  const bannerTag  = req.query.bannerTag;

  if (!imgFile) {
    throw new Error("image file are required.");
  }

  const result = await bannerService.create(
    imgFile as Express.Multer.File,
    bannerTag as string
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "banner created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerService.getAll();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "banners retrieved successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerService.getById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "banner retrieved successfully",
    data: result,
  });
});

const Delete = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id || req.body.id;
  const publicId = req.body.public_id;
  console.log(publicId);
  const result = await bannerService.Delete(id, publicId);
  if (!result) {
    throw new Error("banner not found or already deleted.");
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "banner soft deleted successfully",
    data: result,
  });
});

const bannerController = {
  create,
  getAll,
  getById,
  Delete,
};

export default bannerController;
