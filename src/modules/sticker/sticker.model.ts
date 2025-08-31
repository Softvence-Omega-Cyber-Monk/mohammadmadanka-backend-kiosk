import mongoose, { Schema } from 'mongoose';

    const stickerSchema = new Schema(
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          unique: true,
          required: true,
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

    const StickerModel = mongoose.model('Sticker', stickerSchema);
    export default StickerModel;
