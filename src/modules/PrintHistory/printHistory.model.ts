import mongoose, { Schema } from 'mongoose';

    const PrintHistorySchema = new Schema(
      {
        shopId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'UserCollection',
          required: true,
        },
        link: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
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

    const PrintHistoryModel = mongoose.model('PrintHistory', PrintHistorySchema);
    export default PrintHistoryModel;
