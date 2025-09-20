
import { TUserRole } from '../../constents';

export type TWebUser = {
  name: string;
  phone: string;
  email: string;
  password: string;
  address?: string;  
  role?: TUserRole;
  isDeleted?: string;
  isBlocked?: boolean;
  passwordChangeTime?: Date;
};
