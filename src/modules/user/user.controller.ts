import { Types } from 'mongoose';
import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import idConverter from '../../util/idConvirter';
import userServices from './user.service';

const createUser = catchAsync(async (req, res) => {
  const user = req.body;
  const result = await userServices.createUser(user);
  res.status(200).json({
    message: result.message|| 'user created successfully' ,
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userServices.getAllUsers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All users',
    data: result,
  });
});


const deleteSingleUser = catchAsync(async (req, res) => {
  const user_id= req.query.user_id as string;
  const userIdConverted = idConverter(user_id);
  console.log(user_id,userIdConverted)
  if(!userIdConverted){
    throw new Error ("user id conversiopn failed")
  }
  const result =await userServices.deleteSingleUser(userIdConverted);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'user deleted',
    data: result,
  });
});


const selfDistuct = catchAsync(async (req, res) => {
  const user_id= req.user.id;
  const userIdConverted = idConverter(user_id)
  if (!userIdConverted){
    throw new Error("user id conversion failed")
  }
  const result = await userServices.selfDistuct(userIdConverted)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'your account deletation successfull',
    data: result,
  });
});

const userController = {
  createUser,
  getAllUsers,
  deleteSingleUser,
  selfDistuct,  
};


export default userController;
