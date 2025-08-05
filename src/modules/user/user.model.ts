import bcrypt from "bcrypt";
import mongoose, { Schema, model } from "mongoose";

import { userRole } from "../../constents";
import { TUser } from "./user.interface";

const UserSchema = new Schema<TUser>(
  {
    name: { type: String, required: false, default: "user" },
    phone: { type: String, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["superAdmin", "admin", "user"],
      default: userRole.user,
    },

    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
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
