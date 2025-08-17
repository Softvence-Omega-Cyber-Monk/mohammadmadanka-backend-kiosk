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

export type Template = {
  _id?: string;
  previewLink: string;
  SKU?: string;
  name: string;
  link: string;
  category: string;
  occasion: string;
  targetUser: string;
  rudeContent: boolean;
  price: number;
  aspectRatio: number;
  holesInfo: HolesInfo[];
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
