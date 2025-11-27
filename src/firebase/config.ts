import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID",
};

// Inicializar sin duplicados
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 👈 Esto evita errores de SSR
export const auth = typeof window !== "undefined" ? getAuth(app) : null;

export const db = typeof window !== "undefined" ? getFirestore(app) : null;

// ⚠️ Si usas ensureAuthAndGetUserId, asegúrate de que también NO use SSR
export async function ensureAuthAndGetUserId() {
  if (!auth) return null;
  return auth.currentUser ? auth.currentUser.uid : null;
}