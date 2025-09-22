import { Router } from "express";
import webAddedCartController from "./webAddedCart.controller";
import { Multiupload, upload } from "../../util/uploadImgToCloudinary";

const webAddedCart = Router();

webAddedCart.post("/create", Multiupload, webAddedCartController.create);
webAddedCart.get("/getAll", webAddedCartController.getAll);
webAddedCart.get("/getSingle/:id", webAddedCartController.getById);
webAddedCart.put("/update/:id", webAddedCartController.update);
webAddedCart.delete("/delete/:id", webAddedCartController.softDelete);

export default webAddedCart;
