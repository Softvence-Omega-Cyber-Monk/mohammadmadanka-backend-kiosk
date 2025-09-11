import mongoose, { Schema } from "mongoose";

const PrintingTokenSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    access_token: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },

    expires_in: {
      type: Number,
      required: true,
    },
    token_type: {
      type: String,
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
