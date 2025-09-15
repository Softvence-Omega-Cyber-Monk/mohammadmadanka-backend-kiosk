import { Request, Response } from "express";
import CategoryService from "./category.service";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";

const create = catchAsync(async (req: Request, res: Response) => {
  const imgFile = req.file;
  console.log(imgFile)
  console.log(req.body)

  if (!imgFile) {
    throw new Error("image file are required.");
  }
  const result = await CategoryService.create(imgFile as Express.Multer.File,req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAll();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Categorys retrieved successfully",
    data: result,
  });
});

const getAllname = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllname();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Categorys retrieved successfully",
    data: result,
  });
});

const getAllOccasion = catchAsync(async (req: Request, res: Response) => {
  const Cid = req.params.Cid || req.body.Cid || "";
  const result = await CategoryService.getAllOccasion(Cid);
  sendResponse(res, {
    statusCode: 200, 
    success: true,
    message: "Occasions retrieved successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category retrieved successfully",
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {

  console.log('update data ',req.body)
  const result = await CategoryService.update(req.params.id, req.body);


  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id || req.body.id;
const result = await CategoryService.softDelete(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category soft deleted successfully",
    data: result,
  });
});

const categoryController = {
  create,
  getAll,
  getById,
  update,
  softDelete,
  getAllname,
  getAllOccasion,
};

export default categoryController;
