import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true, // keep clean category names
      unique: true,
    },
    price: { type: Number, required: true, min: 0 },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
