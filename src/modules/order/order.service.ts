import OrderModel from "./order.model";
import ProductModel from "./order.model";
import { Order } from "./order.interface"; // optional interface
import mongoose, { ObjectId } from "mongoose";

// Create order (shopOwner id comes from token)
const create = async (shopOwnerId: string, items: { product: string; quantity: number }[]) => {
  // ✅ ensure products exist
  for (const item of items) {
    const product = await ProductModel.findById(item.product);
    if (!product) {
      throw new Error(`Product with id ${item.product} not found`);
    }
  }

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
    .populate("items.product");
  return orders;
};

// Get order by id
const getById = async (id: string) => {
  const order = await OrderModel.findById(id)
    .populate("shopOwner")
    .populate("items.product");
  return order;
};

// Update order status
const updateStatus = async (id: string, status: "pending" | "approved" | "delivered" | "rejected", adminId?: string) => {
  const order = await OrderModel.findById(id);
  if (!order) return null;

  order.status = status;
  if (status === "approved" && adminId) {
   order.approvedBy = new mongoose.Types.ObjectId(adminId);
  }
  if (status === "delivered") {
    order.deliveredAt = new Date();
  }

  await order.save();
  return order;
};

// Soft delete (if you want it)
const softDelete = async (id: string) => {
  const order = await OrderModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return order;
};

const orderService = {
  create,
  getAll,
  getById,
  updateStatus,
  softDelete,
};

export default orderService;
