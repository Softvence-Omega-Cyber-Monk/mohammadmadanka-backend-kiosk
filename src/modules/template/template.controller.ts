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
  try {
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
  } catch (err) {
    console.error("Error uploading template image:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error uploading template image",
      data: null,
    });
  }
});

const create = catchAsync(async (req: Request, res: Response) => {
  try {
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
      ...(templateUrl ? { link: templateUrl } : {}),
      previewLink: previewUrls,
      ...(productUrl ? { productlink: productUrl } : {}),
      ...restData,
    };

    console.log("From backend:   ", templateData);
    // 3. Save to DB
    const result = await TemplateService.create(templateData);

    // 4. Send response
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Template created successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error creating template:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error creating template",
      data: null,
    });
  }
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await TemplateService.getAll();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Templates retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching all templates:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error fetching templates",
      data: null,
    });
  }
});

const getById = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await TemplateService.getById(req.params.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Template retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.error(`Error fetching template with id ${req.params.id}:`, err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error fetching template",
      data: null,
    });
  }
});

const update = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await TemplateService.update(req.params.id, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Template updated successfully",
      data: result,
    });
  } catch (err) {
    console.error(`Error updating template with id ${req.params.id}:`, err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error updating template",
      data: null,
    });
  }
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await TemplateService.softDelete(req.params.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Template soft deleted successfully",
      data: result,
    });
  } catch (err) {
    console.error(`Error soft deleting template with id ${req.params.id}:`, err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error soft deleting template",
      data: null,
    });
  }
});

const getByAdmin = catchAsync(async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    console.error("Error fetching templates by admin:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error fetching templates by admin",
      data: null,
    });
  }
});

const filterTemplates = catchAsync(async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    console.error("Error filtering templates:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error filtering templates",
      data: null,
    });
  }
});

const getTags = catchAsync(async (req: Request, res: Response) => {
  try {
    const categoryId = req.query.categoryID as string;

    const result = await TemplateService.getTags(categoryId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Templates retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching tags:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error fetching tags",
      data: null,
    });
  }
});

export const deleteLocalImage = catchAsync(async (req: Request, res: Response) => {
  try {
    const filePath = req.params.filePath;

    await deleteFile(filePath);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Local image deleted successfully",
      data: { path: filePath },
    });
  } catch (err) {
    console.error("Error deleting local image:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error deleting local image",
      data: null,
    });
  }
});

export const bulkUpdateTemplates = catchAsync(async (req: Request, res: Response) => {
  try {
    const { ids, amount } = req.body;

    if (!ids?.length || !amount) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const result = await TemplateService.bulkUpdateTemplatesService(ids, amount);
    res.json({ success: true, result });
  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export const bulkUpdateTemplateTags = catchAsync(async (req: Request, res: Response) => {
  try {
    const { ids, action, tags } = req.body;

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
