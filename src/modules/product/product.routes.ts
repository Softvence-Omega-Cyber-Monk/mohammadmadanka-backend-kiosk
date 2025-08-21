import { Router } from 'express';
    import productController from './product.controller';
import auth from '../../middleware/auth';
import { userRole } from '../../constents';

    const productRouter = Router();

    productRouter.post('/create',auth(userRole.superAdmin), productController.create);
    productRouter.get('/getAll',auth(userRole.superAdmin), productController.getAll);
    productRouter.get('/getSingle/:id', productController.getById);
    productRouter.put('/update/:id', productController.update);
    productRouter.delete('/delete/:id', productController.softDelete);

    export default productRouter;
