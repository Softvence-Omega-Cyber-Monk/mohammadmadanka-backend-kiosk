import { Request, Response } from "express";
import PrintHistoryService from "./printHistory.service";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";

const create = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId || req.query.userId;

  // Multer stores files under req.files when using .fields()
  const photo1 = (req.files as { [fieldname: string]: Express.Multer.File[] })?.photo1?.[0];
  const photo2 = (req.files as { [fieldname: string]: Express.Multer.File[] })?.photo2?.[0];

  if (!photo1) {
    throw new Error("photo1 is required.");
  }

  const { templateId, categoryId, type, quantity } = req.body;

  if (!templateId || !categoryId || !type || !quantity) {
    throw new Error("templateId, categoryId, type, and quantity are required.");
  }

  // Assuming you need to upload images and save other fields to PrintHistory
  const result = await PrintHistoryService.create(
    userId as string,
    photo1,
    photo2, // photo2 may be undefined → optional
    templateId,
    categoryId,
    type,
    quantity
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "PrintHistory created successfully",
    data: result,
  });
});
const updatePrintStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id || req.body.id;
  const result = await PrintHistoryService.updatePrintStatus(id); 
  if (!result) {
    throw new Error("PrintHistory not found.");
    }
  sendResponse(res, {
    statusCode: 200,
    success: true,  
    message: "Print status updated successfully",
    data: result,
  });
});


const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await PrintHistoryService.getAll();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "PrintHistory retrieved successfully",
    data: result,
  });
});

const getAllByShop = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId || req.query.userId;
  const result = await PrintHistoryService.getAllByShop(userId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "PrintHistory retrieved successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await PrintHistoryService.getById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "PrintHistory retrieved successfully",
    data: result,
  });
});

const Delete = catchAsync(async (req: Request, res: Response) => {

  const id = req.params.id || req.body.id;
  const publicId = req.body.public_id;
  console.log(publicId)
  const result = await PrintHistoryService.Delete(id, publicId);
  if (!result) {
    throw new Error("PrintHistory not found or already deleted.");
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "PrintHistory soft deleted successfully",
    data: result,
  });
});

const PrintHistoryController = {
  create,
  updatePrintStatus,
  getAll,
  getAllByShop,
  getById,
  Delete,
};

export default PrintHistoryController;
