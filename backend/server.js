require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { MongoClient } = require("mongodb");

// --- Firebase Admin (env-based) ---
let firebaseInitialized = false;
try {
  if (process.env.FIREBASE_PRIVATE_KEY && 
      process.env.FIREBASE_PRIVATE_KEY !== "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\\n-----END PRIVATE KEY-----\\n" &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PROJECT_ID) {
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      }),
    });
    firebaseInitialized = true;
    console.log("✅ Firebase Admin initialized successfully");
  } else {
    console.log("⚠️  Firebase credentials not configured properly. Firebase features will be disabled.");
    console.log("Please update your .env file with proper Firebase service account credentials.");
  }
} catch (error) {
  console.error("❌ Firebase initialization error:", error.message);
  console.log("Firebase features will be disabled. Please check your .env file.");
}

// --- MongoDB ---
let mongo = null;
let mongoConnected = false;

const connectMongoDB = async () => {
  try {
    if (process.env.MONGO_URI && process.env.MONGO_URI !== "your_mongodb_connection_string") {
      mongo = new MongoClient(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      await mongo.connect();
      mongoConnected = true;
      console.log("✅ Connected to MongoDB");
    } else {
      console.log("⚠️  MongoDB URI not configured. Database features will be disabled.");
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("Database features will be disabled. Please check your MongoDB connection.");
  }
};

const app = express();
app.use(cors({ 
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => res.json({ 
  status: "ok", 
  timestamp: new Date().toISOString(),
  firebase: firebaseInitialized ? "enabled" : "disabled",
  mongodb: mongoConnected ? "connected" : "disconnected"
}));

// Firebase token verification middleware
async function verifyFirebaseToken(req, res, next) {
  if (!firebaseInitialized) {
    return res.status(503).json({ 
      error: "Firebase authentication not available", 
      message: "Please configure Firebase credentials" 
    });
  }

  try {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: "Missing authorization token" });
    }
    
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Get current user info
app.get("/api/me", verifyFirebaseToken, async (req, res) => {
  try {
    if (!firebaseInitialized) {
      return res.status(503).json({ error: "Firebase not available" });
    }

    // Get user info from Firebase
    const firebaseUser = await admin.auth().getUser(req.user.uid);
    
    // Check if user exists in MongoDB
    const db = app.locals.db;
    let dbUser = null;
    
    if (db) {
      dbUser = await db.collection('users').findOne({ uid: req.user.uid });
      
      // Create user in MongoDB if doesn't exist
      if (!dbUser) {
        dbUser = {
          uid: req.user.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: new Date(),
          lastLoginAt: new Date()
        };
        await db.collection('users').insertOne(dbUser);
      } else {
        // Update last login
        await db.collection('users').updateOne(
          { uid: req.user.uid },
          { $set: { lastLoginAt: new Date() } }
        );
      }
    }
    
    res.json({
      uid: req.user.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      dbUser: dbUser
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user profile
app.get("/api/profile", verifyFirebaseToken, async (req, res) => {
  try {
    const db = app.locals.db;
    const user = await db.collection('users').findOne({ uid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile
app.put("/api/profile", verifyFirebaseToken, async (req, res) => {
  try {
    const db = app.locals.db;
    const { displayName, preferences } = req.body;
    
    const updateData = {
      updatedAt: new Date()
    };
    
    if (displayName !== undefined) updateData.displayName = displayName;
    if (preferences !== undefined) updateData.preferences = preferences;
    
    const result = await db.collection('users').updateOne(
      { uid: req.user.uid },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
(async () => {
  try {
    // Try to connect to MongoDB
    await connectMongoDB();
    
    if (mongoConnected) {
      app.locals.db = mongo.db(); // default DB from URI
    }
    
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
      console.log(`\n📋 Service Status:`);
      console.log(`   Firebase: ${firebaseInitialized ? '✅ Enabled' : '❌ Disabled'}`);
      console.log(`   MongoDB:  ${mongoConnected ? '✅ Connected' : '❌ Disconnected'}`);
      if (!firebaseInitialized || !mongoConnected) {
        console.log(`\n⚠️  Please check your .env file and configure missing services.`);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    
    // Start server anyway for demonstration
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port} (limited functionality)`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
    });
  }
})();
