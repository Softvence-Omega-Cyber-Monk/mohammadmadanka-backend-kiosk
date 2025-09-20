import mongoose, { Schema } from "mongoose";
import { string } from "zod";

const webAddedCartSchema = new Schema(
  {
    User_id: {
      type: Schema.Types.ObjectId, // references another collection
      ref: "WebUserCollection", // name of the referenced model
      required: true,
    },
    template_id: {
      type: Schema.Types.ObjectId, // references another collection
      ref: "Template", // name of the referenced model
      required: true,
    },
    Imglink: {
      type: String,
      required: true,
    },
    Imgpublic_id: {
      type: String,
      required: true,
    },

    insideImgLink: {
      type: String,
      required: false,
    },
    insideImgPublic_id: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const WebAddedCartModel = mongoose.model("WebAddedCart", webAddedCartSchema);
export default WebAddedCartModel;
