import mongoose, { Schema } from 'mongoose';

    const webOrderSchema = new Schema(
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

    const WebOrderModel = mongoose.model('WebOrder', webOrderSchema);
    export default WebOrderModel;
