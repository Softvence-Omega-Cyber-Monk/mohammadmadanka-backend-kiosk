import { Router } from 'express';
    import stickerController from './sticker.controller';

    const router = Router();

    router.post('/create', stickerController.create);
    router.get('/getAll', stickerController.getAll);
    router.get('/getSingle/:id', stickerController.getById);
    router.put('/update/:id', stickerController.update);
    router.delete('/delete/:id', stickerController.softDelete);

    export default router;
