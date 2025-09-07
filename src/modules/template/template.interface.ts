import { Category } from "../category/category.interface";
import { Occasion } from "../occasion/occasion.interface";

export type Hole = {
  x: number;
  y: number;
  height: number;
  width: number;
};

export type PhotoHole = Hole & {
  placeholderLink: string;
};

export type TextHole = Hole & {
  placeholderText: string;
  font: string;
  fontSize: number;
  color: string;  
};

export type HolesInfo = {
  photoHoles: PhotoHole[];
  textHoles: TextHole[];
};

export type TemplateCofig= {
  x: number;
  y: number;
  height: number;
  width: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}

export type Template = {
  _id?: string;
  previewLink: string;
  SKU?: string;
  name: string;
  link: string;
  productlink?:string;
  config?: TemplateCofig;
  category: Category;
  occasion?: Occasion;
  targetUser: string;
  rudeContent: boolean;
  price: number;
  aspectRatio: number;
  holesInfo: HolesInfo[];
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
