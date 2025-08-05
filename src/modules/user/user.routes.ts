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
  auth(userRole.admin, userRole.user),
  userController.getAllUsers,
);
userRoutes.get(
  '/getSingleUser',
  auth(userRole.admin, userRole.user),
  userController.getSingleUser,
);
userRoutes.delete(
  '/deleteSingleUser',
  auth(userRole.admin),
  userController.deleteSingleUser,
);

export default userRoutes;
