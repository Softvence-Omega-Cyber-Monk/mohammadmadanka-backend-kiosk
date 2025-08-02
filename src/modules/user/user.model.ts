import bcrypt from "bcrypt"
import mongoose, { Schema, model } from 'mongoose';
import { TUser } from "./user.interface";
import { userRole } from "../../constents";


const UserSchema = new Schema<TUser>({
    name: { type: String, required: false, default: "user" },
    email: { type: String, required: true, unique: false},
    password: { type: String, required: false },
    role: { type: String, enum: ["admin" , "user"], default:userRole.user },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    loggedOutTime: { type: Date },
    passwordChangeTime: { type: Date }
}, { timestamps: true });



UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Hash only if password is modified

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        return next(error);
    }
});


export const UserModel = mongoose.model("UserCollection", UserSchema);
//export const ProfileModel = model('Profile', ProfileSchema);





