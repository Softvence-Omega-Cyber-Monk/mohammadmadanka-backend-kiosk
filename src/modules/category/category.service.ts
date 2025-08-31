import CategoryModel from "./category.model";
import { Category } from "./category.interface";
import {
  deleteImageFromCloudinary,
  uploadImgToCloudinary,
} from "../../util/uploadImgToCloudinary";

const create = async (imgFile: Express.Multer.File, data: Category) => {
  const result = await uploadImgToCloudinary(imgFile.filename, imgFile.path);

  console.log(result);

  if (!result.secure_url) {
    throw new Error("Image upload failed.");
  }

  const category = await CategoryModel.create({
    ...data,
    iconUrl: result.secure_url, // attach cloudinary URL
    public_id: result.public_id,
  });
  return category;
};

const getAll = async () => {
  const categorys = await CategoryModel.find({ isDeleted: false });
  return categorys;
};

const getAllname = async () => {
  const categoryName = await CategoryModel.find(
    { isDeleted: false },
    { name: 1, type: 1 }
  );
  return categoryName;
};

const getById = async (id: string) => {
  const category = await CategoryModel.findOne({ _id: id, isDeleted: false });
  return category;
};

const update = async (id: string, data: Partial<Category>) => {
  const category = await CategoryModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    { new: true }
  );
  return category;
};
const softDelete = async (id: string) => {
  const category = await CategoryModel.findById(id);
  if (!category) {
    throw new Error("Category not found");
  }
  const result = await deleteImageFromCloudinary(category.public_id);

  if (!result) {
    throw new Error("Image deletion from Cloudinary failed.");
  }

  const result1 = await CategoryModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result1;
};

const categoryService = {
  create,
  getAll,
  getById,
  update,
  softDelete,
  getAllname,
};

export default categoryService;
