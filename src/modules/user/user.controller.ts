import catchAsync from "../../util/catchAsync";
import idConverter from "../../util/idConvirter";
import sendResponse from "../../util/sendResponse";

import userServices from "./user.service";

const createUser = catchAsync(async (req, res) => {
  const { role, ...user } = req.body;
  console.log("user in controller", user);
  const result = await userServices.createUser(user);
  res.status(200).json({
    message: result.message || "user created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userServices.getAllUsers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All users",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const user_id = req.query.user_id as string;
  const userIdConverted = idConverter(user_id);

  if (!userIdConverted) {
    throw new Error("user id conversion failed");
  }
  const result = await userServices.getSingleUser(userIdConverted);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All users",
    data: result,
  });
});
const updateUserStatus = catchAsync(async (req, res) => {
  const user_id = req.query.user_id as string;
  const isAccepted = req.body ;
  console.log("isAccepted ", isAccepted);

  const userIdConverted = idConverter(user_id);
  if (!userIdConverted) {
    throw new Error("user id conversion failed");
  }
  const result = await userServices.updateUserStatus(userIdConverted, isAccepted);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All users",
    data: result,
  });
});
const updateUser = catchAsync(async (req, res) => {
  const user_id = req.query.user_id as string;
  const data = req.body ;

  const userIdConverted = idConverter(user_id);
  if (!userIdConverted) {
    throw new Error("user id conversion failed");
  }
  const result = await userServices.updateUser(userIdConverted, data);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All users",
    data: result,
  });
});

const deleteSingleUser = catchAsync(async (req, res) => {
  const user_id = req.query.user_id as string;
  const userIdConverted = idConverter(user_id);
  if (!userIdConverted) {
    throw new Error("user id conversiopn failed");
  }
  const result = await userServices.deleteSingleUser(userIdConverted);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "user deleted",
    data: result,
  });
});

const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUserStatus,
  updateUser,
  deleteSingleUser,
};

export default userController;
