import mongoose from "mongoose";

export type Shopping = {
  UserName: string;
  template_id: mongoose.Types.ObjectId; // Reference to Template
  price: number;
  cardImgURL:string;
  msgImgURL:string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
