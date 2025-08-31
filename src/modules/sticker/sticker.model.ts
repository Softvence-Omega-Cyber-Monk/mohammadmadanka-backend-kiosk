import mongoose, { Schema } from "mongoose";

const stickerSchema = new Schema(
  {
    link: {
      type: String,
      required: true,
      unique: false,
    },
    public_id: {
      type: String,
      required: true,
      unique: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      unique: false,
    },
  },
  {
    timestamps: true,
  }
);

const stickerModel = mongoose.model("sticker", stickerSchema);
export default stickerModel;
