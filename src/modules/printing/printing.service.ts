// src/modules/printing/printing.service.ts
import fs from "fs";
import path from "path";
import axios from "axios";
import { PDFDocument } from "pdf-lib";
import { getValidAccessToken } from "./printing.utils";
import PrintingTokenModel from "./printing.model";
import jwt from "jsonwebtoken";

const EPSON_API_KEY = process.env.EPSON_API_KEY; // Epson API key

// Create Epson print job
export async function createPrintJob(
  jobName: string,
  userId: string,
  printMode: "document" | "photo" = "document"
) {
  console.log("Creating print job:", jobName);

  const accessToken = await getValidAccessToken(userId);
  console.log("Access token:", accessToken);

  const response = await fetch(
    "https://api.epsonconnect.com/api/2/printing/jobs",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-key": EPSON_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobName,
        printMode,
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
  console.log("Print job created:", jobData);

  if (!jobData.uploadUri || !jobData.jobId) {
    throw new Error("Failed to create print job");
  }

  return jobData; // { jobId, uploadUri }
}

export async function uploadFileToEpson(
  uploadUri: string,
  filePathOrUrl: string,
  fileName = "1.pdf"
) {
  // 1) prepare PDF bytes (Buffer)
  let pdfBuffer: Buffer;

  const ext = path.extname(filePathOrUrl).toLowerCase();

  if (
    filePathOrUrl.startsWith("http://") ||
    filePathOrUrl.startsWith("https://")
  ) {
    // remote file -> download
    const res = await axios.get(filePathOrUrl, { responseType: "arraybuffer" });
    const downloaded = Buffer.from(res.data);

    if (ext === ".pdf") {
      // already a PDF
      pdfBuffer = downloaded;
    } else {
      // it's an image -> convert to PDF in-memory
      const pdfDoc = await PDFDocument.create();
      const embeddedImage =
        ext === ".jpg" || ext === ".jpeg" || ext === "png"
          ? await pdfDoc.embedJpg(downloaded)
          : await pdfDoc.embedPng(downloaded);
      const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: embeddedImage.width,
        height: embeddedImage.height,
      });
      const pdfBytes = await pdfDoc.save();
      pdfBuffer = Buffer.from(pdfBytes);
    }
  } else {
    // local path -> read from disk
    if (!fs.existsSync(filePathOrUrl))
      throw new Error("Local file not found: " + filePathOrUrl);
    const fileData = fs.readFileSync(filePathOrUrl);

    if (ext === ".pdf") {
      pdfBuffer = Buffer.from(fileData);
    } else {
      // convert image to PDF
      const pdfDoc = await PDFDocument.create();
      const embeddedImage =
        ext === ".jpg" || ext === ".jpeg"
          ? await pdfDoc.embedJpg(fileData)
          : await pdfDoc.embedPng(fileData);
      const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: embeddedImage.width,
        height: embeddedImage.height,
      });
      const pdfBytes = await pdfDoc.save();
      pdfBuffer = Buffer.from(pdfBytes);
    }
  }

  // 2) Build upload URL exactly as docs: <uploadUri>&File=1.pdf
  // Do NOT alter or encode the full uploadUri; only encode the filename.
  const uploadUrlWithFile =
    uploadUri +
    (uploadUri.includes("?") ? "&" : "?") +
    "File=" +
    encodeURIComponent(fileName);

  console.log("Uploading to Epson URL:", uploadUrlWithFile);
  console.log("PDF size (bytes):", pdfBuffer.length);

  // 3) POST binary PDF to that URL per Epson docs
  const putRes = await fetch(uploadUrlWithFile, {
    method: "POST", // IMPORTANT: POST, not PUT
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": pdfBuffer.length.toString(),
    },
    body: pdfBuffer,
  });

  console.log(putRes, "putRes");
  // helpful debug output
  const bodyText = await putRes.text();
  console.log("Epson upload status:", putRes.status, putRes.statusText);
  console.log("Epson upload body:", bodyText);

  if (!putRes.ok) {
    throw new Error(`Epson upload failed: ${putRes.status} - ${bodyText}`);
  }

  console.log("✅ Epson upload successful");
}

export async function isAccessTokenValid(userId) {
  let tokenDoc = await PrintingTokenModel.findOne({ userId: userId });

  if (!tokenDoc) return false;

  if (tokenDoc.expires_in >= new Date()) return true;

  if (tokenDoc.expires_in <= new Date()) {
    console.log("Access token expired, refreshing...");

    try {
      const credentials = Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
      ).toString("base64");

      const res = await fetch("https://auth.epsonconnect.com/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: tokenDoc.refresh_token,
        }),
      });

      const newToken = await res.json();

      console.log("new token ", newToken);

      // Update DB
      tokenDoc.access_token = newToken.access_token;
      tokenDoc.refresh_token = newToken.refresh_token;
      tokenDoc.expires_in = new Date(Date.now() + newToken.expires_in * 1000);

      await tokenDoc.save();

      return true; // refreshed successfully
    } catch (err: any) {
      console.error("Failed to refresh Epson token:", err.response);
      return false;
    }
  }
}
