import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import jwt from "jsonwebtoken";

import catchAsync from "../util/catchAsync";
import { TUserRole } from "../constents";

import { UserModel } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    //Check if token is sent
    if (!token) {
      throw new Error("Token not found: Unauthorized User!");
    }

    // If token found, then verify token and find out decoded jwtPayload fields
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_token_secret as string
      ) as JwtPayload;
    } catch (error) {
      console.log(error);
      throw new Error("can not verify !");
    }
    const { email, userId, role } = decoded;

    const user = await UserModel.findById(userId);

    // Check if user exists
    if (!user) {
      throw new Error("user not found !");
    }
    // if( user.isVerified === false) {
    //   throw new ApiError(httpStatus.FORBIDDEN, "Please verify your email first!");
    // }

    // Check if user is deleted
    const isUserDeleted = user?.isDeleted;
    if (isUserDeleted) {
      throw new Error("user deleted !");
    }

    // Check if the request was sent by authorized user or not
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new Error("role mismatch !");
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
