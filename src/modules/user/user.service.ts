import mongoose, { ClientSession, Types } from 'mongoose';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import { uploadImgToCloudinary } from '../../util/uploadImgToCloudinary';




const createUser = async (payload: Partial<TUser>, method?: string) => {
  
  const existingUser = await UserModel.findOne({ email: payload.email }).select('+password');

  if (existingUser) {
    if (!existingUser.isDeleted) {
      return {
        message: "A user with this email already exists and is active.",
        data: null,
      };
    }
  }

  const session: ClientSession = await mongoose.startSession();

  try {
    const result = await session.withTransaction(async () => {
      let user;

      if (method) {
        const { password, ...rest } = payload;
        const created = await UserModel.create([rest], { session });
        user = created[0];
      } else {
        user = new UserModel(payload);
        await user.save({ session });
      }
      return {
        message: "User created successfully.",
        data: user,
      };
    });

    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      message: "User creation failed due to an internal error.",
      data: null,
    };
  } finally {
    session.endSession();
  }
};


const getAllUsers= async()=>{
 const result = await UserModel.find();
 return result;
}


const deleteSingleUser = async (user_id: Types.ObjectId) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
      await UserModel.findOneAndUpdate({ _id: user_id }, { isDeleted: true ,email:null}, { session });      
      await session.commitTransaction();
      session.endSession();
  } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
  }
};

const selfDistuct = async (user_id:Types.ObjectId) => {
const result = deleteSingleUser(user_id)
return result;
}



const userServices = {
  createUser,
  getAllUsers,
  deleteSingleUser,
  selfDistuct,
};

export default userServices;
