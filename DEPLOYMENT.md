# 🚀 Deployment Guide

## 🔐 Security Note

This repository does NOT include sensitive credentials. You need to set up your own:

### Required Environment Variables (backend/.env)

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id  
FIREBASE_CLIENT_EMAIL=your_firebase_service_account_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key_with_newlines_escaped"
```

### Setup Instructions

1. **Copy the template**:
   ```bash
   cp backend/.env.template backend/.env
   ```

2. **Get Firebase Credentials**:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Fill in the values in `.env`

3. **Get MongoDB Connection**:
   - Go to MongoDB Atlas dashboard
   - Get your connection string
   - Add to `.env`

4. **Enable Firebase Authentication**:
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable Google Sign-in
   - Add localhost to authorized domains

### Run the Application

```bash
# Install dependencies
cd backend && npm install
cd frontend && npm install

# Run both servers
npm run dev
```

## 🔒 Files NOT in Git

- `backend/.env` - Environment variables
- `backend/firebase-service-account.json` - Firebase credentials
- `node_modules/` - Dependencies
