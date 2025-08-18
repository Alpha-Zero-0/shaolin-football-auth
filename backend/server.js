require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { MongoClient } = require("mongodb");

// --- Firebase Admin (env-based) ---
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  }),
});

// --- MongoDB ---
const mongo = new MongoClient(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
});

const app = express();
app.use(cors({ origin: ["http://localhost:5173"], methods: ["GET","POST"] }));
app.use(express.json());

app.get("/health", (_req, res) => res.send("ok"));

async function verifyFirebaseToken(req, res, next) {
  try {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token) return res.status(401).send("Missing token");
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

app.get("/api/me", verifyFirebaseToken, (req, res) => {
  res.json({ uid: req.user.uid });
});

(async () => {
  await mongo.connect();
  app.locals.db = mongo.db(); // default DB from URI
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`API on :${port}`));
})();
