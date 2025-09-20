import WebOrderModel from './webOrder.model';
    import { WebOrder } from './webOrder.interface';

    const create = async (data: WebOrder) => {
      const webOrder = await WebOrderModel.create(data);
      return webOrder;
    };

    const getAll = async () => {
      const webOrders = await WebOrderModel.find({ isDeleted: false });
      return webOrders;
    };

    const getById = async (id: string) => {
      const webOrder = await WebOrderModel.findOne({ _id: id, isDeleted: false });
      return webOrder;
    };

    const update = async (id: string, data: Partial<WebOrder>) => {
      const webOrder = await WebOrderModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        data,
        { new: true }
      );
      return webOrder;
    };

    const softDelete = async (id: string) => {
      const result = await WebOrderModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
      return result;
    };

    const webOrderService = {
      create,
      getAll,
      getById,
      update,
      softDelete,
    };

    export default webOrderService;
