import express, { Router } from "express";
import authRouter from "../modules/auth/auth.routes";
import userRoutes from "../modules/user/user.routes";
import templateRoutes from "../modules/template/template.routes";
import placeholderRoutes from "../modules/placeholder/placeholder.routes";
import ShoppingRoutes from "../modules/shopping/shopping.routes";
import { PrintData } from "../modules/printData/printData.model";
import { printDataRouter } from "../modules/printData/printData.route";
import orderrouter from "../modules/order/order.routes";
import orderRouter from "../modules/order/order.routes";
import shopinventoryRouter from "../modules/shopinventory/shopinventory.routes";
import CategoryRouter from "../modules/category/category.routes";
import OccasionRouter from "../modules/occasion/occasion.routes";
//import PrintRouter from "../modules/print/print.routes";
import EpsonRoute from "../modules/printing/printing.route";
import stickerRoutes from "../modules/sticker/sticker.routes";
import bannerRoutes from "../modules/banner/banner.routes";
import QRrouter from "../modules/template/QrcodeImageUpload";
import printHistoryRoutes from "../modules/PrintHistory/printHistory.routes";
import webuserRoutes from "../modules/webuser/webuser.routes";
import path from "path";
import printSetting from "../modules/printSetting/printSetting.routes";

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
    path: "/webusers",
    router: webuserRoutes,
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
  {
    path: "/printing",
    router: EpsonRoute,
  },
  {
    path: "/sticker",
    router: stickerRoutes,
  },
  {
    path: "/banner",
    router: bannerRoutes,
  },
  {
    path: "/qr-upload",
    router: QRrouter,
  },
  {
    path: "/printHistory",
    router: printHistoryRoutes,
  },
  { path: "/brandImg", router: printSetting },
];

moduleRouts.forEach(({ path, router }) => {
  Routes.use(path, router);
});

export default Routes;
