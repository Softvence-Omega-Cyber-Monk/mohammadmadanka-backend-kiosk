import express, { Request, Response } from "express";
const app = express();
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import routeNotFound from "./middleware/routeNotFound";
import Routes from "./routes";
import cookieParser from "cookie-parser";
import catchAsync from "./util/catchAsync";
import qs from "qs";
import bodyParser from "body-parser";
import PrintingTokenModel from "./modules/printing/printing.model";
import auth from "./middleware/auth";
import { userRole } from "./constents";
import multer from "multer";
import path from "path";
import fs from "fs";

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
const server = http.createServer(app);

// --- SOCKET.IO SETUP ---
const io = new SocketIOServer(server, {
  cors: {
    origin: ["*","http://localhost:5173", "https://velvety-quokka-7b3cf9.netlify.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Broadcast on new file uploaded
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

// middleWares


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
  // auth(userRole.shopAdmin, userRole.superAdmin),
  catchAsync(async (req: Request, res: Response) => {
    console.log(req.user, "user---");

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
      "https://auth.epsonconnect.com/auth/token",
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

    // Save to database
    await PrintingTokenModel.findOneAndUpdate(
      {},
      {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: new Date(Date.now() + tokenData.expires_in * 1000),
        scope: tokenData.scope,
        token_type: tokenData.token_type,
      },
      { upsert: true, new: true }
    );

    // Redirect back to frontend

    res.redirect("http://localhost:5173?auth=success");
  })
);


// ============ QR UPLOAD + FILE SHARING ============
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
const fileMap = new Map<string, string>();

// Upload endpoint
app.post(
  "/api/uploadqr/:holeId",
  upload.single("file"),
  catchAsync(async (req, res) => {
    const { holeId } = req.params;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const publicUrl = `/uploads/${req.file.filename}`;
    fileMap.set(holeId, publicUrl);

    // 🔴 Broadcast event to all connected clients
    io.emit("fileUploaded", { holeId, url: publicUrl });

    return res.json({ holeId, url: publicUrl });
  })
);

// Fetch uploaded file by holeId
app.get(
  "/api/file/:holeId",
  catchAsync(async (req, res) => {
    const { holeId } = req.params;
    const url = fileMap.get(holeId);
    return res.json(url ? { url } : {});
  })
);

// Serve uploaded files statically
app.use("/uploads", express.static(UPLOAD_DIR));


// route not found
app.use(routeNotFound);

// global error handeller
app.use(globalErrorHandler);

export default app;
