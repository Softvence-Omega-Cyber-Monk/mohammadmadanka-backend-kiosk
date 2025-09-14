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
    localpreviewLinks,
    localProductPath,
    name,
    ...restData
  } = req.body;

  console.log(req.body);

  const previewUrls = await uploadMultipleImages(localpreviewLinks);

  let templateUrl: string | undefined;
  if (localImagePath) {
    // delete only if provided
    [templateUrl] = await uploadMultipleImages([localImagePath]);
  }

  let productUrl: string | undefined;
  if (localProductPath) {
    // upload only if provided
    [productUrl] = await uploadMultipleImages([localProductPath]);
  }

  // Prepare full data for DB
  const templateData = {
    name,
    ...(templateUrl ? { link: templateUrl } : {}), // ✅ fixed
    previewLink: previewUrls,
    ...(productUrl ? { productlink : productUrl } : {}), // ✅ fixed key casing
    ...restData,
  };

  console.log("From backend:   ",templateData)
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
    data:result,
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
    tags: tags
      ? (Array.isArray(tags)
          ? (tags as (string)[]).map(String)
          : [String(tags)])
      : undefined,
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
});

export const bulkUpdateTemplates = catchAsync(async (req: Request, res: Response) => {
  try {
    const { ids, type, amount } = req.body;

    if (!ids?.length || !amount) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const result = await TemplateService.bulkUpdateTemplatesService(ids, type, amount);
    res.json({ success: true, result });
  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export const bulkUpdateTemplateTags = catchAsync(async (req: Request, res: Response) => {
  try {
    const { ids, action, tags } = req.body; 
    // action = "add" | "remove"
    // tags = ["newTag1", "newTag2"]

    if (!ids?.length || !tags?.length) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const result = await TemplateService.bulkUpdateTemplateTagsService(ids, action, tags);
    res.json({ success: true, result });
  } catch (error) {
    console.error("Bulk tag update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

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
  bulkUpdateTemplates,
  bulkUpdateTemplateTags,
};

export default templateController;
