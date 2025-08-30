import { Router } from "express";
import shopinventoryController from "./shopinventory.controller";
import auth from "../../middleware/auth";
import { userRole } from "../../constents";

const shopinventoryRouter = Router();

// router.post('/create', shopinventoryController.create);
shopinventoryRouter.get("/getAll", shopinventoryController.getAll);
shopinventoryRouter.get(
  "/getByShopOwner/:id",
//   auth(userRole.shopAdmin, userRole.superAdmin),
  shopinventoryController.getByShopOwner
);
// router.put('/update/:id', shopinventoryController.update);
// router.delete('/delete/:id', shopinventoryController.softDelete);

export default shopinventoryRouter;
