import { db, doc, getDoc, setDoc, serverTimestamp } from "../../config/firebase-config.js";
import { hashPin, verifyPin } from "./crypto.js";

const SESSION_KEY = "chaos_admin_session";
const SESSION_HOURS = 2;

export function requireAdminSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) {
    location.href = "/admin/login.html";
    return false;
  }
  try {
    const s = JSON.parse(raw);
    if (Date.now() > s.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      location.href = "/admin/login.html";
      return false;
    }
    return true;
  } catch (e) {
    sessionStorage.removeItem(SESSION_KEY);
    location.href = "/admin/login.html";
    return false;
  }
}

export function adminLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  location.href = "/admin/login.html";
}

export function refreshAdminSession() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    startedAt: Date.now(),
    expiresAt: Date.now() + SESSION_HOURS * 60 * 60 * 1000
  }));
}

export { db, doc, getDoc, setDoc, serverTimestamp, hashPin, verifyPin };