import mongoose, { Schema } from 'mongoose';

    const bannerSchema = new Schema(
      {
        link: {
          type: String,
          required: true,
          
        },
        isSet:{
          type: Boolean,
          default: false,
        },
        public_id: {
          type: String,
          required: true,
        },
        bannerTag: {
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

    const bannerModel = mongoose.model('banner', bannerSchema);
    export default bannerModel;
