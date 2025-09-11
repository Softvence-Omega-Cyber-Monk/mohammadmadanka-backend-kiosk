import PrintHistoryerModel from "./printHistory.model";
import { PrintHistoryer } from "./printHistory.interface";
import { uploadImgToCloudinary, deleteImageFromCloudinary } from "../../util/uploadImgToCloudinary";
import { v2 as cloudinary } from 'cloudinary';


const create = async (imgFile: Express.Multer.File, userId: string) => {
  const result = await uploadImgToCloudinary(imgFile.filename, imgFile.path);

  console.log(result);

  if (!result.secure_url) {
    throw new Error("Image upload failed.");
  }

  const PrintHistoryer = await PrintHistoryerModel.create({
    shopId: userId,
    link: result.secure_url,
    public_id: result.public_id,
  });
  return PrintHistoryer;
};

const getAll = async (userId: string) => {
  const PrintHistoryers = await PrintHistoryerModel.find({userId, isDeleted: false });
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
