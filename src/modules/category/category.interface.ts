export type CategoryType = "single_layer" | "double_layer" | "3D" | "double_layer_transparent";
export interface IPrintData {
  x: number;
  y: number;
  rotation: number;
  mirror: boolean;
}

export type Category = {
  name: string;
  iconUrl: string;
  type: CategoryType;
  public_id: string;
  occasions?: string[];
  printData: IPrintData;
  serialNumber:number;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
