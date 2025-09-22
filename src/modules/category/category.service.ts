import CategoryModel from "./category.model";
import { Category } from "./category.interface";
import {
  deleteImageFromCloudinary,
  uploadImgToCloudinary,
} from "../../util/uploadImgToCloudinary";
import { UserModel } from "../user/user.model";
import { ShopinventoryModal } from "../shopinventory/shopinventory.model";

const create = async (imgFile: Express.Multer.File, data: Category) => {
  try {
    // 1️⃣ Upload image to Cloudinary
    const result = await uploadImgToCloudinary(imgFile.filename, imgFile.path);
    if (!result.secure_url) {
      throw new Error("Image upload failed.");
    }

    // 2️⃣ Check if category with same name exists and is not deleted
    const isExist = await CategoryModel.findOne({
      name: data.name,
      isDeleted: false,
    });
    if (isExist) {
      throw new Error("The category already exists");
    }

    // 3️⃣ Determine serialNumber automatically if not provided
    let serialNumber = data.serialNumber;
    if (!serialNumber) {
      const lastCategory = await CategoryModel.findOne({}).sort({
        serialNumber: -1,
      });
      serialNumber = lastCategory ? lastCategory.serialNumber + 1 : 1;
    }

    // 4️⃣ Create category
    const category = await CategoryModel.create({
      ...data,
      iconUrl: result.secure_url,
      public_id: result.public_id,
      serialNumber,
      occasions: data.occasions || [],
    });

    return category;
  } catch (err) {
    console.error("Error creating category:", err);
    throw new Error("Error creating category");
  }
};

const getAll = async () => {
  try {
    const categories = await CategoryModel.find({ isDeleted: false })
      .sort({ serialNumber: 1 })
      .populate("occasions");
    return categories;
  } catch (err) {
    console.error("Error fetching all categories:", err);
    throw new Error("Error fetching categories");
  }
};

const getAllname = async () => {
  try {
    const categoryNames = await CategoryModel.find(
      { isDeleted: false },
      { name: 1, type: 1 }
    ).populate("occasions", "name");
    return categoryNames;
  } catch (err) {
    console.error("Error fetching category names:", err);
    throw new Error("Error fetching category names");
  }
};

const getAllOccasion = async (Cid: string) => {
  try {
    const category = await CategoryModel.findOne({
      _id: Cid,
      isDeleted: false,
    }).populate("occasions");
    if (!category) {
      throw new Error("Category not found");
    }
    return category.occasions;
  } catch (err) {
    console.error("Error fetching category occasions:", err);
    throw new Error("Error fetching category occasions");
  }
};

const getById = async (id: string) => {
  try {
    const category = await CategoryModel.findOne({ _id: id, isDeleted: false });
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  } catch (err) {
    console.error(`Error fetching category with id ${id}:`, err);
    throw new Error(`Error fetching category with id ${id}`);
  }
};

const update = async (id: string, data: Partial<Category>) => {
  try {
    const category = await CategoryModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true }
    );
    if (!category) {
      throw new Error("Category not found for update");
    }
    return category;
  } catch (err) {
    console.error(`Error updating category with id ${id}:`, err);
    throw new Error(`Error updating category with id ${id}`);
  }
};

const softDelete = async (id: string) => {
  try {
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
    const updatedCategory = await CategoryModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });

    if (!updatedCategory) {
      throw new Error("Category soft delete failed.");
    }

    // 3️⃣ Remove category from all users
    await UserModel.updateMany({ categories: id }, { $pull: { categories: id } });

    // 4️⃣ Delete inventory entries linked to this category
    await ShopinventoryModal.deleteMany({ category: id });

    return updatedCategory;
  } catch (err) {
    console.error(`Error soft deleting category with id ${id}:`, err);
    throw new Error("Error soft deleting category");
  }
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
