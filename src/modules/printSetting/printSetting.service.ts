import PrintSettingModel from './printSetting.model';
    import { PrintSetting } from './printSetting.interface';
import { uploadImgToCloudinary } from '../../util/uploadImgToCloudinary';

    const create = async (imgFile: Express.Multer.File, data: PrintSetting) => {
    const result = await uploadImgToCloudinary(imgFile.filename, imgFile.path);
      if (!result.secure_url) {
        throw new Error("Image upload failed.");
      }
      data.imageLink = result.secure_url;
      data.public_id = result.public_id;
      
      const printSetting = await PrintSettingModel.create(data);
      return printSetting;
    };

   
    const printSettingService = {
      create,
    };

    export default printSettingService;
