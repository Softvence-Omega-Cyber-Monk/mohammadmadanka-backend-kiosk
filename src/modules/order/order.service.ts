import OrderModel from "./order.model";
import ProductModel from "../product/product.model";
import { Order } from "./order.interface"; // optional interface
import mongoose, { ObjectId } from "mongoose";
import InventoryModel from "../shopinventory/shopinventory.model";

// Create order (shopOwner id comes from token)
const create = async (shopOwnerId: string, items: { product: string; quantity: number }[]) => {
  let amount=0;
  // ✅ ensure products exist
  for (const item of items) {
    const product = await ProductModel.findById(item.product);
    amount += (product?.price ?? 0) * item.quantity; // ✅ accumulate
    if (!product) {
      throw new Error(`Product with id ${item.product} not found`);
    }
  }
  const order = await OrderModel.create({
    shopOwner: shopOwnerId,
    items,
    amount,
  });

  return order;
};

// Get all orders
const getAll = async () => {
  const orders = await OrderModel.find()
  return orders;
};

// Get order by id
const getById = async (id: string) => {
  const order = await OrderModel.findById(id)
  return order;
};


const update = async (id: string, data: Partial<Order>) => {
  let amount = 0;

  // ✅ If items are being updated, recalculate amount
  if (data.items && data.items.length > 0) {
    for (const item of data.items) {
      const product = await ProductModel.findById(item.product);

      if (!product) {
        throw new Error(`Product with id ${item.product} not found`);
      }

      amount += (product.price ?? 0) * item.quantity;
    }

    // overwrite amount safely
    data.amount = amount;
  }

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
  adminId?: string
) => {
  const order = await OrderModel.findById(id).populate("items.product");
  if (!order) return null;

  order.status = status;

  if (status === "approved" && adminId) {
    order.approvedBy = new mongoose.Types.ObjectId(adminId);
  }

  if (status === "delivered") {
    order.deliveredAt = new Date();

    // 🔹 For each delivered item, add/update inventory for shop
    for (const item of order.items) {
      await InventoryModel.findOneAndUpdate(
        {
          shopOwner: order.shopOwner,
          product: item.product, // ObjectId of Product
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
  const order = await OrderModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return order;
};

const orderService = {
  create,
  getAll,
  getById,
  updateStatus,
  softDelete,
  update,
};

export default orderService;
