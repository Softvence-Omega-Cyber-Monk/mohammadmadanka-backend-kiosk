import InventoryModel from "./shopinventory.model";

const getByShopOwner = async (shopOwnerId: string) => {
  const inventory = await InventoryModel.find({ shopOwner: shopOwnerId })
    .populate("shopOwner")
    .populate("product") // get product details
    .lean(); // faster read
  return inventory;
};
const getAll = async () => {
  const inventories = await InventoryModel.find()
    .populate("shopOwner", "name email") // only select needed fields
    .populate("product", "category quantity") // get product details
    .lean();
  return inventories;
};

const inventoryService = {
  getByShopOwner,
  getAll,
};

export default inventoryService;