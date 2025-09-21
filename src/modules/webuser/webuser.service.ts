import mongoose, { ClientSession } from 'mongoose';
import { TWebUser } from './webuser.interface';
import { WebUserModel } from './webuser.model';
import { Types, Document } from 'mongoose';

const createwebuser = async (payload: Partial<TWebUser>) => {
  const existingUser = await WebUserModel.findOne({ email: payload.email }).select(
    '+password',
  );

  if (existingUser) {
    if (!existingUser.isDeleted) {
      return {
        message: 'A webuser with this email already exists and is active.',
        data: null,
      };
    }
  }
 console.log("payload", payload);
  try {
    const created = await WebUserModel.create(payload);

    return {
      message: 'webuser created successfully.',
      data: created,
    };
  } catch (error) {
    console.error('Error creating webuser:', error);
    throw error;
  }
};

const getAllwebusers = async () => {
  const result = await WebUserModel.find({ isDeleted: false });
  return result;
};

const getSinglewebuser = async (webuser_id: Types.ObjectId) => {
  const result = await WebUserModel.findOne({ _id: webuser_id, isDeleted: false });
  return result;
};

const deleteSinglewebuser = async (webuser_id: Types.ObjectId) => {
  const existingwebuser = await WebUserModel.findOne({ _id: webuser_id }).select(
    '+password',
  );
};

const updateUserInfoService = async (
  userId: string,
  payload: Partial<TWebUser>
) => {
  const user = await WebUserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // If password is included, let mongoose pre-save hook handle hashing
  if (payload.password) {
    user.password = payload.password;
  }

  if (payload.name !== undefined) user.name = payload.name;
  if (payload.phone !== undefined) user.phone = payload.phone;
  if (payload.address !== undefined) user.address = payload.address;
  if (payload.isBlocked !== undefined) user.isBlocked = payload.isBlocked;

  await user.save();
  return user;
};


const webuserServices = {
  createwebuser,
  getAllwebusers,
  getSinglewebuser,
  deleteSinglewebuser,
  updateUserInfoService
};

export default webuserServices;
