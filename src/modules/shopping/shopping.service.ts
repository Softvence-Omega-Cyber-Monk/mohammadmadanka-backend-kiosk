import ShoppingModel from './shopping.model';
    import { Shopping } from './shopping.interface';

    const create = async (data: Shopping) => {
      const shopping = await ShoppingModel.create(data);
      return shopping;
    };

    const getAll = async () => {
      const shoppings = await ShoppingModel.find({ isDeleted: false });
      return shoppings;
    };

    const getById = async (id: string) => {
      const shopping = await ShoppingModel.findOne({ _id: id, isDeleted: false });
      return shopping;
    };

    const update = async (id: string, data: Partial<Shopping>) => {
      const shopping = await ShoppingModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        data,
        { new: true }
      );
      return shopping;
    };

    const softDelete = async (id: string) => {
      const result = await ShoppingModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
      return result;
    };

    const shoppingService = {
      create,
      getAll,
      getById,
      update,
      softDelete,
    };

    export default shoppingService;
