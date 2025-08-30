import { Request, Response } from 'express';
import axios from 'axios';
import catchAsync from '../../../util/catchAsync';

interface TokenResponse {
  access_token: string;  // The field for the access token
}

// Step 1: Redirect to Epson OAuth2 Authorization URL
const redirectToAuth = catchAsync(async (req: Request, res: Response) => {
  const { CLIENT_ID, REDIRECT_URI } = process.env;

  const authorizationUrl = `https://auth.epsonconnect.com/auth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=device`;

  // Redirect the user to the Epson authorization page
  res.redirect(authorizationUrl);
});

export { redirectToAuth };

const handleAuthCallback = catchAsync(async (req: Request, res: Response) => {
  const authorizationCode = req.query.code as string; // Capture the authorization code

  if (!authorizationCode) {
    return res.status(400).json({ message: 'Authorization code is missing' });
  }

  try {
    const tokenResponse = await axios.post<TokenResponse>('https://auth.epsonconnect.com/auth/token', {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      code: authorizationCode,
      grant_type: 'authorization_code', // OAuth2 grant type
    });

    // Extract device token (access token) from the response
    const { access_token: deviceToken } = tokenResponse.data;

    if (!deviceToken) {
      throw new Error('Access token not found in the response');
    }

    console.log("Authentication successful");
    console.log('Device Token:', deviceToken);

    // Store the device token (e.g., in a session, JWT, or database)
    // For this example, we simply return the token as a response.
    return res.status(200).json({
      message: 'Authentication successful',
      deviceToken,
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null) {
      const err = error as { response?: { data?: any }, message?: string };
      console.error('Error during token exchange:', err.response?.data || err.message);
      const errorMessage = 'message' in err && err.message
        ? err.message
        : String(error);
      return res.status(500).json({
        message: 'Failed to authenticate',
        error: errorMessage,
      });
    } else {
      console.error('Error during token exchange:', String(error));
      return res.status(500).json({
        message: 'Failed to authenticate',
        error: String(error),
      });
    }
  }
});
export { handleAuthCallback };



