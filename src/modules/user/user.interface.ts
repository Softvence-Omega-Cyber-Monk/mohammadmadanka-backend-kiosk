import { TUserRole } from "../../constents";

export type TUser = {
  shopName: string;
  phone: string;
  email: string;
  password: string;
  userUniqueKey?: string;
  role?: TUserRole;
  bannerId?: string;
  categories?: string[];
  isDeleted?: string;
  isAccepted?: 'pending' | 'approved' | 'rejected';

};
