import OrderModel from "./order.model";
//import ProductModel from "../category/category.model";
import { Order } from "./order.interface"; // optional interface
import mongoose, { ObjectId } from "mongoose";

import { UserModel } from "../user/user.model";
import { ShopinventoryModal } from "../shopinventory/shopinventory.model";

// Create order (shopOwner id comes from token)
const create = async (
  shopOwnerId: string,
  items: { category: string; quantity: number }[]
) => {
  // let amount=0;
  // // ✅ ensure products exist
  // for (const item of items) {
  //   const product = await ProductModel.findById(item.product);
  //   amount += (product?.price ?? 0) * item.quantity; // ✅ accumulate
  //   if (!product) {
  //     throw new Error(`Product with id ${item.product} not found`);
  //   }
  // }
  const order = await OrderModel.create({
    shopOwner: shopOwnerId,
    items,
  });

  return order;
};

// Get all orders
const getAll = async () => {
  const orders = await OrderModel.find()
    .populate("shopOwner")
    .populate("items.category")
    .lean();
  return orders;
};
const getSingleUserOrders = async (email: string) => {
  const shopOwner = await UserModel.findOne({ email: email });
  if (!shopOwner) {
    throw new Error(`User with email ${email} not found`);
  }
  const orders = await OrderModel.find({ shopOwner })
    .populate("shopOwner")
    .populate("items.category")
    .lean();
  return orders;
};

// Get order by id
const getById = async (id: string) => {
  const order = await OrderModel.findById(id);
  return order;
};

const update = async (id: string, data: Partial<Order>) => {
  // let amount = 0;

  // // ✅ If items are being updated, recalculate amount
  // if (data.items && data.items.length > 0) {
  //   for (const item of data.items) {
  //     const product = await ProductModel.findById(item.product);

  //     if (!product) {
  //       throw new Error(`Product with id ${item.product} not found`);
  //     }

  //     amount += (product.price ?? 0) * item.quantity;
  //   }

  //   // overwrite amount safely
  //   data.amount = amount;
  // }

  const updatedOrder = await OrderModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    { new: true }
  );

  return updatedOrder;
};

// Update order status
const updateStatus = async (
  id: string,
  status: "pending" | "approved" | "delivered" | "rejected",
  delivaryLink?: string | null,
  deliveryToken?: string | null,
  adminId?: string
) => {
  const order = await OrderModel.findById(id).populate("items.category");
  if (!order) return null;

  order.status = status;

  if (status === "approved" && adminId) {
    order.delivaryLink = delivaryLink ?? null;
    order.deliveryToken = deliveryToken ?? null;
    order.approvedBy = new mongoose.Types.ObjectId(adminId);
  }

  if (status === "delivered") {
    order.deliveredAt = new Date();

    // 🔹 For each delivered item, add/update inventory for shop
    for (const item of order.items) {
      await ShopinventoryModal.findOneAndUpdate(
        {
          shopOwner: order.shopOwner,
          category: item.category, // ObjectId of Product
        },
        {
          $inc: { quantity: item.quantity }, // ✅ increase stock
        },
        {
          upsert: true, // ✅ create if not exists
          new: true,
        }
      );
    }
  }

  await order.save();
  return order;
};

// Soft delete (if you want it)
const softDelete = async (id: string) => {
  const order = await OrderModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return order;
};

const orderService = {
  create,
  getAll,
  getSingleUserOrders,
  getById,
  updateStatus,
  softDelete,
  update,
};

export default orderService;
