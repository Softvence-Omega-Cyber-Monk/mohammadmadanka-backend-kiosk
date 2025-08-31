import express, { Request, Response } from "express";
const app = express();
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import routeNotFound from "./middleware/routeNotFound";
import Routes from "./routes";
import cookieParser from "cookie-parser";
import path from "path";
import catchAsync from "./util/catchAsync";
import qs from "qs";
import bodyParser from "body-parser";

// middleWares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cors());
app.use(
  cors({
    origin: [
      "*",
      "http://localhost:5173",
      "https://darling-panda-d34576.netlify.app",
    ],
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to APP NAME server..!");
});

//  Routes
app.use("/api/v1", Routes);
// Authentication callback route (Epson authorization)j
// Epson OAuth start
app.get("/epson/auth", (req, res) => {
  if (!process.env.REDIRECT_URI) {
    throw new Error("REDIRECT_URI is not defined in environment variables");
  }
  const authUrl = `https://auth.epsonconnect.com/auth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&scope=device`;
  res.redirect(authUrl);
});

// Epson OAuth callback
app.get("/api/epson/callback", catchAsync(async (req: Request, res: Response) => {
  console.log('Epson callback hit');
  const code = req.query.code as string;
  console.log(code);

  if (!code) {
    return res.status(400).send("Missing code");
  }

  // Exchange code for token
  const tokenResponse = await fetch("https://auth.epsonconnect.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.REDIRECT_URI!,
      client_id: process.env.CLIENT_ID!,
      client_secret: process.env.CLIENT_SECRET!
    })
  });

  const tokenData = await tokenResponse.json();

  // Save deviceToken in session
  // Make sure req.session exists and is typed correctly in your project setup
  (req as any).session.deviceToken = tokenData.device_token;

  // Redirect back to frontend
  res.redirect("http://localhost:5173?auth=success");
}));


// route not found
app.use(routeNotFound);

// global error handeller
app.use(globalErrorHandler);

export default app;
