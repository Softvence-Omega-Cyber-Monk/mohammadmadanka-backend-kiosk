// src/modules/printing/printing.service.ts

import axios from 'axios';
import fs from 'fs';
import { Request, Response } from 'express';

// Epson Connect API credentials
const API_KEY = process.env.API_KEY;  // Replace with your API key

// Create a printing job on EpsonConnect
export const createPrintJob = async (deviceToken: string, jobName: string, printMode: string) => {
  const printSettings = {
    paperSize: 'ps_a4',
    paperType: 'pt_plainpaper',
    borderless: false,
    printQuality: 'normal',
    paperSource: 'front2',
    colorMode: 'color',
    doubleSided: 'none',
    reverseOrder: false,
    copies: 1,
    collate: false,
  };

  try {
    const response = await axios.post(
      'https://api.epsonconnect.com/api/2/printing/jobs',
      {
        jobName,
        printMode,
        printSettings,
      },
      {
        headers: {
          Authorization: `Bearer ${deviceToken}`,
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating print job', error);
    throw error;
  }
};

// Upload the file to Epson Connect
export const uploadFileToEpson = async (uploadUri: string, file: any) => {
  try {
    const filePath = file.path;  // Path to the uploaded file

    await axios.post(uploadUri, fs.createReadStream(filePath), {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
  } catch (error) {
    console.error('Error uploading file to Epson Connect', error);
    throw error;
  }
};

// Start the print job
export const startPrintJob = async (deviceToken: string, jobId: string) => {
  try {
    await axios.post(
      `https://api.epsonconnect.com/api/2/printing/jobs/${jobId}/print`,
      {},
      {
        headers: {
          Authorization: `Bearer ${deviceToken}`,
          'x-api-key': API_KEY,
        },
      }
    );
  } catch (error) {
    console.error('Error starting print job', error);
    throw error;
  }
};
