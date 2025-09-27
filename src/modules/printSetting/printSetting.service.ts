import PrintSettingModel from './printSetting.model';
import { PrintSetting } from './printSetting.interface';
import { deleteImageFromCloudinary, uploadImgToCloudinary } from '../../util/uploadImgToCloudinary';

/**
 * Create or replace the single brand image.
 * If a record exists, delete its DB entry and Cloudinary image first,
 * then upload and save the new one.
 */
const createOrReplace = async (
  imgFile: Express.Multer.File,
  data: PrintSetting
) => {
  // 1️⃣ Find the latest/only brand image
  const existing = await PrintSettingModel.findOne().sort({ createdAt: -1 });

  // 2️⃣ If it exists, remove from Cloudinary and DB
  if (existing) {
    try {
      if (existing.public_id) {
        await deleteImageFromCloudinary(existing.public_id);
      }
      await PrintSettingModel.findByIdAndDelete(existing._id);
    } catch (err) {
      console.error('Failed to delete previous brand image:', err);
    }
  }

  // 3️⃣ Upload new image
  const result = await uploadImgToCloudinary(imgFile.filename, imgFile.path);
  if (!result.secure_url) {
    throw new Error('Image upload failed.');
  }

  data.imageLink = result.secure_url;
  data.public_id = result.public_id;

  // 4️⃣ Save new record
  const printSetting = await PrintSettingModel.create(data);
  return printSetting;
};

/**
 * Retrieve the latest/only brand image.
 */
const getLatest = async () => {
  return await PrintSettingModel.findOne().sort({ createdAt: -1 });
};

const printSettingService = {
  createOrReplace,
  getLatest,
};

export default printSettingService;
