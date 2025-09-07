import mongoose, { Schema } from 'mongoose';

    const categorySchema = new Schema(
      {
        name: {
          type: String,
          unique: true,
          required: true,
        },
        iconUrl: {
          type: String,
          unique: true,
          required: true,
        },
        type:
        {
          type: String,
          unique: false,
          required: true,
        },
          public_id: {
          type: String,
          required: true,
        },
        occasions: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Occasion',
            required: false,
          },
        ],
        isDeleted: {
          type: Boolean,
          default: false,
        },
      },
      {
        timestamps: true,
      }
    );

    const CategoryModel = mongoose.model('Category', categorySchema);
    export default CategoryModel;
