import { userRole } from '../constents';
import { UserModel } from '../modules/user/user.model';
import userServices from '../modules/user/user.service';

const adminSeeder = async () => {
  const admin = {
    name: 'SuperAdmin',
    email: 'admin@gmail.com',
    role: userRole.admin,
    password: '1',
    aggriedToTerms:true
  };
  
  const adminExist = await UserModel.findOne({ role: userRole.admin });

  if (!adminExist) {
    console.log('seeding admin....');
    const createAdmin =await userServices.createUser(admin);
    if (!createAdmin) 
    {
      throw Error('admin could not be created');
    }

    console.log("Create admin : ", createAdmin);
  }
};

export default adminSeeder;
