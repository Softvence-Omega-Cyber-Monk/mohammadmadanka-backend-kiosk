import express from 'express';
import userController from './user.controller';
import { userRole } from '../../constents';
import auth from '../../middleware/auth';

const userRoutes = express.Router();

// users routes
userRoutes.post('/createUser', userController.createUser);

// admin routes
userRoutes.get(
  '/getAlluser',
  auth(userRole.superAdmin, userRole.webuser),
  userController.getAllUsers,
);
userRoutes.get(
  '/getSingleUser',
  auth(userRole.superAdmin, userRole.webuser),
  userController.getSingleUser,
);
userRoutes.delete(
  '/deleteSingleUser',
  auth(userRole.superAdmin, userRole.webuser),
  userController.deleteSingleUser,
);

export default userRoutes;
