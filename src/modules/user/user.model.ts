import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";

import { userRole } from "../../constents";
import { TUser } from "./user.interface";

const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", CounterSchema);

const UserSchema = new Schema<TUser>(
  {
    shopName: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userUniqueKey: {
      type: String, // store as string to keep leading zeros
      unique: true,
    },
    role: {
      type: String,
      enum: ["superAdmin", "shopAdmin"],
      default: userRole.shopAdmin,
    },
    bannerImg: { type: String },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],

    isDeleted: { type: Boolean, default: false },
    isAccepted: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      unique: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    const userCount = await mongoose.model("UserCollection").countDocuments();

    if (userCount === 0) {
      // Reset counter to 0 if no users exist
      await Counter.findByIdAndUpdate(
        { _id: "userUniqueKey" },
        { seq: 0 },
        { upsert: true }
      );
    }

    const counter = await Counter.findByIdAndUpdate(
      { _id: "userUniqueKey" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.userUniqueKey = counter.seq.toString().padStart(5, "0");
  }

  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    return next(error);
  }
});

export const UserModel = mongoose.model("UserCollection", UserSchema);
