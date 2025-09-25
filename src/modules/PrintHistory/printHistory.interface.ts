export type PrintHistoryer = {
  _id?: string;
  shopId: string;
  photo1Link: string;
  photo1PublicId: string;
  photo2Link?: string;
  photo2PublicId?: string;
  templateId: string;
  categoryId: string;
  type: string;
  quantity: number;
  isReprint?: boolean;
  printStatus?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
