import { Request, Response } from "express";
import catchAsync from "../../util/catchAsync";
import orderService from "./order.service";
import sendResponse from "../../util/sendResponse";

// Create order (shopOwner id comes from token)
const create = catchAsync(async (req: Request, res: Response) => {
  const shopOwnerId = (req as any).user.userId; // 👈 from token (auth middleware must set req.user)
  const { items } = req.body;
  const order = await orderService.create(shopOwnerId, items);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

// Get all orders
const getAll = catchAsync(async (req: Request, res: Response) => {
  const orders = await orderService.getAll();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Orders fetched successfully",
    data: orders,
  });
});

// Get order by ID
const getById = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.getById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

const update = catchAsync(async (req: Request, res: Response) => {
  // destructure status out so it can’t be updated
  const { status,amount, ...allowedUpdates } = req.body;

  const result = await orderService.update(req.params.id, allowedUpdates);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order updated successfully",
    data: result,
  });
});
// Update order status
const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const adminId = (req as any).user.userId;
  const { status } = req.body;
  const order = await orderService.updateStatus(req.params.id, status, adminId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order Status Update successfully",
    data: order,
  });
});

// Soft delete order
const softDelete = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.softDelete(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order deleted successfully",
    data: order,
  });
});

const orderController = {
  create,
  getAll,
  getById,
  updateStatus,
  softDelete,
  update,
};

export default orderController;
