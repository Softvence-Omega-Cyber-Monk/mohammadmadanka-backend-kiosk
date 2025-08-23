import mongoose from "mongoose";

export type Inventory = {
  shopOwner: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};
