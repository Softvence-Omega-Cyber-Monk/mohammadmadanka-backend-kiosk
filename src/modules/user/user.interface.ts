import { TUserRole } from "../../constents";
import { Types } from "mongoose";

export type TUser = {
  shopName: string;
  phone: string;
  email: string;
  password: string;
  userUniqueKey?: string;
  role?: TUserRole;
  bannerImg?: string;
  categories?: (string | Types.ObjectId)[];
  isDeleted?: boolean;
  isAccepted?: 'pending' | 'approved' | 'rejected';

};
