import { Request, Response } from "express";
import catchAsync from "../../util/catchAsync";
import {

  createPrintJob,
  isAccessTokenValid,
  // printJobService,
  uploadFileToEpson,
} from "./printing.service";


export const printDocument = catchAsync(async (req: Request, res: Response) => {
  const { fileUrl,insidefileUrl,copies, jobName, userId } = req.body;

  console.log(fileUrl, jobName,insidefileUrl, copies, userId, "-------from controller");

  if (!jobName || !fileUrl) {
    return res.status(400).send({ error: "jobName and file are required" });
  }
  const jobData = await createPrintJob(jobName, userId,fileUrl, insidefileUrl, copies);

  console.log(jobData, "-------job data from controller");

  // await uploadFileToEpson(jobData.jobData.uploadUri, fileUrl);

  res.status(200).send({
    message: "Print job created and file uploaded successfully",
    jobId: jobData.jobData.jobId,
    PrinterAccessToken: jobData.accessToken,
    EPSON_API_KEY: jobData.EPSON_API_KEY,
  });
});


export async function checkAccessToken(req: Request, res: Response) {
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
