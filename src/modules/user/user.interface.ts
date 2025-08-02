import { Types } from "mongoose"
import { TUserRole } from "../../constents"

export type TUser={
    name:string,
    phone:string,
    email:string,
    password:string,
    confirmPassword:string,
    role?:TUserRole,
    isDeleted?:string,
    isBlocked?:boolean,
    isLoggedIn?:boolean,
    loggedOutTime?:Date
    passwordChangeTime?:Date
}