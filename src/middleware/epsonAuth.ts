// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import catchAsync from '../util/catchAsync';

// Middleware to authenticate and get the device token
export const authenticate =  catchAsync(async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming token is passed in the Authorization header as Bearer token
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized, device token missing' });
    }

    // Verify or decode the token, for example with JWT
    const decoded = await verifyToken(token); // Your JWT verification logic or any other token validation
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized, invalid token' });
    }

    // Store the decoded token or device token to use later in the route
    (req as any).user = decoded;

    next(); // Proceed to the next middleware/route
  } catch (error) {
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error);
    return res.status(500).json({ message: 'Authentication failed', error: errorMessage });
  }
});

// Helper function to verify or decode JWT or any other token (customize this as per your needs)
const verifyToken = async (token: string) => {
  try {
    // Implement your JWT verification or device token validation here (e.g., using JWT)
    // Example with JWT:
    // return jwt.verify(token, 'your_secret_key');
    // Or if you want to call Epson to verify token:
    const response = await axios.post('https://auth.epsonconnect.com/api/verify-token', {
      token,
    });
    const data = response.data as { isValid?: boolean };
    return data.isValid ? token : null; // This will return the token if it's valid or null if it's invalid
  } catch (error) {
    return null;
  }
};
