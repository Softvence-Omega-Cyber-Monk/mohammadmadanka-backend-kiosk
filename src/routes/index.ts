import express from 'express';
import authRouter from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import templateRoutes from '../modules/template/template.routes';
import path from 'path';
import placeholderRoutes from '../modules/placeholder/placeholder.routes';

const Routes = express.Router();
// Array of module routes
const moduleRouts = [
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/users',
    router:userRoutes,
  },
  {
    path: '/templates',
    router:templateRoutes,
  },
  {
    path: '/placeholders',
    router: placeholderRoutes, 
  }
];

moduleRouts.forEach(({ path, router }) => {
  Routes.use(path, router);
});

export default Routes;
