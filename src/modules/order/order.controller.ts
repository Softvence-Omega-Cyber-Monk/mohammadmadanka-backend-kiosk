import { Request, Response } from "express";
import orderService from "./order.service";

// Create order (shopOwner id comes from token)
const create = async (req: Request, res: Response) => {
  try {
    const shopOwnerId = (req as any).user.userId;
    console.log(shopOwnerId);
 // 👈 from token (auth middleware must set req.user)
    const { items } = req.body;
    console.log("hdschd");

    const order = await orderService.create(shopOwnerId, items);

    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders
const getAll = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getAll();
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
const getById = async (req: Request, res: Response) => {
  try {
    const order = await orderService.getById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

// Update order status
const updateStatus = async (req: Request, res: Response) => {
  try {
    const { status, adminId } = req.body;
    const order = await orderService.updateStatus(req.params.id, status, adminId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Soft delete order
const softDelete = async (req: Request, res: Response) => {
  try {
    const order = await orderService.softDelete(req.params.id);
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const orderController = {
  create,
  getAll,
  getById,
  updateStatus,
  softDelete,
};

export default orderController;
