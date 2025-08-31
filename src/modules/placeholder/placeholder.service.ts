import PlaceholderModel from "./placeholder.model";
import { Placeholder } from "./placeholder.interface";
import { uploadImgToCloudinary, deleteImageFromCloudinary } from "../../util/uploadImgToCloudinary";
import { v2 as cloudinary } from 'cloudinary';


const create = async (imgFile: Express.Multer.File) => {
  const result = await uploadImgToCloudinary(imgFile.filename, imgFile.path);

  console.log(result);

  if (!result.secure_url) {
    throw new Error("Image upload failed.");
  }

  const placeholder = await PlaceholderModel.create({
    link: result.secure_url,
    public_id: result.public_id,
  });
  return placeholder;
};

const getAll = async () => {
  const placeholders = await PlaceholderModel.find({ isDeleted: false });
  return placeholders;
};

const getById = async (id: string) => {
  const placeholder = await PlaceholderModel.findOne({
    _id: id,
    isDeleted: false,
  });
  return placeholder;
};



const Delete = async (id: string, publicId: string) => {

  const result =await deleteImageFromCloudinary(publicId);

  if (!result) {
    throw new Error("Image deletion from Cloudinary failed.");
  }
 
  const result1 = await PlaceholderModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result1;
};

const placeholderService = {
  create,
  getAll,
  getById,
  Delete,
};

export default placeholderService;
