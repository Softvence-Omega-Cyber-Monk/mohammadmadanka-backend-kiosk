import { Router } from 'express';
    import shoppingController from './shopping.controller';
    import { upload } from '../../util/uploadImgToCloudinary';

    const ShoppingRoutes = Router();

    ShoppingRoutes.post("/create",upload.fields([
    { name: "cardImgURL", maxCount: 1 },{ name: "msgImgURL", maxCount: 1 }, ]),
    shoppingController.create);
    ShoppingRoutes.get('/getAll', shoppingController.getAll);
    ShoppingRoutes.get('/getSingle/:id', shoppingController.getById);
    ShoppingRoutes.put('/update/:id', shoppingController.update);
   ShoppingRoutes.delete('/delete/:id', shoppingController.softDelete);

    export default ShoppingRoutes;
