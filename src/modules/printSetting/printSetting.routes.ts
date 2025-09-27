import { Router } from 'express';
import printSettingController from './printSetting.controller';
import { upload } from '../../util/uploadImgToCloudinary';

const printSetting = Router();

printSetting.post(
    '/brand-image',
    upload.single('file'), // field name for the image
    printSettingController.createOrReplace
);

printSetting.get('/brand-image', printSettingController.getLatest);

export default printSetting;
