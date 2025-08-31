import { Request, Response } from "express";
import catchAsync from "../../util/catchAsync";
import inventoryService from "./shopinventory.service";

const getByShopOwner = catchAsync(async (req: Request, res: Response) => {
  const shopOwnerId = req.params.id// 👈 from token
  const inventory = await inventoryService.getByShopOwner(shopOwnerId);

  res.status(200).json({
    success: true,
    message: "Inventory fetched successfully",
    data: inventory,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const inventories = await inventoryService.getAll();

  res.status(200).json({
    success: true,
    message: "All shop inventories fetched successfully",
    data: inventories,
  });
});

const inventoryController = {
  getByShopOwner,
  getAll,
};

export default inventoryController;
