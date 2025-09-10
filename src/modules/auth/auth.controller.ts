import catchAsync from "../../util/catchAsync";
import authServices from "./auth.service";

const logIn = catchAsync(async (req, res) => {
  const { shopId, password } = req.body;
  console.log('body in controlller ',shopId, password);
  const result = await authServices.login({ shopId, password });
  const { accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
    sameSite: "strict", // or 'lax' depending on cross-site needs
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    message: "Log In Successful",
    accessToken,
    refreshToken,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const authorizationToken = req.headers?.authorization as string;

  const result = await authServices.changePassword(
    authorizationToken,
    oldPassword,
    newPassword
  );
  res.status(200).json({
    success: true,
    message: "password changed",
    body: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  console.log("refresh token from cookie", token);

  const result = await authServices.refreshToken(token);

  res.status(200).json({
    success: true,
    message: "log token refreshed",
    body: result,
  });
});

// const forgetPassword = catchAsync(async (req, res) => {

//   const email = req.body?.email;
//   const result = await authServices.forgetPassword(email);
//   res.status(200).json({
//     success: true,
//     message: 'reset password token genarated check your email',
//     body: result,
//   });

// });

// const resetPassword = catchAsync(async (req, res) => {
//   const { id, newPassword } = req.body;
//   const authorizationToken = req.headers?.authorization as string;
//   // console.log(req.body)

//   const result = await authServices.resetPassword(
//     authorizationToken,
//     id,
//     newPassword,
//   );

//   res.status(200).json({
//     success: true,
//     message: 'password changed',
//     body: result,
//   });
// });

const authController = {
  logIn,

  changePassword,
  refreshToken,
  // forgetPassword,
  // resetPassword,
};
export default authController;
