import mongoose, { Schema } from 'mongoose';

    const PrintHistorySchema = new Schema(
      {
        shopId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'UserCollection',
          required: true,
        },
        Imglink: {
          type: String,
          required: true,
        },
        Imgpublic_id: {
          type: String,
          required: true,
        },

        insideImgLink: {
          type: String,
          required: false,
        },
        insideImgPublic_id: {
          type: String,
          required: false,
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
