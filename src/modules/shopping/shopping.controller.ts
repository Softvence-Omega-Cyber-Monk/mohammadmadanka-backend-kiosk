import { Request, Response } from "express";
import ShoppingService from "./shopping.service";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { uploadMultipleImages } from "../../util/uploadImgToCloudinary";

const create = catchAsync(async (req: Request, res: Response) => {

  const { name, price, template_id } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const paths: string[] = [];

  // Always require cardImage
  if (files.cardImgURL && files.cardImgURL[0]) {
    paths.push(files.cardImgURL[0].path);
  }

  // Optional msgImage
  if (files.msgImgURL && files.msgImgURL[0]) {
    paths.push(files.msgImgURL[0].path);
  }

  // Upload to Cloudinary
  const [cardUrl, msgUrl] = await uploadMultipleImages(paths);

  // Save in DB via service
  const shopping = await ShoppingService.create({
    name,
    template_id,
    price,
    cardImgURL: cardUrl,
    msgImgURL: msgUrl || null, // null if not provided
  } as any);

  return res.status(201).json({
    success: true,
    message: "Shopping item created successfully",
    data: shopping,
  });
});




const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await ShoppingService.getAll();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Shoppings retrieved successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await ShoppingService.getById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Shopping retrieved successfully",
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const result = await ShoppingService.update(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Shopping updated successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const result = await ShoppingService.softDelete(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Shopping soft deleted successfully",
    data: result,
  });
});

const shoppingController = {
  create,
  getAll,
  getById,
  update,
  softDelete,
};

export default shoppingController;
