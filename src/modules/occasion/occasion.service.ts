import OccasionModel from "./occasion.model";
import { Occasion } from "./occasion.interface";
import {
  deleteImageFromCloudinary,
  uploadImgToCloudinary,
} from "../../util/uploadImgToCloudinary";

const create = async (imgFile: Express.Multer.File, data: Occasion) => {
  const result = await uploadImgToCloudinary(imgFile.filename, imgFile.path);

  console.log(result);

  if (!result.secure_url) {
    throw new Error("Image upload failed.");
  }

  const category = await OccasionModel.create({
    ...data,
    iconUrl: result.secure_url, // attach cloudinary URL
    public_id: result.public_id,
  });
  return category;
};

const getAll = async (Cid :string ) => {
  const occa = await OccasionModel.find({ isDeleted: false });
  return categorys;
};

const getAllname = async () => {
  const categoryName = await OccasionModel.find(
    { isDeleted: false },
    { name: 1 }
  );
  return categoryName;
};

const getById = async (id: string) => {
  const category = await OccasionModel.findOne({ _id: id, isDeleted: false });
  return category;
};

const update = async (id: string, data: Partial<Occasion>) => {
  const category = await OccasionModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    { new: true }
  );
  return category;
};
const softDelete = async (id: string) => {
  const category = await OccasionModel.findById(id);
  if (!category) {
    throw new Error("Category not found");
  }
  const result = await deleteImageFromCloudinary(category.public_id);

  if (!result) {
    throw new Error("Image deletion from Cloudinary failed.");
  }

  const result1 = await OccasionModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result1;
};

const occasionService = {
  create,
  getAll,
  getById,
  update,
  softDelete,
  getAllname,
};

export default occasionService;
