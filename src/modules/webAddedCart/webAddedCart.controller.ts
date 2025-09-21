import { Request, Response } from 'express';
    import WebAddedCartService from './webAddedCart.service';
    import catchAsync from '../../util/catchAsync';
    import sendResponse from '../../util/sendResponse';

    const create = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId || req.query.userId;

  // Multer stores files under req.files when using .fields()
  const photo1 = (req.files as { [fieldname: string]: Express.Multer.File[] })?.photo1?.[0];
  const photo2 = (req.files as { [fieldname: string]: Express.Multer.File[] })?.photo2?.[0];

  if (!photo1) {
    throw new Error("photo1 is required.");
  }

  const result = await WebAddedCartService.create(
    userId as string,
    photo1,
    photo2 // may be undefined → optional
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "PrintHistory created successfully",
    data: result,
  });
});


    const getAll = catchAsync(async (req: Request, res: Response) => {
      const result = await WebAddedCartService.getAll();
      sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'WebAddedCarts retrieved successfully',
      data: result,
      });
    });

    const getById = catchAsync(async (req: Request, res: Response) => {
      const result = await WebAddedCartService.getById(req.params.id);
      sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'WebAddedCart retrieved successfully',
      data: result,
      });
    });

    const update = catchAsync(async (req: Request, res: Response) => {
      const result = await WebAddedCartService.update(req.params.id, req.body);
      sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'WebAddedCart updated successfully',
      data: result,
      });
    });

    const softDelete = catchAsync(async (req: Request, res: Response) => {
      const result = await WebAddedCartService.softDelete(req.params.id);
      sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'WebAddedCart soft deleted successfully',
      data: result,
      });
    });

    const webAddedCartController = {
      create,
      getAll,
      getById,
      update,
      softDelete,
    };

    export default webAddedCartController;
