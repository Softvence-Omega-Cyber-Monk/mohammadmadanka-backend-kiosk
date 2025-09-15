import CategoryModel from "./category.model";
import { Category } from "./category.interface";
import {
  deleteImageFromCloudinary,
  uploadImgToCloudinary,
} from "../../util/uploadImgToCloudinary";
import { UserModel } from "../user/user.model";
import { ShopinventoryModal } from "../shopinventory/shopinventory.model";

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
  const categorys = await CategoryModel.find({ isDeleted: false }).populate(
    "occasions"
  );
  return categorys;
};

const getAllname = async () => {
  const categoryName = await CategoryModel.find(
    { isDeleted: false },
    { name: 1, type: 1 }
  ).populate("occasions", "name");
  return categoryName;
};

const getAllOccasion = async (Cid: string) => {
  const category = await CategoryModel.findOne({
    _id: Cid,
    isDeleted: false,
  }).populate("occasions");
  if (!category) {
    throw new Error("Category not found");
  }
  return category.occasions;
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

  // 1️⃣ Delete image from Cloudinary
  const result = await deleteImageFromCloudinary(category.public_id);
  if (!result) {
    throw new Error("Image deletion from Cloudinary failed.");
  }

  // 2️⃣ Soft delete the category
  const updatedCategory = await CategoryModel.findByIdAndDelete(
    id,
    { isDeleted: true },
 
  );

  if (!updatedCategory) {
    throw new Error("Category soft delete failed.");
  }

  // 3️⃣ Remove category from all users
  await UserModel.updateMany({ categories: id }, { $pull: { categories: id } });

  // 4️⃣ Delete inventory entries linked to this category
  await ShopinventoryModal.deleteMany({ category: id });

  return updatedCategory;
};

const categoryService = {
  create,
  getAll,
  getById,
  update,
  softDelete,
  getAllname,
  getAllOccasion,
};

export default categoryService;
