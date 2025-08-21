import { Request, Response } from 'express';
    import ProductService from './product.service';
    import catchAsync from '../../util/catchAsync';
    import sendResponse from '../../util/sendResponse';

    const create = catchAsync(async (req: Request, res: Response) => {
      const result = await ProductService.create(req.body);
      sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Product created successfully',
      data: result,
      });
    });

    const getAll = catchAsync(async (req: Request, res: Response) => {
      const result = await ProductService.getAll();
      sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Products retrieved successfully',
      data: result,
      });
    });

    const getById = catchAsync(async (req: Request, res: Response) => {
      const result = await ProductService.getById(req.params.id);
      sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Product retrieved successfully',
      data: result,
      });
    });

    const update = catchAsync(async (req: Request, res: Response) => {
      const result = await ProductService.update(req.params.id, req.body);
      sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Product updated successfully',
      data: result,
      });
    });

    const softDelete = catchAsync(async (req: Request, res: Response) => {
      const result = await ProductService.softDelete(req.params.id);
      sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Product soft deleted successfully',
      data: result,
      });
    });

    const productController = {
      create,
      getAll,
      getById,
      update,
      softDelete,
    };

    export default productController;
