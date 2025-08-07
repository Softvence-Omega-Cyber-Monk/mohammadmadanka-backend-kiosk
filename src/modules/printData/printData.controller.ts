// controllers/printData.controller.ts
import { Request, Response } from "express";
import { printDataService } from "./printData.service";
import exp from "constants";


 const createPrintData = async (req: Request, res: Response) => {
  try {

    const result = await printDataService.createPrintDataService(req.body);

    res.status(201).json({
      success: true,
      message: "Print data created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err?.message || "Validation or creation failed",
    });
  }
};

 const getAllPrintData = async (req: Request, res: Response) => {
  try {
    const data = await printDataService.getAllPrintDataService();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong",
    });
  }
};


export const printDataController = {
  createPrintData,
  getAllPrintData,
};
