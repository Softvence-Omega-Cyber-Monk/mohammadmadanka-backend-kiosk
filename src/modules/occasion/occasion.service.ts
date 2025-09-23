import OccasionModel from "./occasion.model";
import { Occasion } from "./occasion.interface";
import {
  deleteImageFromCloudinary,
  uploadImgToCloudinary,
} from "../../util/uploadImgToCloudinary";

const create = async (imgFile: Express.Multer.File, data: Occasion) => {
  try {
    const result = await uploadImgToCloudinary(imgFile.filename, imgFile.path);

    console.log(result);

    if (!result.secure_url) {
      throw new Error("Image upload failed.");
    }

    const occasion = await OccasionModel.create({
      ...data,
      iconUrl: result.secure_url, // attach cloudinary URL
      public_id: result.public_id,
    });

    return occasion;
  } catch (err) {
    console.error("Error creating occasion:", err);
    throw new Error("Error creating occasion");
  }
};

const getAll = async (Cid: string) => {
  try {
    const occasion = await OccasionModel.find({ isDeleted: false });
    return occasion;
  } catch (err) {
    console.error("Error fetching all occasions:", err);
    throw new Error("Error fetching all occasions");
  }
};

const getAllname = async () => {
  try {
    const categoryName = await OccasionModel.find(
      { isDeleted: false },
      { name: 1 }
    );
    return categoryName;
  } catch (err) {
    console.error("Error fetching occasion names:", err);
    throw new Error("Error fetching occasion names");
  }
};

const getById = async (id: string) => {
  try {
    const category = await OccasionModel.findOne({ _id: id, isDeleted: false });
    if (!category) {
      throw new Error("Occasion not found");
    }
    return category;
  } catch (err) {
    console.error(`Error fetching occasion with id ${id}:`, err);
    throw new Error(`Error fetching occasion with id ${id}`);
  }
};

const update = async (id: string, data: Partial<Occasion>) => {
  try {
    const category = await OccasionModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true }
    );
    if (!category) {
      throw new Error("Occasion not found for update");
    }
    return category;
  } catch (err) {
    console.error(`Error updating occasion with id ${id}:`, err);
    throw new Error(`Error updating occasion with id ${id}`);
  }
};

const softDelete = async (id: string) => {
  try {
    const category = await OccasionModel.findById(id);
    if (!category) {
      throw new Error("Occasion not found");
    }

    // Delete image from Cloudinary
    const result = await deleteImageFromCloudinary(category.public_id);
    if (!result) {
      throw new Error("Image deletion from Cloudinary failed.");
    }

    // Soft delete the occasion
    const result1 = await OccasionModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!result1) {
      throw new Error("Soft delete failed");
    }

    return result1;
  } catch (err) {
    console.error(`Error soft deleting occasion with id ${id}:`, err);
    throw new Error(`Error soft deleting occasion with id ${id}`);
  }
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
