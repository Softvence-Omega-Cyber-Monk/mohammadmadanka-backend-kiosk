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
      client_id: "d900dc95d086441380fd87098a326487",
      client_secret: "N7G8oZTKQ5E5v7lS_Cq044EPftc_uFI3DFtEBDoMfj_OdD2X1K5BUhYR5-sbMchowfgcjzaKNDXX8KzhScF1qw",
      redirect_uri: "https://mantelworthy.store/api/epson/callback",
      code: "DBRY_1Q-SEpbZBVcTeoJHXhJEmpJoxmaFkDbafNCLX1jL",
      grant_type: 'authorization_code', // OAuth2 grant type
    });

    // Extract device token (access token) from the response
    const { access_token: deviceToken } = tokenResponse.data;
   console.log("Data..................",tokenResponse.data);
    console.log('Device Token..............:', deviceToken);

    // Store the device token (e.g., in a session or JWT)
    // For this example, we simply return the token as a response.
    return res.status(200).json({
      message: 'Authentication successful',
      deviceToken,
    });
  } catch (error) {
    console.error('Error during token exchange:', error);
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error);
    return res.status(500).json({ message: 'Failed to authenticate', error: errorMessage });
  }
});

export { handleAuthCallback };



