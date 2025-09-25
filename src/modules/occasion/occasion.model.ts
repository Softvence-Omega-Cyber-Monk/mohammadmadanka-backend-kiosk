import mongoose, { Schema } from "mongoose";

const occasionSchema = new Schema(
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
    public_id: {
      type: String,
      required: true,
    },
    serialNumber: { 
      type: Number, 
      required: true, 
      unique: true 
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

const OccasionModel = mongoose.model("Occasion", occasionSchema);
export default OccasionModel;
