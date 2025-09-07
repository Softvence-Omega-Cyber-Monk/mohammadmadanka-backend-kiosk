import { Request, Response } from "express";
import catchAsync from "../../util/catchAsync";
import { createPrintJob, uploadFileToEpson } from "./printing.service";


export const printDocument = catchAsync(async (req: Request, res: Response) => {
  const { jobName, filePath } = req.body;

  if (!jobName || !filePath) {
    return res.status(400).send({ error: "jobName and filePath are required" });
  }

  // Step 1: Create print job
  const jobData = await createPrintJob(jobName);

  // Step 2: Upload file
  await uploadFileToEpson(jobData.uploadUri, filePath);

  // Step 3: Respond to client
  res.status(200).send({
    message: "Print job created and file uploaded successfully",
    jobId: jobData.jobId,
  });
});
