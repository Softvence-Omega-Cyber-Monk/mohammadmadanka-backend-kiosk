// src/modules/printing/printing.service.ts

import fs from "fs";

import { getValidAccessToken } from "./printing.utils";

// // Epson Connect API credentials
const EPSON_API_KEY = process.env.API_KEY; // Replace with your API key

// Create Epson print job
export async function createPrintJob(jobName: string) {
  console.log("job name from service ", jobName);
  const accessToken = await getValidAccessToken();
  console.log("access token from service ", accessToken);

  const response = await fetch(
    "https://api.epsonconnect.com/api/2/printing/jobs",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-key": EPSON_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobName,
        printMode: "document",
        printSettings: {
          paperSize: "ps_a4",
          paperType: "pt_plainpaper",
          borderless: false,
          printQuality: "normal",
          paperSource: "rear",
          colorMode: "color",
          copies: 1,
        },
      }),
    }
  );

  const jobData = await response.json();
  console.log("job data from service ", jobData);

  if (!jobData.uploadUri || !jobData.jobId)
    throw new Error("Failed to create print job");

  return jobData; // { jobId, uploadUri }
}

// Upload file to Epson uploadUri
export async function uploadFileToEpson(uploadUri: string, filePath: string) {
  if (!fs.existsSync(filePath)) throw new Error("File does not exist");

  const fileBuffer = fs.readFileSync(filePath);

  console.log("uploadUri  and filepath from service ", uploadUri, filePath);

  const response = await fetch(uploadUri, {
    method: "PUT",
    headers: {
      "Content-Type": "application/pdf", // change if image
      "Content-Length": fileBuffer.length.toString(),
    },
    body: fileBuffer,
  });

  if (!response.ok) throw new Error(`File upload failed: ${response.status}`);
}
