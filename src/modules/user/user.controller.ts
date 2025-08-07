
import catchAsync from '../../util/catchAsync';
import idConverter from '../../util/idConvirter';
import sendResponse from '../../util/sendResponse';

import userServices from './user.service';

const createUser = catchAsync(async (req, res) => {
  const user = req.body;
  console.log('user in controller', user);
  const result = await userServices.createUser(user);
  res.status(200).json({
    message: result.message || 'user created successfully',
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

const getSingleUser = catchAsync(async (req, res) => {
  const user_id = req.query.user_id as string;
  console.log(user_id)
  const userIdConverted = idConverter(user_id);
  if (!userIdConverted) {
    throw new Error('user id conversion failed');
  }
  const result = await userServices.getSingleUser(userIdConverted);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All users',
    data: result,
  });
});

const deleteSingleUser = catchAsync(async (req, res) => {
  const user_id = req.query.user_id as string;
  const userIdConverted = idConverter(user_id);
  if (!userIdConverted) {
    throw new Error('user id conversiopn failed');
  }
  const result = await userServices.deleteSingleUser(userIdConverted);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'user deleted',
    data: result,
  });
});

const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
};

export default userController;
