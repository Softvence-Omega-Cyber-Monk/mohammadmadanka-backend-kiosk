import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    shopOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCollection",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// To make sure one shop has only one inventory entry per product
InventorySchema.index({ shopOwner: 1, category: 1 }, { unique: true });

export const ShopinventoryModal = mongoose.model("Inventory", InventorySchema);
