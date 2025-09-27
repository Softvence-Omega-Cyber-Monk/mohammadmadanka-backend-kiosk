/* eslint-disable prefer-const */
// src/modules/printing/printing.service.ts
import fs from "fs";
import axios from "axios";
import { degrees, PDFDocument, popGraphicsState, pushGraphicsState, scale, translate } from "pdf-lib";
import { getValidAccessToken } from "./printing.utils";
import PrintingTokenModel from "./printing.model";
import sharp from "sharp";
import TemplateModel from "../template/template.model";
import CategoryModel from "../category/category.model";
import PrintSettingModel from "../printSetting/printSetting.model";

interface PrintSize {
  x: number;
  y: number;
  h: number;
  w: number;
  rotation: number;
  mirror: boolean;
}

const EPSON_API_KEY = process.env.EPSON_API_KEY; // Epson API key



// 🔹 Helper: download remote file as Buffer
export async function fetchRemoteFile(url: string): Promise<Buffer> {
  try {
    const res = await axios.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
    });
    return Buffer.from(res.data);
  } catch (err) {
    console.error("❌ Failed to fetch remote file:", err);
    throw new Error("Failed to fetch remote file");
  }
}
// 🔹 Helper: merge fixed brand image + edited image into one A4 PDF
// 🔹 Helper: merge fixed brand image + edited image into one A4 PDF
async function createA4_Front_Brand(
  editedImg: string | Buffer
): Promise<Buffer> {
  const A4_WIDTH = 595.28; // A4 in points (70 dpi)
  const A4_HEIGHT = 841.89 ;
  const HALF_A4_HEIGHT = A4_HEIGHT / 2;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

  const latestBrandImage = await PrintSettingModel
  .findOne()                // get only one
  .sort({ createdAt: -1 })  // newest first
  .select('imageLink')      // only the field you need
  .lean();                  // plain JS object

  const BRAND_IMAGE_URL = latestBrandImage?.imageLink;

  // ✅ Brand image (always from URL)
  const brandImgBytes = await fetchRemoteFile(BRAND_IMAGE_URL ||"https://res.cloudinary.com/dbt83nrhl/image/upload/v1758971542/photo_2025-09-27_17-10-08_u0so9c.jpg");

  // ✅ Edited image (Buffer | URL | local path)
  let editedImgBytes: Buffer;
  if (Buffer.isBuffer(editedImg)) {
    // Already a buffer (like our JPG conversion step)
    editedImgBytes = editedImg;
  } else if (editedImg.startsWith("http")) {
    editedImgBytes = await fetchRemoteFile(editedImg);
  } else {
    editedImgBytes = fs.readFileSync(editedImg);
  }

  // Embed images
  const brandImage = await pdfDoc.embedJpg(brandImgBytes);
  const editedImage = await pdfDoc.embedJpg(editedImgBytes);

  page.drawImage(editedImage, {
    x: A4_WIDTH,
    y: HALF_A4_HEIGHT,
    width: HALF_A4_HEIGHT,
    height: A4_WIDTH,
    rotate: degrees(90),
  });

  // Draw brand image (top half)
  page.drawImage(brandImage, {
    x: A4_WIDTH,
    y: 0,
    width: HALF_A4_HEIGHT,
    height: A4_WIDTH,
    rotate: degrees(90),
  });

  // Draw edited image (bottom half)

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// 🔹 Helper: merge fixed Inside image + blank into one A4 PDF
// 🔹 Helper: merge fixed Inside image + blank into one A4 PDF
async function createA4_Inside(editedImg: string | Buffer): Promise<Buffer> {
  const A4_WIDTH = 595.28; // A4 in points (72 dpi)
  const A4_HEIGHT = 841.89; 
  const HALF_A4_HEIGHT = A4_HEIGHT / 2;
  const BORDER_PT = 2 * 28.35; // ≈ 56.7pt

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

  // ✅ Edited image (Buffer | URL | local path)
  let editedImgBytes: Buffer;
  if (Buffer.isBuffer(editedImg)) {
    // Already a buffer (like our JPG conversion step)
    editedImgBytes = editedImg;
  } else if (editedImg.startsWith("http")) {
    editedImgBytes = await fetchRemoteFile(editedImg);
  } else {
    editedImgBytes = fs.readFileSync(editedImg);
  }

  // Embed images
  const editedImage = await pdfDoc.embedJpg(editedImgBytes);

  // Image target size (bottom half, but leave border)
  const imgWidth = HALF_A4_HEIGHT - BORDER_PT * 2; // reduce both sides
  const imgHeight = A4_WIDTH - BORDER_PT * 2; // reduce top + bottom
  const imgX = A4_WIDTH - BORDER_PT; // shift right
  const imgY = HALF_A4_HEIGHT + BORDER_PT; // shift up

  // Draw edited image with border margin
  page.drawImage(editedImage, {
    x: imgX,
    y: imgY,
    width: imgWidth,
    height: imgHeight,
    rotate: degrees(90),
  });
  // half blank

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

//🔹 Helper: merge fixed Inside image + blank into one A4 PDF
async function createA4_Gift(
  editedImg: string | Buffer,
  printSize: PrintSize
): Promise<Buffer> {
  const A4_WIDTH = 612; //595.28; A4 in points (70 dpi)
  const A4_HEIGHT = 792 //841.89;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

  // ✅ Load edited image as buffer
  let editedImgBytes: Buffer;
  if (Buffer.isBuffer(editedImg)) {
    editedImgBytes = editedImg;
  } else if (typeof editedImg === "string" && editedImg.startsWith("http")) {
    editedImgBytes = await fetchRemoteFile(editedImg);
  } else {
    editedImgBytes = fs.readFileSync(editedImg as string);
  }

  // ✅ Mirror only if printSize.mirror is true
  let finalBuffer: Buffer;
  if (printSize.mirror) {
    finalBuffer = await sharp(editedImgBytes).flop().toBuffer();
  } else {
    finalBuffer = editedImgBytes;
  }

  // ✅ Embed into PDF
  const embeddedImage = await pdfDoc.embedJpg(finalBuffer);

  const DPI = 300;
  const scaleX = 72 / DPI;
  const scaleY = 72 / DPI;

  if (printSize.rotation === 0) {
    page.drawImage(embeddedImage, {
      x: printSize.x * scaleX,
      y: printSize.y * scaleY,
      width: printSize.w * scaleX,
      height: printSize.h * scaleY,
    });
  } else {
    page.drawImage(embeddedImage, {
      x: printSize.x * scaleX + printSize.h * scaleX,
      y: printSize.y * scaleY,
      width: printSize.w * scaleX,
      height: printSize.h * scaleY,
      rotate: degrees(printSize.rotation),
    });
  }

  // 🔹 TODO: add "half blank" if needed (e.g. draw white rect)

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}



/**
 * Convert PNG (or any image) to JPG buffer
 */
async function convertToJpg(imgPathOrUrl: string): Promise<Buffer> {
  let imageBuffer: Buffer;

  if (imgPathOrUrl.startsWith("http")) {
    // Fetch if URL
    const response = await fetch(imgPathOrUrl);
    imageBuffer = Buffer.from(await response.arrayBuffer());
  } else {
    // Read if local path
    const fs = await import("fs");
    imageBuffer = fs.readFileSync(imgPathOrUrl);
  }

  // Convert with sharp → JPG buffer
  return sharp(imageBuffer).jpeg().toBuffer();
}

async function buildPrintSize(
  templateId: string,
  categoryId: string
): Promise<PrintSize> {
  // Fetch template (h, w)
  const template = await TemplateModel.findById(templateId).lean();
  if (!template) {
    throw new Error("Template not found");
  }

  // Fetch category (x, y, rotation)
  const category = await CategoryModel.findById(categoryId).lean();
  if (!category || !category.printData) {
    throw new Error("Category or printData not found");
  }

  // Merge values into printSize
  const printSize: PrintSize = {
    h: template.sizeInPixel?.h ?? 3508, // fallback to 3508 if undefined
    w: template.sizeInPixel?.w ?? 2480, // fallback to 2480 if undefined
    x: category.printData.x,
    y: category.printData.y,
    rotation: category.printData.rotation,
    mirror: category.printData.mirror || false,
    
  };

  return printSize;
}

// 🔹 Create Epson Front print job
export async function createFrontPrintJob(
  jobName: string,
  userId: string,
  type: string,
  editedImgPathOrUrl: string,
  copies: number,
  printMode: "document" | "photo" = "document"
) {

  const accessToken = await getValidAccessToken(userId, type);
  console.log(accessToken, "-------access token from service");

  // ✅ Step 1: Convert image to JPG
  const jpgBuffer = await convertToJpg(editedImgPathOrUrl);

  // ✅ Step 2: Create merged A4 PDF using JPG buffer
  const pdfBuffer = await createA4_Front_Brand(jpgBuffer);

  // tamim

  // ✅ Step 3: Create Epson job
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
         jobName: "Sample Job",
        printMode: "document",
        printSettings: {
          paperSize: "ps_a4",
          paperType: "pt_photopaper",
          borderless: false,
          printQuality: "normal",
          paperSource: "rear",
          colorMode: "color",
          doubleSided: "none",
          copies: copies,
        },
      }),
    }
  );

  const jobData = await response.json();
  console.log(jobData, "-------job data from service");

  if (!jobData.uploadUri || !jobData.jobId) {
    throw new Error("Failed to create print job");
  }

  // ✅ Step 4: Upload PDF
  await uploadFileToEpson(jobData.uploadUri, pdfBuffer, "combined.pdf");

  return { jobData, accessToken, EPSON_API_KEY };
}

// 🔹 Create Epson Front print job
export async function createInsidePrintJob(
  jobName: string,
  userId: string,
  type: string,
  editedImgPathOrUrl: string,
  copies: number,
  printMode: "document" | "photo" = "document"
) {

  const accessToken = await getValidAccessToken(userId, type);
  console.log(accessToken, "-------access token from service");

  // ✅ Step 1: Convert image to JPG
  const jpgBuffer = await convertToJpg(editedImgPathOrUrl);

  // ✅ Step 2: Create merged A4 PDF using JPG buffer
  const pdfBuffer = await createA4_Inside(jpgBuffer);

  // tamim

  // ✅ Step 3: Create Epson job
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
        jobName: "Sample Job",
        printMode: "document",
        printSettings: {
          paperSize: "ps_a4",
          paperType: "pt_photopaper",
          borderless: false, // ❌ keep false since we want margins
          printQuality: "normal",
          paperSource: "front2",
          colorMode: "color",
          doubleSided: "none",
          copies: copies,
        },
      }),
    }
  );

  const jobData = await response.json();
  console.log(jobData, "-------job data from service");

  if (!jobData.uploadUri || !jobData.jobId) {
    throw new Error("Failed to create print job");
  }

  // ✅ Step 4: Upload PDF
  await uploadFileToEpson(jobData.uploadUri, pdfBuffer, "Inside.pdf");

  return { jobData, accessToken, EPSON_API_KEY };
}

// 🔹 Create Epson Front print job
export async function createGiftPrintJob(
  giftImage: string,
  copies: number,
  jobName: string,
  userId: string,
  type: string,
  categoryId: string,
  templateId: string
) {

  const accessToken = await getValidAccessToken(userId, type);
  console.log(accessToken, "-------access token from service");

  // ✅ Step 1: Convert image to JPG
  const jpgBuffer = await convertToJpg(giftImage);
  console.log(jpgBuffer, "-------jpg buffer from service");

  // ✅ Step 2: Create merged A4 PDF using JPG buffer
  const printSize = await buildPrintSize(templateId, categoryId);
  const pdfBuffer = await createA4_Gift(jpgBuffer, printSize);

  // tamim

  // ✅ Step 3: Create Epson job
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
        jobName: "JobName01",
        printMode: "document",
        printSettings: {
          paperSize: "ps_a4",
          paperType: "pt_photopaper",
          borderless: false,
          printQuality: "high",
          paperSource: "rear",
          colorMode: "color",
          copies: copies,
        },
      }),
    }
  );

  const jobData = await response.json();
  console.log(jobData, "-------job data from service");

  if (!jobData.uploadUri || !jobData.jobId) {
    throw new Error("Failed to create print job");
  }

  // ✅ Step 4: Upload PDF
  await uploadFileToEpson(jobData.uploadUri, pdfBuffer, "combined.pdf");

  return { jobData, accessToken, EPSON_API_KEY };
}

// 🔹 Upload merged PDF buffer to Epson
export async function uploadFileToEpson(
  uploadUri: string,
  pdfBuffer: Buffer,
  fileName = "1.pdf"
) {
  const uploadUrlWithFile =
    uploadUri +
    (uploadUri.includes("?") ? "&" : "?") +
    "File=" +
    encodeURIComponent(fileName);

  const putRes = await fetch(uploadUrlWithFile, {
    method: "POST",
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": pdfBuffer.length.toString(),
    },
    body: new Uint8Array(pdfBuffer),
  });

  const bodyText = await putRes.text();

  if (!putRes.ok) {
    throw new Error(`Epson upload failed: ${putRes.status} - ${bodyText}`);
  }

  console.log("✅ Epson upload successful");
}

export async function isAccessTokenValid(userId: string, type: string) {
  let tokenDoc = await PrintingTokenModel.findOne({
    userId: userId,
    Print_type: type,
  });

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
