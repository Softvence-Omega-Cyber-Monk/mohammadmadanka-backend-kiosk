import { Request, Response } from "express";
import TemplateService from "./template.service";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";

import { uploadImgToCloudinary } from '../../util/uploadImgToCloudinary';

const uploadTemplateImage = catchAsync(async (req: Request, res: Response) => {
  const imgFile = req.file;
  if (!imgFile) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Image file is required",
      data: null,
    });
  }

  const localPath = imgFile.path;

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Image uploaded locally",
    data: {
      localPath, // frontend will use this to preview and submit later
    },
  });
});



const create = catchAsync(async (req: Request, res: Response) => {
  const { localImagePath, localpreviewLink, name, ...restData } = req.body;

  // if (!localImagePath || !name || !localpreviewLink) {
  //   throw new Error("Template name and localImagePath are required");
  // }

  // 1. Upload to Cloudinary using your utility


  const template = await uploadImgToCloudinary(name, localImagePath);
  const preview = await uploadImgToCloudinary("hello", localpreviewLink);
  // 2. Prepare full data for DB
  const templateData = {
    name,
    link: template.secure_url, // ✅ Store Cloudinary link
    previewLink:  preview.secure_url,
    ...restData,
  };

  // 3. Save to DB
  const result = await TemplateService.create(templateData);

  // 4. Send response
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Template created successfully",
    data: result,
  });
});


const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await TemplateService.getAll();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Templates retrieved successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await TemplateService.getById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Template retrieved successfully",
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const result = await TemplateService.update(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Template updated successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const result = await TemplateService.softDelete(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Template soft deleted successfully",
    data: result,
  });
});

const getByAdmin = catchAsync(async (req: Request, res: Response) => {
  const user = req.user; // assumes auth middleware adds user
  if (!user) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized",
      data: null,
    });
  }

  const userId = user.id;

  const result = await TemplateService.getByCreatedBy(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Templates retrieved successfully by logged-in user",
    data: result,
  });
});

const filterTemplates = catchAsync(async (req: Request, res: Response) => {
  const { category, occasion } = req.query ;

  const result = await TemplateService.filterTemplates({
    category: category as string,
    occasion: occasion as string,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Templates filtered successfully",
    data: result,
  });
});

const templateController = {
  create,
  getAll,
  getById,
  update,
  softDelete,
  getByAdmin,
  filterTemplates,
  uploadTemplateImage
};

export default templateController;
