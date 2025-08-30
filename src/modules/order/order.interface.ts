export type Order = {
  shopOwner: string;
  items: {
    category: string; // product ID
    quantity: number;
  }[];
  status: "pending" | "approved" | "delivered" | "rejected";
  approvedBy?: string | null;
  deliveredAt?: Date | null;
  createdAt: Date;
  isDeleted: boolean;

  updatedAt: Date;
};
