import { PIN_SALT } from "../../config/firebase-config.js";

export async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + PIN_SALT);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPin(inputPin, storedHash) {
  const inputHash = await hashPin(inputPin);
  return timingSafeEqual(inputHash, storedHash);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function generateOTP(len = 6) {
  const digits = "0123456789";
  let otp = "";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) {
    otp += digits[arr[i] % 10];
  }
  return otp;
}

export function normalizePhone(phone) {
  let p = String(phone).replace(/\D/g, "");
  if (p.startsWith("0")) p = "62" + p.slice(1);
  if (p.startsWith("8")) p = "62" + p;
  if (!p.startsWith("62")) p = "62" + p;
  return p;
}

export function isValidPhone(phone) {
  const p = normalizePhone(phone);
  return p.length >= 10 && p.length <= 15 && p.startsWith("62");
}