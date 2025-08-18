# Setup Guide: Complete Firebase & MongoDB Configuration

## 🎯 Current Status

Your application is successfully integrated! Here's what's working:

✅ **Frontend & Backend Communication** - Both servers are running and communicating  
✅ **Project Structure** - All files are properly organized  
✅ **Error Handling** - Graceful fallbacks when services aren't configured  
✅ **Development Environment** - Hot reloading and development servers  

## 🔧 What Needs Configuration

❌ **Firebase Authentication** - Requires proper service account credentials  
❌ **MongoDB Database** - Connection issues need to be resolved  

## 📋 Step-by-Step Configuration

### 1. Firebase Setup

#### A. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `football-game-20cc1`
3. Go to **Project Settings** → **Service Accounts**
4. Click **"Generate new private key"**
5. Download the JSON file

#### B. Extract Credentials from JSON

Your downloaded JSON file will look like this:
```json
{
  "type": "service_account",
  "project_id": "football-game-20cc1",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADA...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@football-game-20cc1.iam.gserviceaccount.com",
  "client_id": "...",
  // ... other fields
}
```

#### C. Update Backend .env File

Replace the values in `/backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb+srv://Xuan:1128@shaolin-football.wc2m51u.mongodb.net/?retryWrites=true&w=majority&appName=Shaolin-Football
FIREBASE_PROJECT_ID=football-game-20cc1
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@football-game-20cc1.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**Important**: 
- Replace `xxxxx` with your actual service account ID
- Copy the ENTIRE private key (including `\n` characters)
- Keep the quotes around the private key

### 2. MongoDB Atlas Setup

#### Option A: Fix Current Connection

Your current MongoDB URI seems to have SSL/TLS issues. Try these fixes:

1. **Update MongoDB Driver** (if needed):
   ```bash
   cd backend
   npm update mongodb
   ```

2. **Alternative Connection String** (try this format):
   ```env
   MONGO_URI=mongodb+srv://Xuan:1128@shaolin-football.wc2m51u.mongodb.net/footballgame?retryWrites=true&w=majority
   ```

#### Option B: MongoDB Atlas Network Access

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Select your cluster: `Shaolin-Football`
3. Go to **Network Access** → **IP Access List**
4. Add your current IP address or use `0.0.0.0/0` for development

#### Option C: Create New Database User

1. Go to **Database Access** → **Database Users**
2. Create a new user with read/write permissions
3. Update your connection string with new credentials

### 3. Test the Configuration

After updating your `.env` file:

1. **Restart the backend server**:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   cd backend
   npm start
   ```

2. **Check the health endpoint**:
   ```bash
   curl http://localhost:3000/health
   ```

   You should see:
   ```json
   {
     "status": "ok",
     "firebase": "enabled",
     "mongodb": "connected"
   }
   ```

3. **Test authentication** on the frontend at http://localhost:5173

## 🚀 Quick Start (Current Working State)

Even without Firebase/MongoDB configured, you can run the application:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Visit: http://localhost:5173

## 🛠️ Development Commands

```bash
# Run both servers simultaneously (from root directory)
npm run dev

# Run individually
npm run dev:backend    # Backend only
npm run dev:frontend   # Frontend only

# Build for production
npm run build

# Start production server
npm start
```

## 🔍 Troubleshooting

### Firebase Issues
- **"Invalid PEM formatted message"**: Check private key format in .env
- **"Invalid credential"**: Verify service account JSON values
- **"Permission denied"**: Check Firebase project permissions

### MongoDB Issues  
- **Connection timeout**: Check network access/IP whitelist
- **Authentication failed**: Verify username/password
- **SSL/TLS errors**: Try alternative connection string formats

### General Issues
- **CORS errors**: Frontend/backend URLs should match
- **Port conflicts**: Make sure ports 3000 and 5173 are available
- **Module errors**: Run `npm install` in both directories

## 📞 Need Help?

If you encounter issues:

1. Check the server console logs
2. Verify all environment variables
3. Test each service individually
4. Check Firebase/MongoDB dashboard for status

The integration is complete - you just need to configure the external services! 🎉
