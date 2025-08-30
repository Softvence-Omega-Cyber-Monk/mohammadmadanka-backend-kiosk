import { Router } from 'express';
    import placeholderController from './placeholder.controller';
import { upload } from '../../util/uploadImgToCloudinary';

    const placeholderRoutes = Router();

    placeholderRoutes.post('/upoload-placeholder', upload.single('file'), placeholderController.create);
    placeholderRoutes.get('/getAll', placeholderController.getAll);
    placeholderRoutes.get('/getSingle/:id', placeholderController.getById);
    placeholderRoutes.delete('/delete/:id', placeholderController.Delete);

    export default placeholderRoutes;
