// frontend/src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  connectAuthEmulator,
} from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCitbPCwn9M9m3ujeu843saBknXLdMkvQU",
  authDomain: "football-game-20cc1.firebaseapp.com",
  projectId: "football-game-20cc1",
  storageBucket: "football-game-20cc1.firebasestorage.app",
  messagingSenderId: "910873225743",
  appId: "1:910873225743:web:6d366112b69b6b9da4517a",
  measurementId: "G-BPHE4WBE5J",
};

// Avoid re-initialising during hot reloads
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Optional: point to the local Auth Emulator during dev
if (import.meta?.env?.DEV) {
  try {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  } catch {}
}

// Login / logout helpers
export async function loginWithGoogle() {
  const { user } = await signInWithPopup(auth, provider);
  return user;
}
export function logout() {
  return signOut(auth);
}
export function onAuth(cb) {
  return onAuthStateChanged(auth, cb);
}

// Analytics (only if supported, avoids SSR/node errors)
export async function initAnalytics() {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
}
