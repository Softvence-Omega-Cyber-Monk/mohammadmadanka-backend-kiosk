import mongoose, { Schema } from 'mongoose';

const PrintHistorySchema = new Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserCollection',
      required: true,
    },
    // Storing image links and public IDs for photo1 and photo2
    photo1Link: {
      type: String,
      required: true, 
    },
    photo1PublicId: {
      type: String,
      required: true,
    },
    photo2Link: {
      type: String,
      required: false, 
    },
    photo2PublicId: {
      type: String,
      required: false, 
    },

    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    type: {
      type: String,
      required: true, 
    },
    quantity: {
      type: Number,
      required: true,
    },
    printStatus: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

const PrintHistoryModel = mongoose.model('PrintHistory', PrintHistorySchema);
export default PrintHistoryModel;
