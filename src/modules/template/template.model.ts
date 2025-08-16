import mongoose, { Schema } from 'mongoose';
import { number } from 'zod';

const PhotoHoleSchema = new Schema({
  placeholderLink: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
});

const TextHoleSchema = new Schema({
  placeholderText: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  font: {type: String , required: true},
  fontSize: { type: Number, required: true },
  color: { type: String, required: true },
});

const HolesInfoSchema = new Schema({
  photoHoles: [PhotoHoleSchema],
  textHoles: [TextHoleSchema],
});

const TemplateSchema = new Schema(
  {
    previewLink: {type: String, required: true},
    name: { type: String, required: true },
    SKU: { type: String, required: true, unique: true },
    link: { type: String, required: true },
    category: { type: String, required: true },
    occasion: { type: String, required: true },
    targetUser: { type: String, required: true },
    rudeContent: { type: Boolean, required: true , default: false },
    price: { type: Number, required: true },
    holesInfo: [HolesInfoSchema],
    //aspectRatio: { type:number, require:true},
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const TemplateModel = mongoose.model('Template', TemplateSchema);
export default TemplateModel;
