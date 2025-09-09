import { Request, Response } from "express";
import catchAsync from "../../util/catchAsync";
import { createPrintJob, isAccessTokenValid, uploadFileToEpson } from "./printing.service";

export const printDocument = catchAsync(async (req: Request, res: Response) => {
 
     const { fileUrl, jobName } = req.body;


console.log(fileUrl,jobName,'--------------------')

  if (!jobName || !fileUrl) {
    return res.status(400).send({ error: "jobName and file are required" });
  }

  const jobData = await createPrintJob(jobName);
  
  await uploadFileToEpson(jobData.uploadUri, fileUrl);

  res.status(200).send({
    message: "Print job created and file uploaded successfully",
    jobId: jobData.jobId,
  });
});






export async function checkAccessToken(req: Request, res: Response) {
  try {
    const valid = await isAccessTokenValid();
    console.log("Token valid:", valid);
    return res.json({ valid });
  } catch (err) {
    console.error("Error checking Epson token:", err);
    return res.status(500).json({ valid: false, error: "Server error" });
  }
}