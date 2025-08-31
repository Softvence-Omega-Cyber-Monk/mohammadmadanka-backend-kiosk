import { model, Schema } from "mongoose";
import { TPrintData } from "./printData.interface";

const printDataSchema = new Schema<TPrintData>(
  {
    templateId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Template", 
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true, // Optional, can be calculated later
    },
    insidePage: {
      type: Number,
      required: false, // Optional, can be added later
    },
  },
  {
    timestamps: true,
  }
);

export const PrintData = model<TPrintData>("PrintData", printDataSchema);