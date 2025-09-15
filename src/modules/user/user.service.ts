import mongoose, { ClientSession } from "mongoose";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";
import { Types } from "mongoose";
import InventoryModel from "../shopinventory/shopinventory.model";
import { sendEmail } from "../../util/sendEmail";

const createUser = async (payload: Partial<TUser>) => {
  const existingUser = await UserModel.findOne({ email: payload.email }).select(
    "+password"
  );

  if (existingUser) {
    if (!existingUser.isDeleted) {
      return {
        message: "A user with this email already exists and is active.",
        data: null,
      };
    }
  }
  try {
    // Create new user
    const created = await UserModel.create(payload);
    console.log("......",created);
    // Send welcome email (non-blocking: don’t let email failure break user creation)
    try {
      const subject = "🎉 Welcome to My App!";
      const html = `
        <h1>Hello ${payload.shopName ?? "User"},</h1>
        <p>Thanks for signing up! We’re excited to have you on board 🚀</p>
      `;

      await sendEmail(payload.email as string, subject, html);
    } catch (emailErr) {
      console.error("⚠️ Failed to send welcome email:", emailErr);
    }

    return {
      message: "User created successfully.",
      data: created,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const getAllUsers = async () => {
  const result = await UserModel.find({ isDeleted: false });
  return result;
};

const getSingleUser = async (user_id: Types.ObjectId) => {
  const result = await UserModel.findOne({ _id: user_id, isDeleted: false });
  return result;
};
const updateUserStatus = async (user_id: Types.ObjectId, isAccepted: any) => {
  console.log("user id in service ", isAccepted);

  const result = await UserModel.findOneAndUpdate(
    { _id: user_id, isDeleted: false },
    { $set: isAccepted }, // 👈 update field
    { new: true } // 👈 return updated document
  );

  return result;
};
const updateUser = async (user_id: Types.ObjectId, data: any) => {
  console.log("user id in service", data);

  const result = await UserModel.findOneAndUpdate(
    { _id: user_id, isDeleted: false }, // make sure this matches a document
    {
      $set: {
        ...(data.bannerImg !== undefined && { bannerImg: data.bannerImg }),
        ...(data.categories !== undefined && { categories: data.categories }),
      },
    },
    { new: true }
  );

  const shopOwnerId = user_id;

  for (const category of data.categories || []) {
    await InventoryModel.findOneAndUpdate(
      {
        shopOwner: shopOwnerId,
        category: category, // ObjectId of Product
      },
      {
        $inc: { quantity: 0 }, // ✅ increase stock
      },
      {
        upsert: true, // ✅ create if not exists
        new: true,
      }
    );
  }

  console.log("updated user: ", result);

  return result;
};

const deleteSingleUser = async (user_id: Types.ObjectId) => {
  const existingUser = await UserModel.findOne({ _id: user_id }).select(
    "+password"
  );
  if (existingUser?.role !== "superAdmin") {
    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();
    try {
      await UserModel.findOneAndUpdate(
        { _id: user_id },
        { isDeleted: true, email: null },
        { session }
      );

      await session.commitTransaction();
      session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } else {
    throw new Error("Cannot delete admin user");
  }
};

const userServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUserStatus,
  updateUser,
  deleteSingleUser,
};

export default userServices;
