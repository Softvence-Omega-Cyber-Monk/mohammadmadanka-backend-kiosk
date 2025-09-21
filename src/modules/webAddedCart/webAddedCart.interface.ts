export type WebAddedCart = {
      _id?: string;
      User_id: string;
      template_id: string;
      Imglink: string; 
      Imgpublic_id: string;
      insideImgLink?: string;
      insideImgPublic_id?: string;
      quantity: number;
      isDeleted?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    }
