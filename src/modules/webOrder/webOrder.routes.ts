import { Router } from 'express';
    import webOrderController from './webOrder.controller';

    const router = Router();

    router.post('/create', webOrderController.create);
    router.get('/getAll', webOrderController.getAll);
    router.get('/getSingle/:id', webOrderController.getById);
    router.put('/update/:id', webOrderController.update);
    router.delete('/delete/:id', webOrderController.softDelete);

    export default router;
