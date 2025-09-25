import { Router } from 'express';
    import printSettingController from './printSetting.controller';
import { upload } from '../../util/uploadImgToCloudinary';

    const printSetting = Router();

    printSetting.post('/create', upload.single("file"), printSettingController.create);


    export default printSetting;
