import { Request, Response } from "express";
import catchAsync from "../../util/catchAsync";
import {

  createFrontPrintJob,
  createGiftPrintJob,
  createInsidePrintJob,
  isAccessTokenValid,
  // printJobService,
  uploadFileToEpson,
} from "./printing.service";

export const printFrontImage = catchAsync(async (req: Request, res: Response) => {
  const { frontImage, copies, jobName, userId } = req.body;

  console.log(frontImage, jobName, copies, userId, "-------from controller");

  if (!jobName || !frontImage) {
    return res.status(400).send({ error: "jobName and file are required" });
  }
  const jobData = await createFrontPrintJob(jobName, userId,frontImage, copies);

  console.log(jobData, "-------job data from controller");

  // await uploadFileToEpson(jobData.jobData.uploadUri, fileUrl);

  res.status(200).send({
    message: "Print job created and file uploaded successfully",
    jobId: jobData.jobData.jobId,
    PrinterAccessToken: jobData.accessToken,
    EPSON_API_KEY: jobData.EPSON_API_KEY,
  });
});

export const printInsideImage = catchAsync(async (req: Request, res: Response) => {
  const { insideImage, copies, jobName, userId } = req.body;

  console.log(insideImage, jobName, copies, userId, "-------from controller");

  if (!jobName || !insideImage) {
    return res.status(400).send({ error: "jobName and file are required" });
  }
  const jobData = await createInsidePrintJob(jobName, userId,insideImage, copies);

  console.log(jobData, "-------job data from controller");

  // await uploadFileToEpson(jobData.jobData.uploadUri, fileUrl);

  res.status(200).send({
    message: "Print job created and file uploaded successfully",
    jobId: jobData.jobData.jobId,
    PrinterAccessToken: jobData.accessToken,
    EPSON_API_KEY: jobData.EPSON_API_KEY,
  });
});

export const printGift = catchAsync(async (req: Request, res: Response) => {
  const { giftImage, copies, jobName, userId } = req.body;

  console.log(giftImage, jobName, copies, userId, "-------from controller");

  if (!jobName || !giftImage) {
    return res.status(400).send({ error: "jobName and file are required" });
  }
  const jobData = await createGiftPrintJob(jobName, userId,giftImage, copies);

  console.log(jobData, "-------job data from controller");

  // await uploadFileToEpson(jobData.jobData.uploadUri, fileUrl);

  res.status(200).send({
    message: "Print job created and file uploaded successfully",
    jobId: jobData.jobData.jobId,
    PrinterAccessToken: jobData.accessToken,
    EPSON_API_KEY: jobData.EPSON_API_KEY,
  });
});


export const checkAccessToken = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const valid = await isAccessTokenValid(userId);
    // console.log("Token valid:", valid);
    return res.json({ valid });
  } catch (err) {
    console.error("Error checking Epson token:", err);
    return res.status(500).json({ valid: false, error: "Server error" });
  }
}
)

// export const printJobController = async (req: Request, res: Response) => {
//   try {

//     console.log('inside print job controller')
//     const userId = req.query.userId;
//     const { jobId } = req.body;

//     console.log(userId, jobId, "---------------from controller ---");
//     if (!jobId) return res.status(400).json({ error: "jobId is required" });

//     const result = await printJobService(jobId, userId as string);
//     res.json(result);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message || "Printing failed" });
//   }
// };
