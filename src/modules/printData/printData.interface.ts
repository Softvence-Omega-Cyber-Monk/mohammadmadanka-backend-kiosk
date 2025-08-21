import { Types } from "mongoose";


export type TPrintData = {
 templateId: Types.ObjectId;
 quantity: number;
 totalPrice: number;
 insidePage?: number;
};
