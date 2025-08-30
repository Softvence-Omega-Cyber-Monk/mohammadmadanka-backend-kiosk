import { Router } from 'express';
    import categoryController from './category.controller';
import { upload } from '../../util/uploadImgToCloudinary';

    const CategoryRouter = Router();

    CategoryRouter.post('/create',upload.single('file'), categoryController.create);
    CategoryRouter.get('/getAll', categoryController.getAll);
    CategoryRouter.get('/names', categoryController.getAllname);

    CategoryRouter.get('/getSingle/:id', categoryController.getById);
    CategoryRouter.put('/update/:id', categoryController.update);
    CategoryRouter.delete('/delete/:id', categoryController.softDelete);

    export default CategoryRouter;



    