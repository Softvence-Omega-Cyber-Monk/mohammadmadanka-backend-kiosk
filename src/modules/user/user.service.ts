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
