import WebAddedCartModel from './webAddedCart.model';
    import { WebAddedCart } from './webAddedCart.interface';
import { uploadImgToCloudinary } from '../../util/uploadImgToCloudinary';

    const create = async ( userId: string, photo1: Express.Multer.File,photo2: Express.Multer.File ) => {
   const result1 = await uploadImgToCloudinary(photo1.filename, photo1.path);

  if (!result1.secure_url) {
    throw new Error("Photo1 upload failed.");
  }

  // Initialize print history data
  const printHistoryData: any = {
    User_id: userId,
    Imglink: result1.secure_url,
    Imgpublic_id: result1.public_id,
  };

  // Upload photo2 if provided
  if (photo2) {
    const result2 = await uploadImgToCloudinary(photo2.filename, photo2.path);
    if (!result2.secure_url) {
      throw new Error("Photo2 upload failed.");
    }

    printHistoryData.insideImgLink = result2.secure_url;
    printHistoryData.insideImgPublic_id = result2.public_id;
  }

  // Save to DB
  const addToCart = await WebAddedCartModel.create(printHistoryData);
  return addToCart;
};

    const getAll = async () => {
      const webAddedCarts = await WebAddedCartModel.find({ isDeleted: false });
      return webAddedCarts;
    };

    const getById = async (id: string) => {
      const webAddedCart = await WebAddedCartModel.findOne({ _id: id, isDeleted: false });
      return webAddedCart;
    };

    const update = async (id: string, data: Partial<WebAddedCart>) => {
      const webAddedCart = await WebAddedCartModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        data,
        { new: true }
      );
      return webAddedCart;
    };

    const softDelete = async (id: string) => {
      const result = await WebAddedCartModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
      return result;
    };

    const webAddedCartService = {
      create,
      getAll,
      getById,
      update,
      softDelete,
    };

    export default webAddedCartService;
