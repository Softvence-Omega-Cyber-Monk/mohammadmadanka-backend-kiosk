import { Router } from 'express';
    import occasionController from './occasion.controller';
import { upload } from '../../util/uploadImgToCloudinary';

    const OccasionRouter = Router();

    OccasionRouter.post('/create',upload.single('file'), occasionController.create);
    OccasionRouter.get('/getAll/:Cid', occasionController.getAll);
    OccasionRouter.get('/names', occasionController.getAllname);
    OccasionRouter.get('/getSingle/:id', occasionController.getById);
    OccasionRouter.put('/update/:id', occasionController.update);
    OccasionRouter.delete('/delete/:id', occasionController.softDelete);

    export default OccasionRouter;
