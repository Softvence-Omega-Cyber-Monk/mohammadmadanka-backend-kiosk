export type Order = {
  shopOwner: string;
  items: {
    product: string; // product ID
    quantity: number;
  }[];
  status: "pending" | "approved" | "delivered" | "rejected";
  approvedBy?: string | null;
  deliveredAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
