// API utilities for communicating with the backend
const API_BASE = "http://localhost:3000";

// Helper function to get Firebase token
async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  return await user.getIdToken();
}

// Generic API call helper
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = await getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error ${response.status}: ${error}`);
  }
  
  return response.json();
}

// API functions
export const api = {
  // Get current user info
  getMe: () => apiCall('/api/me'),
  
  // Get user profile
  getProfile: () => apiCall('/api/profile'),
  
  // Update user profile
  updateProfile: (data) => apiCall('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Health check
  health: () => fetch(`${API_BASE}/health`).then(r => r.json()),
};

// Import auth from firebase module
import { auth } from './firebase';
