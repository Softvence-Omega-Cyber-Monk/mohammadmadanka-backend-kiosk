import bcrypt from "bcrypt";

import { UserModel } from "../user/user.model";

import { TUser } from "../user/user.interface";
import { createAccessToken, createRefreshToken } from "./auth.utill";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";

const login = async (payload: Partial<TUser>) => {
  const user: any = await UserModel.findOne({ email: payload?.email }).select(
    "+password"
  );

  // Check if user exists
  if (!user) {
    throw new Error("User is not found !");
  }

  // Block deleted users
  if (user.isDeleted) {
    throw new Error("User is deleted!");
  }

  //  Check password
  if (!payload.password) {
    throw new Error("Password is required!");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Password not matched !");
  }

  //  Create Tokens
  const jwtPayload = {
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
    name: user.name,
  };
  const accessToken = createAccessToken(
    jwtPayload,
    config.jwt_token_secret as string,
    parseInt(config.token_expairsIn as string)
  );

  const refreshToken = createRefreshToken(
    jwtPayload,
    config.jwt_refresh_Token_secret as string,
    parseInt(config.rifresh_expairsIn as string)
  );

  return {
    accessToken,
    refreshToken,
  };
};
//

const changePassword = async (
  authorizationToken: string,
  oldPassword: string,
  newPassword: string
) => {
  try {
    // Decode the token
    const decoded = jwt.verify(
      authorizationToken,
      config.jwt_token_secret as string
    ) as JwtPayload;


    if (!decoded) {
      throw new Error("Invalid or unauthorized token");
    }

    const userId = decoded.userId;

    // Find the user and include the password field
    const findUser = await UserModel.findOne({ _id: userId })
      .select("+password")
      .lean(); // Convert to a plain object for performance

    if (!findUser) {
      throw new Error("User not found or password missing");
    }

    // Compare old password with hashed password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      findUser.password
    );

    if (!isPasswordMatch) {
      throw new Error("Old password is incorrect");
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt)
    );

    // Update the password
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        password: newPasswordHash,
        passwordChangeTime: new Date(),
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Error updating password");
    }

    return { success: true, message: "Password changed successfully" };
  } catch (error: any) {
    console.error("Error changing password:", error.message);
    throw new Error(error.message || "Something went wrong");
  }
};

const refreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(
    refreshToken,
    config.jwt_refresh_Token_secret as string
  );

  if (!decoded) {
    throw Error("tocan decodaing Failed");
  }

  const { userId, role } = decoded as JwtPayload;

  const findUser = await UserModel.findOne({
    _id: userId,
    isDeleted: false,
  });
  console.log();

  if (!findUser) {
    throw Error("Unauthorised User or forbitten Access");
  }

  const JwtPayload = {
    userId: findUser.id,
    role: role,
    email: findUser.email,
    name: findUser.shopName,
  };
  const approvalToken = createAccessToken(
    JwtPayload,
    config.jwt_token_secret as string,
    parseInt(config.token_expairsIn as string)
  );

  return {
    approvalToken,
  };
};

// const forgetPassword = async (email: string) => {
//   const user = await UserModel.findOne({ email });

//   if (!user) {
//     throw new Error('User not found with this email');
//   }

//   if (user.isDeleted) {
//     throw new Error('This user is deleted. This function is not available.');
//   }

//   const tokenizeData = {
//     id: user._id,
//     role: user.role,
//   };

//   const resetToken = authUtill.createToken(
//     tokenizeData,
//     config.jwt_token_secret as string,
//     config.token_expairsIn as string,
//   );

//   const resetLink = `${config.FrontEndHostedPort}?id=${user._id}&token=${resetToken}`;

//   const passwordResetHtml = `
//     <div>
//       <p>Dear User,</p>
//       <p>Click the button below to reset your password. This link expires in 10 minutes.</p>
//       <p>
//           <a href="${resetLink}" target="_blank">
//               <button style="padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 4px;">
//                   Reset Password
//               </button>
//           </a>
//       </p>
//     </div>
//   `;

//   const emailResponse = await sendEmail(
//     user.email,
//     'Reset Your Password',
//     passwordResetHtml,
//   );

//   if (emailResponse.success) {
//     return {
//       success: true,
//       message: '✅ Check your email for the reset password link.',
//       emailSentTo: emailResponse.accepted,
//       resetLink,
//     };
//   } else {
//     return {
//       success: false,
//       message: '❌ Failed to send password reset email.',
//       error: emailResponse.error,
//     };
//   }
// };

const authServices = {
  login,

  changePassword,
  refreshToken,
  // forgetPassword,
};
export default authServices;
