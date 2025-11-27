import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicialización Singleton para evitar errores de reinicialización en Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

// Helper para asegurar autenticación (útil para el contexto)
export const ensureAuthAndGetUserId = async (): Promise<string> => {
  if (auth.currentUser) return auth.currentUser.uid;
  try {
    await signInAnonymously(auth);
    return auth.currentUser?.uid || '';
  } catch (error) {
    console.error("Error signing in anonymously", error);
    return '';
  }
};

export { app, auth, db }