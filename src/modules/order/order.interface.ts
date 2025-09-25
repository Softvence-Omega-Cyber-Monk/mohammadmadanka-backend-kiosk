export type Order = {
  shopOwner: string;
  items: {
    category: string; // product ID
    quantity: number;
  }[];
  status: "pending" | "approved" | "delivered" | "rejected";
  trackingLink?: string | null;
  trackingNumber?: string | null;
  approvedBy?: string | null;
  deliveredAt?: Date | null;
  createdAt: Date;
  isDeleted: boolean;
  updatedAt: Date;
};
