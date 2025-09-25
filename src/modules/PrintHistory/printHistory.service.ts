import PrintHistoryerModel from "./printHistory.model";
import { PrintHistoryer } from "./printHistory.interface";
import {
  uploadImgToCloudinary,
  deleteImageFromCloudinary,
} from "../../util/uploadImgToCloudinary";
import { v2 as cloudinary } from "cloudinary";
import { ShopinventoryModal } from "../shopinventory/shopinventory.model";

const create = async (
  userId: string,
  photo1: Express.Multer.File,
  photo2: Express.Multer.File,
  templateId: string,
  categoryId: string,
  type: string,
  quantity: number
) => {
  // Upload photo1 to Cloudinary
  const result1 = await uploadImgToCloudinary(photo1.filename, photo1.path);

  if (!result1.secure_url) {
    throw new Error("Photo1 upload failed.");
  }

  // Initialize print history data
  const printHistoryData: any = {
    shopId: userId,
    photo1Link: result1.secure_url,
    photo1PublicId: result1.public_id,
    templateId,
    categoryId,
    type,
    quantity,
  };

  // Upload photo2 if provided
  if (photo2) {
    const result2 = await uploadImgToCloudinary(photo2.filename, photo2.path);
    if (!result2.secure_url) {
      throw new Error("Photo2 upload failed.");
    }

    printHistoryData.photo2Link = result2.secure_url;
    printHistoryData.photo2PublicId = result2.public_id;
  }

  // Save to DB
  const PrintHistoryer = await PrintHistoryerModel.create(printHistoryData);
  return PrintHistoryer;
};

const updatePrintStatus = async (id: string) => {
  const PrintHistoryer = await PrintHistoryerModel.findById(id);
  if (!PrintHistoryer) {
    return null; // or throw an error if preferred
  }
  const categotyId = PrintHistoryer.categoryId;
  const shopId = PrintHistoryer.shopId;
  const quantity = PrintHistoryer.quantity;

  const inventory = await ShopinventoryModal.findOne({
    shopOwner: shopId,
    category: categotyId,
  });
  if (!inventory) {
    throw new Error("Inventory not found for the given shop and category.");
  }

  // Ensure the quantity doesn't go below 0
  if (inventory.quantity < quantity) {
    throw new Error("Not enough inventory to complete the request.");
  }

  inventory.quantity -= quantity;

  // Save the updated inventory back to the database
  await inventory.save();

  PrintHistoryer.printStatus = true;
  await PrintHistoryer.save();
  return PrintHistoryer;
};

const getAll = async () => {
  const PrintHistoryers = await PrintHistoryerModel.find({
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .populate("shopId", "shopName userUniqueKey")
    .populate("templateId", "name SKU price")
    .populate("categoryId", "name");
  return PrintHistoryers;
};

const getAllByShop = async (userId: string) => {
  const PrintHistoryers = await PrintHistoryerModel.find({
    isDeleted: false,
    shopId: userId,
  })
    .sort({ createdAt: -1 })
    .populate("templateId", "name SKU price")
    .populate("categoryId", "name");
  return PrintHistoryers;
};

const getById = async (id: string) => {
  const PrintHistoryer = await PrintHistoryerModel.findOne({
    _id: id,
    isDeleted: false,
  });
  return PrintHistoryer;
};

const Delete = async (id: string, publicId: string) => {
  const result = await deleteImageFromCloudinary(publicId);

  if (!result) {
    throw new Error("Image deletion from Cloudinary failed.");
  }

  const result1 = await PrintHistoryerModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result1;
};

const PrintHistoryerService = {
  create,
  updatePrintStatus,
  getAll,
  getAllByShop,
  getById,
  Delete,
};

export default PrintHistoryerService;
