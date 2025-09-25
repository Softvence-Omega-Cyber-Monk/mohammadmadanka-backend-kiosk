import { Request, Response } from 'express';
import OccasionService from './occasion.service';
import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import { uploadImgToCloudinary } from '../../util/uploadImgToCloudinary';

const create = catchAsync(async (req: Request, res: Response) => {
  try {
    const imgFile = req.file;

    if (!imgFile) {
      throw new Error("Image file is required.");
    }

    const result = await OccasionService.create(imgFile as Express.Multer.File, req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Occasion created successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error creating occasion:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error creating occasion",
      data: null,
    });
  }
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  try {
    const Cid = req.params.Cid;
    const result = await OccasionService.getAll(Cid);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Occasions retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching occasions:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error fetching occasions",
      data: null,
    });
  }
});

const getAllname = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await OccasionService.getAllname();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Occasions names retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching occasion names:", err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error fetching occasion names",
      data: null,
    });
  }
});

const getById = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await OccasionService.getById(req.params.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Occasion retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.error(`Error fetching occasion with id ${req.params.id}:`, err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: `Error fetching occasion with id ${req.params.id}`,
      data: null,
    });
  }
});

const update = catchAsync(async (req: Request, res: Response) => {
  try {
    console.log("Update data ", req.body);

    const { serialNumber, ...data } = req.body;
    
    const numberSerialNumber = serialNumber ? Number(serialNumber) : undefined;

    // Prepare the payload
    const payload = {
      ...data,
      ...(numberSerialNumber !== undefined && {
        serialNumber: numberSerialNumber,
      }),
    };

    // If there's a file, upload it to Cloudinary and add it to the payload
    if (req.file) {
      const imgFile = req.file;
      const result = await uploadImgToCloudinary(imgFile.filename, imgFile.path);
      
      if (!result.secure_url) {
        throw new Error("Image upload failed.");
      }

      payload.iconUrl = result.secure_url; // Set the new iconUrl
      payload.public_id = result.public_id; // Optionally store the public_id if needed for later deletion
    }

    // Update the occasion in the database
    const result = await OccasionService.update(req.params.id, payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Occasion updated successfully",
      data: result,
    });
  } catch (err) {
    console.error(`Error updating occasion with id ${req.params.id}:`, err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: `Error updating occasion with id ${req.params.id}`,
      data: null,
    });
  }
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  try {
    const id = req.params.id || req.body.id;
    const result = await OccasionService.softDelete(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Occasion soft deleted successfully",
      data: result,
    });
  } catch (err) {
    console.error(`Error soft deleting occasion with id ${req.params.id}:`, err);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: `Error soft deleting occasion with id ${req.params.id}`,
      data: null,
    });
  }
});

const occasionController = {
  create,
  getAll,
  getById,
  update,
  softDelete,
  getAllname,
};

export default occasionController;
