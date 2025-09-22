import { Request, Response } from "express";
import CategoryService from "./category.service";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";

const create = catchAsync(async (req: Request, res: Response) => {
  try {
    const imgFile = req.file;
    console.log(imgFile);
    console.log(req.body);

    if (!imgFile) {
      throw new Error("Image file is required.");
    }
    const result = await CategoryService.create(imgFile as Express.Multer.File, req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error creating category:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error creating category",
      data: null,
    });
  }
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.getAll();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Categories retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error fetching categories",
      data: null,
    });
  }
});

const getAllname = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.getAllname();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Categories retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching category names:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error fetching category names",
      data: null,
    });
  }
});

const getAllOccasion = catchAsync(async (req: Request, res: Response) => {
  try {
    const Cid = req.params.Cid || req.body.Cid || "";
    const result = await CategoryService.getAllOccasion(Cid);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Occasions retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching occasions for category:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error fetching occasions for category",
      data: null,
    });
  }
});

const getById = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.getById(req.params.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.error(`Error fetching category with id ${req.params.id}:`, err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: `Error fetching category with id ${req.params.id}`,
      data: null,
    });
  }
});

const update = catchAsync(async (req: Request, res: Response) => {
  try {
    console.log("Update data ", req.body);

    const { serialNumber, ...data } = req.body;

    const numberSerialNumber = serialNumber ? Number(serialNumber) : undefined;

    const payload = {
      ...data,
      ...(numberSerialNumber !== undefined && {
        serialNumber: numberSerialNumber,
      }),
    };

    const result = await CategoryService.update(req.params.id, payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  } catch (err) {
    console.error(`Error updating category with id ${req.params.id}:`, err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: `Error updating category with id ${req.params.id}`,
      data: null,
    });
  }
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  try {
    const id = req.params.id || req.body.id;
    const result = await CategoryService.softDelete(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category soft deleted successfully",
      data: result,
    });
  } catch (err) {
    console.error(`Error soft deleting category with id ${req.params.id}:`, err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: `Error soft deleting category with id ${req.params.id}`,
      data: null,
    });
  }
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
