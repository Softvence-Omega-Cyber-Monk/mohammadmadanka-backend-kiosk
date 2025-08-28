import mongoose from "mongoose";

export type Inventory = {
  shopOwner: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};
