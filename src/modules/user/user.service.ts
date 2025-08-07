import mongoose, { ClientSession } from "mongoose";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";
import { Types } from "mongoose";

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
    const created = await UserModel.create(payload);

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
  deleteSingleUser,
};

export default userServices;
