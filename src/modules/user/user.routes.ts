import express from 'express';
import userController from './user.controller';
import { userRole } from '../../constents';
import auth from '../../middleware/auth';
import { upload } from '../../util/uploadImgToCloudinary';

const userRoutes = express.Router();

// users routes
userRoutes.post('/createUser', userController.createUser);


userRoutes.delete(
  '/selfDistuct',
  auth(userRole.user),
  userController.selfDistuct,
);

// admin routes
userRoutes.get(
  '/getAlluser',
  auth(userRole.admin, userRole.user),
  userController.getAllUsers,
);
userRoutes.delete(
  '/deleteSingleUser',
  auth(userRole.admin),
  userController.deleteSingleUser,
);

export default userRoutes;
