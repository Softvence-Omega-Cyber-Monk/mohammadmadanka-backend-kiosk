import InventoryModel from "./shopinventory.model";

const getByShopOwner = async (shopOwnerId: string) => {
  const inventory = await InventoryModel.find({ shopOwner: shopOwnerId })
    .populate("shopOwner")
    .populate("category")
    .lean(); // faster read
  return inventory;
};



const getAll = async () => {
  const inventories = await InventoryModel.find()
    .populate("shopOwner", "name email") // only select needed fields
    .populate("category", "name quantity") // get product details
    .lean();
  return inventories;
};

const inventoryService = {
  getByShopOwner,
  getAll,
};

export default inventoryService;