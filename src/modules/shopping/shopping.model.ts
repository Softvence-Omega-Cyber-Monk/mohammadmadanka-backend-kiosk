import mongoose, { Schema } from "mongoose";

const shoppingSchema = new Schema(
  {
    UserName: {
      type: String,
      required: true,
    },
    template_id: {
      type: Schema.Types.ObjectId,   // references another collection
      ref: "Template",               // name of the referenced model
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,                        // optional: prevents negative prices
    },
    cardImgURL:{
      type: String,
      required: true,
    },
    msgImgUrl:
    {
      type: String,
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

export default mongoose.model("Shopping", shoppingSchema);