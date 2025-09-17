// src/modules/printing/printing.service.ts
import fs from "fs";
import axios from "axios";
import { degrees, PDFDocument } from "pdf-lib";
import { getValidAccessToken } from "./printing.utils";
import PrintingTokenModel from "./printing.model";
import sharp from "sharp";

const EPSON_API_KEY = process.env.EPSON_API_KEY; // Epson API key
const BRAND_IMAGE_URL =
  process.env.BRAND_IMAGE_URL ||
  "https://res.cloudinary.com/dbt83nrhl/image/upload/v1757415535/back-Card_lownyt.jpg"; // fixed brand image URL

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
async function createA4_Front_Brand(editedImg: string | Buffer): Promise<Buffer> {
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  const HALF_A4_HEIGHT = A4_HEIGHT / 2;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

  // ✅ Brand image (always from URL)
  const brandImgBytes = await fetchRemoteFile(BRAND_IMAGE_URL);

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
async function createA4_Inside(editedImg: string | Buffer): Promise<Buffer> {
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  const HALF_A4_HEIGHT = A4_HEIGHT / 2;

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


 // Draw edited image (bottom half)
  page.drawImage(editedImage, {
    x: A4_WIDTH,
    y: HALF_A4_HEIGHT,
    width: HALF_A4_HEIGHT,
    height: A4_WIDTH,
    rotate: degrees(90),
  });

  // half blank

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// 🔹 Helper: merge fixed Inside image + blank into one A4 PDF
async function createA4_Gift(editedImg: string | Buffer): Promise<Buffer> {
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  const HALF_A4_HEIGHT = A4_HEIGHT / 2;

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


 // Draw edited image (bottom half)
  page.drawImage(editedImage, {
    x: 0,
    y: 0,
    width: A4_WIDTH,
    height: A4_HEIGHT,
  });

  // half blank

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// // 🔹 Helper: merge fixed brand image + edited image into one A4 PDF
// async function createA4WithInside(editedImg: string | Buffer): Promise<Buffer> {
//   const A4_WIDTH = 595.28;
//   const A4_HEIGHT = 841.89;
//   const HALF_A4_HEIGHT = A4_HEIGHT / 2;

//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

//   // ✅ Edited image (Buffer | URL | local path)
//   let editedImgBytes: Buffer;
//   if (Buffer.isBuffer(editedImg)) {
//     // Already a buffer (like our JPG conversion step)
//     editedImgBytes = editedImg;
//   } else if (editedImg.startsWith("http")) {
//     editedImgBytes = await fetchRemoteFile(editedImg);
//   } else {
//     editedImgBytes = fs.readFileSync(editedImg);
//   }

//   // Embed images
//   const editedImage = await pdfDoc.embedJpg(editedImgBytes);

//   // Draw brand image (top half)
//   page.drawImage(editedImage, {
//     x: A4_WIDTH,
//     y: 0,
//     width: HALF_A4_HEIGHT,
//     height: A4_WIDTH,
//     rotate: degrees(90),
//   });

//   // Draw edited image (bottom half)

//   const pdfBytes = await pdfDoc.save();
//   return Buffer.from(pdfBytes);
// }

// async function mergePdfBuffers(buffers: Buffer[]): Promise<Buffer> {
//   const mergedPdf = await PDFDocument.create();

//   for (const buffer of buffers) {
//     const pdf = await PDFDocument.load(buffer);
//     const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
//     copiedPages.forEach((p) => mergedPdf.addPage(p));
//   }

//   const mergedBytes = await mergedPdf.save();
//   return Buffer.from(mergedBytes);
// }

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






// 🔹 Create Epson Front print job
export async function createFrontPrintJob(
  jobName: string,
  userId: string,
  editedImgPathOrUrl: string,
  copies: number,
  printMode: "document" | "photo" = "document"
) {
  console.log("Creating print job:", jobName);

  const accessToken = await getValidAccessToken(userId);
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
          copies: 1,
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





// 🔹 Create Epson Inside print job
export async function createInsidePrintJob(
  jobName: string,
  userId: string,
  editedImgPathOrUrl: string,
  copies: number,
  printMode: "document" | "photo" = "document"
) {
  console.log("Creating print job:", jobName);

  const accessToken = await getValidAccessToken(userId);
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
          paperType: "pt_plainpaper",
          borderless: false,
          printQuality: "normal",
          paperSource: "front2",
          colorMode: "color",
          doubleSided: "none",
          copies: 1,
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
  jobName: string,
  userId: string,
  editedImgPathOrUrl: string,
  copies: number,
  printMode: "document" | "photo" = "document"
) {
  console.log("Creating print job:", jobName);

  const accessToken = await getValidAccessToken(userId);
  console.log(accessToken, "-------access token from service");

  // ✅ Step 1: Convert image to JPG
  const jpgBuffer = await convertToJpg(editedImgPathOrUrl);

  // ✅ Step 2: Create merged A4 PDF using JPG buffer
  const pdfBuffer = await createA4_Gift(jpgBuffer);

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
          copies: 1,
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
  console.log("Epson upload status:", putRes.status, putRes.statusText);
  console.log("Epson upload body:", bodyText);

  if (!putRes.ok) {
    throw new Error(`Epson upload failed: ${putRes.status} - ${bodyText}`);
  }

  console.log("✅ Epson upload successful");
}

export async function isAccessTokenValid(userId: string) {
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

// export const printJobService = async (jobId: string,userId:string) => {

//   console.log('from service of printing ',jobId,userId,'------------------')

//   const token = await PrintingTokenModel.findOne({userId:userId});

//   try {
//     const EPSON_API_KEY = process.env.EPSON_API_KEY!;
//     const deviceToken = token?.access_token;

//     const response = await axios.post(
//       `https://api.epsonconnect.com/api/2/printing/jobs/${jobId}/print`,
//       {}, // empty body
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${deviceToken}`,
//           "x-api-key": EPSON_API_KEY,
//         },
//       }
//     );

//     console.log('finished prinsting',response.data )

//     return response.data;
//   } catch (error: any) {
//     console.error(
//       "Printing Service Error:",
//       error.response?.data || error.message
//     );
//     throw new Error("Printing failed");
//   }
// };
