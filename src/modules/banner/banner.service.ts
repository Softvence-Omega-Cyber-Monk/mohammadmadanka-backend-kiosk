import bannerModel from "./banner.model";
import { banner } from "./banner.interface";
import { uploadImgToCloudinary, deleteImageFromCloudinary } from "../../util/uploadImgToCloudinary";
import { v2 as cloudinary } from 'cloudinary';


const create = async (imgFile: Express.Multer.File) => {
  const result = await uploadImgToCloudinary(imgFile.filename, imgFile.path);



  if (!result.secure_url) {
    throw new Error("Image upload failed.");
  }

  const banner = await bannerModel.create({
    link: result.secure_url,
    public_id: result.public_id,
  });
  return banner;
};

const getAll = async () => {
  const banners = await bannerModel.find({ isDeleted: false });
  return banners;
};

const getById = async (id: string) => {
  const banner = await bannerModel.findOne({
    _id: id,
    isDeleted: false,
  });
  return banner;
};



const Delete = async (id: string, publicId: string) => {

  const result =await deleteImageFromCloudinary(publicId);

  if (!result) {
    throw new Error("Image deletion from Cloudinary failed.");
  }
 
  const result1 = await bannerModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result1;
};

const bannerService = {
  create,
  getAll,
  getById,
  Delete,
};

export default bannerService;
