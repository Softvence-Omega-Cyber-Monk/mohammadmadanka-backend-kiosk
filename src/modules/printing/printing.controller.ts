// src/modules/printing/printing.controller.ts

import { Request, Response } from 'express';
import axios from 'axios';
import qs from 'qs';
import { uploadFileToEpson, createPrintJob, startPrintJob } from './printing.service';
import catchAsync from '../../util/catchAsync';  // Ensure this utility is correct

let deviceToken = '';  // This could be stored in a session or DB in real-world usage

// Auth callback function after user authorization
export const authCallback = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.query;  // Get authorization code from query string

  if (!code) {
    return res.status(400).send('Error: No authorization code received.');
  }

  try {
    // Exchange authorization code for device token
    const tokenResponse = await axios.post<{ access_token: string }>('https://auth.epsonconnect.com/auth/token', qs.stringify({
      code: code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code'
    }));

    deviceToken = tokenResponse.data.access_token;  // Store device token (store it in DB or session for production)
    res.send('Authentication successful! You can now print by calling /print.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error exchanging authorization code for token.');
  }
});

// Print image method with error handling
export const printImage = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;  // Uploaded file
  const token = deviceToken;  // Retrieve deviceToken

  if (!token) {
    return res.status(401).send('Error: User not authenticated.');
  }

  try {
    // Step 1: Create the print job
    const jobResponse = await createPrintJob(token, 'ImagePrintJob', 'document') as { jobId: string; uploadUri: string };
    const { jobId, uploadUri } = jobResponse;

    // Step 2: Upload the image to Epson Connect
    await uploadFileToEpson(uploadUri, file);

    // Step 3: Start printing the image
    await startPrintJob(token, jobId);

    res.status(200).send({ message: 'Print job started successfully', jobId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while processing the print job' });
  }
});
