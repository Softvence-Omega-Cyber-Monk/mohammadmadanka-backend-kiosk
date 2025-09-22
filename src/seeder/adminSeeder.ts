import { userRole } from "../constents";
import { UserModel } from "../modules/user/user.model";
import userServices from "../modules/user/user.service";

const adminSeeder = async () => {
  const superAdmin = {
    shopName: "Super Admin Shop",
    name: "SuperAdmin",
    email: "superAdmin@gmail.com",
    role: userRole.superAdmin,
    password: "123456",

    bannerImg:
      "https://res.cloudinary.com/dbt83nrhl/image/upload/v1757486403/file-1757486397491-184842453.jpg",
  };

  const adminExist = await UserModel.findOne({ role: userRole.superAdmin });

  if (!adminExist) {
    console.log("seeding superAdmin....");
    const createAdmin = await userServices.createUser(superAdmin);
    if (!createAdmin) {
      throw Error("admin could not be created");
    }

    console.log("Create superAdmin : ", createAdmin);
  }
};

export default adminSeeder;
