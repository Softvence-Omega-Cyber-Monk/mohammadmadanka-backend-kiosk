import mongoose, { Schema } from 'mongoose';

    const placeholderSchema = new Schema(
      {
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

    const PlaceholderModel = mongoose.model('Placeholder', placeholderSchema);
    export default PlaceholderModel;
