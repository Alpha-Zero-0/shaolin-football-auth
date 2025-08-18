# 🔧 Firebase Google Sign-in Setup Instructions

## Error: `auth/operation-not-allowed`

This error means Google Sign-in is not enabled in your Firebase project. Here's how to fix it:

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select your project: `football-game-20cc1`

### Step 2: Enable Google Authentication
1. Go to **Authentication** → **Sign-in method**
2. Find **Google** in the providers list
3. Click **Google** to configure it
4. Toggle **Enable** to ON
5. Add your email as an authorized domain if needed
6. **Save** the changes

### Step 3: Configure Authorized Domains
Make sure these domains are in your authorized domains list:
- `localhost` (for development)
- Your production domain (when you deploy)

### Step 4: Test Again
After enabling Google Sign-in, try signing in again at http://localhost:5173

The error should be resolved once Google Sign-in is properly enabled in your Firebase console.
