// src/modules/printing/printing.service.ts
import fetch from 'node-fetch'; // Import fetch for making API calls
import { PrintJob } from './print.interface'; // Import the interface for the print job

export class PrintingService {
  // Create a Print Job
  public static async createPrintJob(userToken: string, filePath: string, jobName: string): Promise<PrintJob> {
    const apiUrl = 'https://api.epsonconnect.com/api/2/printing/upload'; // Endpoint for uploading the file

    // Upload the image first to Epson API
    const uploadResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'x-api-key': 'your-api-key', // Replace with your API key
      },
      body: JSON.stringify({
        File: filePath, // Pass the file path or URL
      }),
    });

    // Check if the upload was successful
    if (!uploadResponse.ok) {
      throw new Error('Failed to upload the file to Epson');
    }

    const uploadData = await uploadResponse.json();

    // Now create the print job using the uploaded file
    const printJobResponse = await fetch('https://api.epsonconnect.com/api/2/printing/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'x-api-key': 'your-api-key', // Replace with your API key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobName,
        fileId: uploadData.fileId, // The file ID returned from the upload response
        printQuality: 'normal', // You can customize the print quality
      }),
    });

    if (!printJobResponse.ok) {
      throw new Error('Failed to create print job');
    }

    const printJobData = await printJobResponse.json();

    // Return the print job details
    return {
      jobId: printJobData.jobId,
      status: printJobData.status,
      message: 'Print job successfully created',
    };
  }
}
