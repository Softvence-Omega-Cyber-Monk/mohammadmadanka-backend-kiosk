import PrintHistoryerModel from "./printHistory.model";
import { PrintHistoryer } from "./printHistory.interface";
import { uploadImgToCloudinary, deleteImageFromCloudinary } from "../../util/uploadImgToCloudinary";
import { v2 as cloudinary } from 'cloudinary';


const create = async ( userId: string, photo1: Express.Multer.File,photo2: Express.Multer.File ) => {
   const result1 = await uploadImgToCloudinary(photo1.filename, photo1.path);

  if (!result1.secure_url) {
    throw new Error("Photo1 upload failed.");
  }

  // Initialize print history data
  const printHistoryData: any = {
    shopId: userId,
    Imglink: result1.secure_url,
    Imgpublic_id: result1.public_id,
  };

  // Upload photo2 if provided
  if (photo2) {
    const result2 = await uploadImgToCloudinary(photo2.filename, photo2.path);
    if (!result2.secure_url) {
      throw new Error("Photo2 upload failed.");
    }

    printHistoryData.insideImgLink = result2.secure_url;
    printHistoryData.insideImgPublic_id = result2.public_id;
  }

  // Save to DB
  const PrintHistoryer = await PrintHistoryerModel.create(printHistoryData);
  return PrintHistoryer;
};

const getAll = async (userId: string) => {
  const PrintHistoryers = await PrintHistoryerModel.find({ isDeleted: false });
  return PrintHistoryers;
};

const getById = async (id: string) => {
  const PrintHistoryer = await PrintHistoryerModel.findOne({
    _id: id,
    isDeleted: false,
  });
  return PrintHistoryer;
};



const Delete = async (id: string, publicId: string) => {

  const result =await deleteImageFromCloudinary(publicId);

  if (!result) {
    throw new Error("Image deletion from Cloudinary failed.");
  }
 
  const result1 = await PrintHistoryerModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result1;
};

const PrintHistoryerService = {
  create,
  getAll,
  getById,
  Delete,
};

export default PrintHistoryerService;
