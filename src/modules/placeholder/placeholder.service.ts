import PlaceholderModel from "./placeholder.model";
import { Placeholder } from "./placeholder.interface";
import { uploadImgToCloudinary, deleteImageFromCloudinary } from "../../util/uploadImgToCloudinary";
import { v2 as cloudinary } from 'cloudinary';


const createBulk = async (imgFiles: Express.Multer.File[]) => {
  // Upload all files to Cloudinary in parallel
  const uploadResults = await Promise.all(
    imgFiles.map((file) =>
      uploadImgToCloudinary(file.filename, file.path)
    )
  );

  // Transform results into DB-ready objects
  const placeholdersData = uploadResults.map((result) => {
    if (!result.secure_url) {
      throw new Error("One or more image uploads failed.");
    }
    return {
      link: result.secure_url,
      public_id: result.public_id,
    };
  });

  // Insert all placeholders into DB
  const placeholders = await PlaceholderModel.insertMany(placeholdersData);

  console.log("Created placeholders:", placeholders);
  return placeholders;
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
  createBulk,
  getAll,
  getById,
  Delete,
};

export default placeholderService;
