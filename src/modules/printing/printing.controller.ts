import { Request, Response } from "express";
import catchAsync from "../../util/catchAsync";
import { createPrintJob, uploadFileToEpson } from "./printing.service";


export const printDocument = catchAsync(async (req: Request, res: Response) => {
  const jobName = "tamim"
  const filePath = req.file?.path; // multer stores uploaded file path


  console.log(jobName, filePath);

  if (!jobName || !filePath) {
    return res.status(400).send({ error: "jobName and file are required" });
  }

  const jobData = await createPrintJob(jobName);
  await uploadFileToEpson(jobData.uploadUri, filePath);

  res.status(200).send({
    message: "Print job created and file uploaded successfully",
    jobId: jobData.jobId,
  });
});

