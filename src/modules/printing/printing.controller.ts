import { Request, Response } from "express";
import catchAsync from "../../util/catchAsync";
import {

  createPrintJob,
  isAccessTokenValid,
  // printJobService,
  uploadFileToEpson,
} from "./printing.service";


export const printDocument = catchAsync(async (req: Request, res: Response) => {
  const { fileUrl,copies, jobName, userId } = req.body;

  console.log(fileUrl, jobName, copies, userId, "-------from controller");

  if (!jobName || !fileUrl) {
    return res.status(400).send({ error: "jobName and file are required" });
  }
  const jobData = await createPrintJob(jobName, userId,fileUrl, copies);

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
  const type = req.query.type 


  try {
    const valid = await isAccessTokenValid(userId , type);
    // console.log("Token valid:", valid);
    return res.json({ valid });
  } catch (err) {
    console.error("Error checking Epson token:", err);
    return res.status(500).json({ valid: false, error: "Server error" });
  }
}
)


