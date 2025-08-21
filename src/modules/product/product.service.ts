import ProductModel from './product.model';
    import { Product } from './product.interface';

    const create = async (data: Product) => {
      const product = await ProductModel.create(data);
      return product;
    };

    const getAll = async () => {
      const products = await ProductModel.find({ isDeleted: false });
      return products;
    };

    const getById = async (id: string) => {
      const product = await ProductModel.findOne({ _id: id, isDeleted: false });
      return product;
    };

    const update = async (id: string, data: Partial<Product>) => {
      const product = await ProductModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        data,
        { new: true }
      );
      return product;
    };

    const softDelete = async (id: string) => {
      const result = await ProductModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
      return result;
    };

    const productService = {
      create,
      getAll,
      getById,
      update,
      softDelete,
    };

    export default productService;
