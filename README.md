# Football Game Auth Integration

A full-stack application with Firebase authentication and MongoDB database integration.

## Architecture

- **Frontend**: React + Vite with Firebase Auth
- **Backend**: Node.js + Express with Firebase Admin SDK
- **Database**: MongoDB Atlas
- **Authentication**: Firebase Auth with Google Sign-in

## Features

- ✅ Firebase Authentication (Google Sign-in)
- ✅ Backend token verification
- ✅ MongoDB user storage and management
- ✅ Real-time auth state synchronization
- ✅ Error handling and loading states
- ✅ Server health monitoring

## Quick Start

### Prerequisites

1. Node.js (v14 or higher)
2. MongoDB Atlas account
3. Firebase project with Google Auth enabled

### Environment Setup

1. **Backend Environment** (`backend/.env`):
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_PRIVATE_KEY="your_private_key_with_newlines_escaped"
   ```

2. **Frontend Firebase Config** (`frontend/src/firebase.js`):
   - Update the `firebaseConfig` object with your Firebase project settings

### Installation & Running

1. **Install dependencies for both frontend and backend**:
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Run both applications** (from root directory):
   ```bash
   # Run both frontend and backend simultaneously
   npm run dev
   ```

   Or run them separately:
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend
   
   # Terminal 2 - Frontend
   npm run dev:frontend
   ```

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/health

## API Endpoints

- `GET /health` - Server health check
- `GET /api/me` - Get current user info (requires auth)
- `GET /api/profile` - Get user profile (requires auth)
- `PUT /api/profile` - Update user profile (requires auth)

## How It Works

1. **User signs in** with Google through Firebase Auth on the frontend
2. **Frontend receives** Firebase ID token
3. **API calls** include the token in Authorization header
4. **Backend verifies** the token with Firebase Admin SDK
5. **User data** is stored/retrieved from MongoDB
6. **Real-time sync** between Firebase auth state and backend data

## Development

### Project Structure
```
/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── App.jsx    # Main component
│   │   ├── firebase.js # Firebase config
│   │   └── api.js     # API utilities
│   └── package.json
├── backend/            # Express backend
│   ├── server.js      # Main server file
│   ├── .env          # Environment variables
│   └── package.json
└── package.json       # Root package.json for dev scripts
```

### Adding New Features

1. **Frontend**: Add new components in `frontend/src/`
2. **Backend**: Add new routes in `backend/server.js`
3. **API**: Update `frontend/src/api.js` for new endpoints

## Database Schema

### Users Collection
```javascript
{
  uid: String,           // Firebase UID
  email: String,         // User email
  displayName: String,   // User display name
  photoURL: String,      // Profile photo URL
  createdAt: Date,       // Account creation date
  lastLoginAt: Date,     // Last login timestamp
  preferences: Object    // User preferences (optional)
}
```

## Security

- Firebase ID tokens are verified on every API request
- CORS is configured for frontend domain only
- MongoDB connection uses secure connection string
- Environment variables protect sensitive credentials

## Troubleshooting

1. **"Missing token" error**: Make sure user is signed in
2. **CORS errors**: Check frontend URL in backend CORS config
3. **MongoDB connection**: Verify connection string and network access
4. **Firebase errors**: Check Firebase project settings and service account

## Next Steps

- Add more game-specific features
- Implement user profiles and preferences
- Add real-time features with WebSockets
- Add more authentication providers
- Implement user roles and permissions
