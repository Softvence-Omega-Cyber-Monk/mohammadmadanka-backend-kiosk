import mongoose, { Schema } from "mongoose";
import { number } from "zod";

const TemplateCofig = new Schema({
  x: { type: Number },
  y: { type: Number },
  height: { type: Number },
  width: { type: Number },
  scaleX: { type: Number },
  scaleY: { type: Number },
  rotation: { type: Number },
});

const PhotoHoleSchema = new Schema({
  placeholderLink: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  scaleX: { type: Number, required: false, default: 1 },
  scaleY: { type: Number, required: false, default: 1 },
  rotation: { type: Number, required: false, default: 0 },
});

const TextHoleSchema = new Schema({
  placeholderText: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  scaleX: { type: Number, required: false, default: 1 },
  scaleY: { type: Number, required: false, default: 1 },
  rotation: { type: Number, required: false, default: 0 },
  font: { type: String, required: true },
  fontSize: { type: Number, required: true },
  color: { type: String, required: true },
});

const HolesInfoSchema = new Schema({
  photoHoles: [PhotoHoleSchema],
  textHoles: [TextHoleSchema],
});

const TemplateSchema = new Schema(
  {
    previewLink: { type: [String], required: true },
    name: { type: String, required: true },
    SKU: { type: String, required: true },
    link: { type: String, required: false },
    productlink: { type: String, required: false },
    productAspectRatio: { type: Number, reqquired: false, default: 1 },
    config: { type: TemplateCofig, required: false },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    occasion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Occasion",

      required: false,
    },
    tags: { type: [String], required: true },
    isPersonalizable: { type: Boolean, required: true, default: true },
    rudeContent: { type: Boolean, required: true, default: false },
    price: { type: Number, required: true },
    holesInfo: { type: [HolesInfoSchema], required: false },
    aspectRatio: { type: Number, require: true },
    sizeInPixel: {
      h: { type: Number, default: 0, required: false },
      w: { type: Number, default: 0, required: false },
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const TemplateModel = mongoose.model("Template", TemplateSchema);
export default TemplateModel;
