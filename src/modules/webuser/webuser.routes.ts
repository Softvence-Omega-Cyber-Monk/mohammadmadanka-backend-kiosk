import express from 'express';
import webuserController from './webuser.controller';
import { userRole } from '../../constents';
import auth from '../../middleware/auth';

const webuserRoutes = express.Router();

// webusers routes
webuserRoutes.post('/createwebuser', webuserController.createwebuser);

// admin routes
webuserRoutes.get(
  '/getAllwebuser',
  auth(userRole.superAdmin, userRole.webuser),
  webuserController.getAllwebusers,
);
webuserRoutes.get(
  '/getSinglewebuser',
  auth(userRole.superAdmin, userRole.webuser),
  webuserController.getSinglewebuser,
);
webuserRoutes.delete(
  '/deleteSinglewebuser',
  auth(userRole.superAdmin, userRole.webuser),
  webuserController.deleteSinglewebuser,
);
webuserRoutes.put("/update/:id", webuserController.updateUserInfoController);

export default webuserRoutes;
