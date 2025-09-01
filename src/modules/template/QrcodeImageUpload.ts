import { Router, Request, Response } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import { request } from "node:http";
import catchAsync from "../../util/catchAsync";

const QRrouter = Router();

// Ensure uploads folder exists
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `${uuidv4()}${ext}`);
  },
});
const upload = multer({ storage });

type SessionRecord = { photoUrl?: string; createdAt: number };
const sessions = new Map<string, SessionRecord>();

// TTL cleanup
const TTL = 15 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [id, rec] of sessions) {
    if (now - rec.createdAt > TTL) sessions.delete(id);
  }
}, 60 * 1000);

// 1. Create a new session
QRrouter.post("/session", (_req, res) => {
  const id = uuidv4();
  sessions.set(id, { createdAt: Date.now() });
  console.log(`Created session ${id}`);
  res.json({ id });
});

// 2. Mobile upload page (simple HTML form)
QRrouter.get("/upload/:sessionId", catchAsync(async (req: Request, res: Response) => {
  console.log("Upload endpoint hit");

  const { sessionId } = req.params;
  if (!sessions.has(sessionId)) {
    return res.status(404).send("Invalid or expired session");
  }
  res.send(`
    <h3>Upload a Photo</h3>
    <form action="https://mohammadmadanka-backend-kiosk.onrender.com/api/v1/qr-upload/upload/${sessionId}" method="POST" enctype="multipart/form-data">
      <input type="file" name="photo" accept="image/*" />
      <button type="submit">Upload</button>
    </form>
  `);
}));

// 3. Handle file upload
QRrouter.post("/upload/:sessionId", upload.single("photo"), catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const rec = sessions.get(sessionId);
  if (!rec) return res.status(404).json({ message: "Invalid session" });
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const photoUrl = `/uploads/${req.file.filename}`;
  rec.photoUrl = photoUrl;
  sessions.set(sessionId, rec);
  res.json({ photoUrl });
}));

// 4. Poll for photo
QRrouter.get("/photo/:sessionId", catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const rec = sessions.get(sessionId);
  if (!rec) return res.status(404).json({ message: "Invalid session" });
  res.json({ photoUrl: rec.photoUrl || null });
}));

export default QRrouter;
