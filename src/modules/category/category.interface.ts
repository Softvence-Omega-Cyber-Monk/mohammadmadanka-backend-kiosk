export type CategoryType = "single_layer" | "double_layer" | "3D";

export type Category = {
  name: string;
  iconUrl: string;
  type: CategoryType;
  public_id: string;
  occasions?: string[];
  serialNumber:number;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
