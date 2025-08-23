import { Router } from "express";
import orderController from "./order.controller";
import auth from "../../middleware/auth";
import { userRole } from "../../constents";

const orderRouter = Router();

orderRouter.post("/create", auth(userRole.shopAdmin), orderController.create);
orderRouter.get("/getAll",auth(userRole.superAdmin), orderController.getAll);
orderRouter.get("/getSingle/:id", orderController.getById);
orderRouter.put("/update/:id", orderController.update);
orderRouter.put("/updateStatus/:id",auth(userRole.superAdmin), orderController.updateStatus);
orderRouter.delete("/delete/:id", orderController.softDelete);

export default orderRouter;
