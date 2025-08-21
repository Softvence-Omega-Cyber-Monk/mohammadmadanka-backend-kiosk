import { Router } from 'express';
    import orderController from './order.controller';

    const router = Router();

    router.post('/create', orderController.create);
    router.get('/getAll', orderController.getAll);
    router.get('/getSingle/:id', orderController.getById);
    router.put('/update/:id', orderController.update);
    router.delete('/delete/:id', orderController.softDelete);

    export default router;
