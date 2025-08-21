import { Request, Response } from "express";
import orderService from "./order.service";

export const OrderController = {
  // POST /orders
  async create(req: Request, res: Response) {
    try {
      const shopOwnerId = (req as any).user.id; // 👈 from token
      const { items } = req.body;

      const order = await orderService.create(shopOwnerId, items);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  // GET /orders
  async getAll(req: Request, res: Response) {
    try {
      const orders = await orderService.getAll();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // GET /orders/:id
  async getById(req: Request, res: Response) {
    try {
      const order = await orderService.getById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json(order);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  },

  // PATCH /orders/:id/status
  async updateStatus(req: Request, res: Response) {
    try {
      const { status, adminId } = req.body;
      const order = await orderService.updateStatus(req.params.id, status, adminId);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  // DELETE /orders/:id (soft delete)
  async softDelete(req: Request, res: Response) {
    try {
      const order = await orderService.softDelete(req.params.id);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};
