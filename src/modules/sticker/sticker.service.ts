import stickerModel from "./sticker.model";
import { sticker } from "./sticker.interface";
import { uploadImgToCloudinary, deleteImageFromCloudinary } from "../../util/uploadImgToCloudinary";
import { v2 as cloudinary } from 'cloudinary';


const create = async (imgFile: Express.Multer.File) => {
  console.log('paylojad data ',imgFile)
  const result = await uploadImgToCloudinary(imgFile.filename, imgFile.path);



  if (!result.secure_url) {
    throw new Error("Image upload failed.");
  }


  const sticker = await stickerModel.create({
    link: result.secure_url,
    public_id: result.public_id,
  });
  console.log('created data ',sticker)
  return sticker;
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
  create,
  getAll,
  getById,
  Delete,
};

export default stickerService;
