import { Request, Response } from "express";
import TemplateService from "./template.service";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";

import {
  deleteFile,
  uploadImgToCloudinary,
  uploadMultipleImages,
} from "../../util/uploadImgToCloudinary";

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
  const {
    localImagePath,
    localpreviewLink,
    localProductPath,
    name,
    ...restData
  } = req.body;

  console.log(req.body);

  const [templateUrl, previewUrl] = await uploadMultipleImages([
    localImagePath,
    localpreviewLink,
  ]);

  let productUrl: string | undefined;
  if (localProductPath) {
    // upload only if provided
    [productUrl] = await uploadMultipleImages([localProductPath]);
  }

  // Prepare full data for DB
  const templateData = {
    name,
    link: templateUrl,
    previewLink: previewUrl,
    ...(productUrl ? { productlink: productUrl } : {}), // add only if exists
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
  const { category, occasion, tags } = req.query;

  const result = await TemplateService.filterTemplates({
    category: category as string,
    occasion: occasion as string,
    tags : tags ? (Array.isArray(tags) ? tags : [tags]) : undefined,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Templates filtered successfully",
    data: result,
  });
});

const getTags = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.query.categoryID as string;

  const result = await TemplateService.getTags(categoryId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Templates retrieved successfully",
    data: result,
  });
});

export const deleteLocalImage = catchAsync(
  async (req: Request, res: Response) => {
    // Example request: DELETE /api/v1/images/delete-local/uploads/abc.png
    const filePath = req.params.filePath;

    // ✅ ensure the path is always inside "uploads" folder
    //const safePath = path.join(process.cwd(), filePath);

    await deleteFile(filePath);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Local image deleted successfully",
      data: { path: filePath },
    });
  }
);

const templateController = {
  create,
  getAll,
  getById,
  update,
  softDelete,
  getByAdmin,
  filterTemplates,
  uploadTemplateImage,
  getTags,
};

export default templateController;
