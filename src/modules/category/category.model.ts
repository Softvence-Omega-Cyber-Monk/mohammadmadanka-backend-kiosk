import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    iconUrl: {
      type: String,
      unique: true,
      required: true,
    },
    type: {
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
        ref: "Occasion",
        required: false,
      },
    ],

    printData: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      rotation: { type: Number, default: 0 },
      mirror: { type: Boolean, default: false },
    },

    serialNumber: {
      type: Number,
      default: 0, // temporary default, will be replaced in pre-save
      unique: true,
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

categorySchema.pre("save", async function (next) {
  if (this.isNew && this.serialNumber === 0) {
    const lastCategory = await CategoryModel.findOne().sort({
      serialNumber: -1,
    });
    this.serialNumber = lastCategory ? lastCategory.serialNumber + 1 : 1;
  }
  next();
});

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;
