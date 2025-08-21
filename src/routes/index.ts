import express from 'express';
import authRouter from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import templateRoutes from '../modules/template/template.routes';
import placeholderRoutes from '../modules/placeholder/placeholder.routes';
import ShoppingRoutes from '../modules/shopping/shopping.routes';
import { PrintData } from '../modules/printData/printData.model';
import { printDataRouter } from '../modules/printData/printData.route';

const Routes = express.Router();

const moduleRouts = [
  {
    path: "/auth",
    router: authRouter,
  },
  {
    path: "/users",
    router: userRoutes,
  },
  {
    path: '/templates',
    router:templateRoutes,
  },
  {
    path: '/placeholders',
    router: placeholderRoutes, 
  },
   {
    path: '/shopping',
    router:  ShoppingRoutes, },
  {
    path: '/printData',
    router: printDataRouter, 
  }
];

moduleRouts.forEach(({ path, router }) => {
  Routes.use(path, router);
});

export default Routes;
