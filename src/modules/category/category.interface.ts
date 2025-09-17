export type CategoryType = "single_layer" | "double_layer" | "3D" | "double_layer_transparent";

export type Category = {
  name: string;
  iconUrl: string;
  type: CategoryType;
  public_id: string;
  occasions?: string[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
