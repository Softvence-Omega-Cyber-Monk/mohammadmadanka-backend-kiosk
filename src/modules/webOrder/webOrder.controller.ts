import { Request, Response } from 'express';
    import WebOrderService from './webOrder.service';
    import catchAsync from '../../util/catchAsync';
    import sendResponse from '../../util/sendResponse';

    const create = catchAsync(async (req: Request, res: Response) => {
      const result = await WebOrderService.create(req.body);
      sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'WebOrder created successfully',
      data: result,
      });
    });

    const getAll = catchAsync(async (req: Request, res: Response) => {
      const result = await WebOrderService.getAll();
      sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'WebOrders retrieved successfully',
      data: result,
      });
    });

    const getById = catchAsync(async (req: Request, res: Response) => {
      const result = await WebOrderService.getById(req.params.id);
      sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'WebOrder retrieved successfully',
      data: result,
      });
    });

    const update = catchAsync(async (req: Request, res: Response) => {
      const result = await WebOrderService.update(req.params.id, req.body);
      sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'WebOrder updated successfully',
      data: result,
      });
    });

    const softDelete = catchAsync(async (req: Request, res: Response) => {
      const result = await WebOrderService.softDelete(req.params.id);
      sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'WebOrder soft deleted successfully',
      data: result,
      });
    });

    const webOrderController = {
      create,
      getAll,
      getById,
      update,
      softDelete,
    };

    export default webOrderController;
