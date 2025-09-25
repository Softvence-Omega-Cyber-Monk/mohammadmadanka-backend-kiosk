import mongoose, { Schema } from 'mongoose';

    const printSettingSchema = new Schema(
      {
        imageLink: {
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

    const PrintSettingModel = mongoose.model('PrintSetting', printSettingSchema);
    export default PrintSettingModel;
