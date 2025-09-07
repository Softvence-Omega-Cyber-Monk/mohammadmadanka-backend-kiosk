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
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// app.use(cors());
app.use(
  cors({
    origin: [
      "*",
      "http://localhost:5173",
      "https://velvety-quokka-7b3cf9.netlify.app",
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

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.originalUrl);
  next();
});
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
app.get(
  "/api/epson/callback",
  catchAsync(async (req: Request, res: Response) => {

    const code = req.query.code as string;
    if (!code) {
      return res.status(400).send("Missing code");
    }
    console.log("Auth code:", code);

    // Prepare Basic Auth header
    const credentials = Buffer.from(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    ).toString("base64");

    // Exchange code for token
    const tokenResponse = await fetch(
      "https://auth.epsonconnect.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.REDIRECT_URI!,
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    console.log("Token response:", tokenData);

    if (!tokenData.device_token) {
      return res
        .status(400)
        .send(`Failed to get token: ${JSON.stringify(tokenData)}`);
    }

    // Save device token in session
    (req as any).session.deviceToken = tokenData.device_token;

    // Redirect back to frontend
    res.redirect("http://localhost:5173?auth=success");
  })
);

// route not found
app.use(routeNotFound);

// global error handeller
app.use(globalErrorHandler);

export default app;
