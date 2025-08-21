import TemplateModel from "../template/template.model";
import { PrintData } from "./printData.model";

const createPrintDataService = async (data: {
  templateId: string;
  quantity: number;
  insidePage?: number;
}) => {
  const findTemplate = await TemplateModel.findById(data.templateId);
  if (!findTemplate) {
    throw new Error("Template not found");
  }

  const totalPrice = findTemplate.price * data.quantity;

  const printDataExits = await PrintData.findOne({
    templateId: data.templateId,
  });

  if (printDataExits) {
    throw new Error("Template already exists");
  }
  const created = await PrintData.create({
    templateId: data.templateId,
    quantity: data.quantity,
    totalPrice: totalPrice,
    insidePage: data.insidePage, // Default to 0 if not specified
  });
  return created;
};

const getAllPrintDataService = async () => {
  return await PrintData.find().populate("templateId");
};

export const printDataService = {
  createPrintDataService,
  getAllPrintDataService,
};
