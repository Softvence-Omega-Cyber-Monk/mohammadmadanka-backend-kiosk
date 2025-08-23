import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    shopOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCollection",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
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
InventorySchema.index({ shopOwner: 1, product: 1 }, { unique: true });

export default mongoose.model("Inventory", InventorySchema);
