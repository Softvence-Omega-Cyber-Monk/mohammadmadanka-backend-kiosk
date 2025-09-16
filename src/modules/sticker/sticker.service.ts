import stickerModel from "./sticker.model";
import { sticker } from "./sticker.interface";
import { uploadImgToCloudinary, deleteImageFromCloudinary } from "../../util/uploadImgToCloudinary";
import { v2 as cloudinary } from 'cloudinary';


const createBulk = async (imgFiles: Express.Multer.File[]) => {
  // Extract local file paths
  const filePaths = imgFiles.map((file) => file.path);

  // Upload to Cloudinary (parallel for speed)
  const uploadResults = await Promise.all(
    imgFiles.map((file) =>
      uploadImgToCloudinary(file.filename, file.path)
    )
  );

  // Verify and create DB entries
  const stickersData = uploadResults.map((result) => {
    if (!result.secure_url) {
      throw new Error("One or more image uploads failed.");
    }
    return {
      link: result.secure_url,
      public_id: result.public_id,
    };
  });

  // Insert all at once
  const stickers = await stickerModel.insertMany(stickersData);

  console.log("Created stickers:", stickers);
  return stickers;
};




const getAll = async () => {
  const stickers = await stickerModel.find({ isDeleted: false });
  return stickers;
};

const getById = async (id: string) => {
  const sticker = await stickerModel.findOne({
    _id: id,
    isDeleted: false,
  });
  return sticker;
};



const Delete = async (id: string, publicId: string) => {

  const result =await deleteImageFromCloudinary(publicId);

  if (!result) {
    throw new Error("Image deletion from Cloudinary failed.");
  }
 
  const result1 = await stickerModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result1;
};

const stickerService = {
  getAll,
  getById,
  Delete,
  createBulk,
};

export default stickerService;
