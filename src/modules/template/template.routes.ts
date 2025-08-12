import { Router } from 'express';
    import templateController from './template.controller';
import { userRole } from '../../constents';
import auth from '../../middleware/auth';
import { upload } from '../../util/uploadImgToCloudinary';

    const templaterouter = Router();

    
    templaterouter.get('/getAll', templateController.getAll);
    templaterouter.get('/getSingle/:id', templateController.getById);
    templaterouter.put('/update/:id', templateController.update);
    templaterouter.delete('/delete/:id', templateController.softDelete);
    templaterouter.get('/getByAdmin',auth(userRole.admin), templateController.getByAdmin);
    templaterouter.get('/filter', templateController.filterTemplates);
    templaterouter.get('/getTargetUser', templateController.getTargetUser);
    templaterouter.post('/upload', upload.single('file'), templateController.uploadTemplateImage);
    templaterouter.post('/create', templateController.create);
    
    

    export default templaterouter;
