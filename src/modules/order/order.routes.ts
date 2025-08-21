import { Router } from 'express';
    import orderController from './order.controller';
import auth from '../../middleware/auth';
import { userRole } from '../../constents';

    const orderrouter = Router();

    orderrouter.post('/create',auth(userRole.shopAdmin), orderController.create);
    orderrouter.get('/getAll', orderController.getAll);
    //router.get('/getSingle/:id', orderController.getById);
    //router.put('/update/:id', orderController.update);
    orderrouter.delete('/delete/:id', orderController.softDelete);

    export default orderrouter;
