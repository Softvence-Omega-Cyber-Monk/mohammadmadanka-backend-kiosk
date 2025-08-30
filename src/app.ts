import express from 'express';
const app = express();
import cors from 'cors';
import globalErrorHandler from './middleware/globalErrorHandler';
import routeNotFound from './middleware/routeNotFound';
import Routes from './routes';
import cookieParser from 'cookie-parser';
import path from 'path';
import catchAsync from './util/catchAsync';
import qs from 'qs';
import bodyParser from 'body-parser';

// middleWares
app.use(express.json());
app.use(cookieParser()); 
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cors());
app.use(
  cors({
    origin: ['*', 'http://localhost:5173','https://darling-panda-d34576.netlify.app'],
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  }),
);

app.get('/', (req, res) => {
  res.send('Welcome to APP NAME server..!');
});

//  Routes
app.use('/api/v1', Routes);
// Authentication callback route (Epson authorization)
app.get('/epson/auth', (req, res) => {
  console.log("Redirecting to Epson authentication URL...   auth");
  const authUrl = `https://auth.epsonconnect.com/auth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=device`;
  console.log("Epson Auth URL:", authUrl);
  res.redirect(authUrl);
});

// Declare deviceToken at the top-level scope
let deviceToken: string | undefined;

// Epson callback URL for exchanging code for deviceToken
app.get('/api/epson/callback', catchAsync(async (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Error: No authorization code received.');
  }

  try {
    console.log("Exchanging authorization code for device token...   callback");
    const tokenResponse = await axios.post('https://auth.epsonconnect.com/auth/token', qs.stringify({
      code: code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code'
    }));

    deviceToken = (tokenResponse.data as { access_token: string }).access_token;  // Store the device token
    res.send('Authentication successful! You can now print by calling /print.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error exchanging authorization code for token.');
  }
}));

// route not found
app.use(routeNotFound);

// global error handeller
app.use(globalErrorHandler);

export default app;

