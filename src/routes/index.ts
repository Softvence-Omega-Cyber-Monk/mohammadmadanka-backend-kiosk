import express, { Router } from "express";
import authRouter from "../modules/auth/auth.routes";
import userRoutes from "../modules/user/user.routes";
import templateRoutes from "../modules/template/template.routes";
import placeholderRoutes from "../modules/placeholder/placeholder.routes";
import ShoppingRoutes from "../modules/shopping/shopping.routes";
import { PrintData } from "../modules/printData/printData.model";
import { printDataRouter } from "../modules/printData/printData.route";
import productRouter from "../modules/product/product.routes";
import orderrouter from "../modules/order/order.routes";
import orderRouter from "../modules/order/order.routes";
import shopinventoryRouter from "../modules/shopinventory/shopinventory.routes";
import CategoryRouter from "../modules/category/category.routes";
import OccasionRouter from "../modules/occasion/occasion.routes";

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
    path: "/templates",
    router: templateRoutes,
  },
  {
    path: "/placeholders",
    router: placeholderRoutes,
  },
  {
    path: "/shopping",
    router: ShoppingRoutes,
  },
  {
    path: "/printData",
    router: printDataRouter,
  },
  {
    path: "/product",
    router: productRouter,
  },
  {
    path: "/order",
    router: orderRouter,
  },
  {
    path: "/inventory",
    router: shopinventoryRouter,
  },
  {
    path: "/category",
    router: CategoryRouter,
  },
  {
    path: "/occasion",
    router: OccasionRouter,
  },
];

moduleRouts.forEach(({ path, router }) => {
  Routes.use(path, router);
});

export default Routes;
