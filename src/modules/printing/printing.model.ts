import mongoose, { Schema } from "mongoose";

const PrintingTokenSchema = new Schema(
  {
    acc: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },

    expiresIn: {
      type: Number,
      required: true,
    },
    scope: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PrintingTokenModel = mongoose.model("PrintingToken", PrintingTokenSchema);
export default PrintingTokenModel;
