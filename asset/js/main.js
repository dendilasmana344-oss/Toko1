import { auth, db, ADMIN_EMAIL } from "../../config/firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export { auth, db, ADMIN_EMAIL };
export {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,
  collection, doc, addDoc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, where, orderBy, serverTimestamp, Timestamp
};

export function toast(msg, type = "info") {
  const t = document.createElement("div");
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span class="font-semibold">${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("show"), 100);
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 400);
  }, 3000);
}

export function formatRupiah(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

export function formatDate(ts) {
  if (!ts) return "-";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

export function generateOrderId() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `CHAOS${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${rand}`;
}

export async function requireAuth(redirect = "/user/login.html") {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (!user) {
        window.location.href = redirect;
        resolve(null);
      } else {
        resolve(user);
      }
    });
  });
}

export async function requireAdmin() {
  const user = await requireAuth("/admin/admin-login.html");
  if (!user) return null;
  if (user.email !== ADMIN_EMAIL) {
    toast("Akses ditolak! Hanya admin.", "error");
    setTimeout(() => window.location.href = "/index.html", 1500);
    return null;
  }
  return user;
}

export async function saveUserProfile(uid, data) {
  await setDoc(doc(db, "users", uid), {
    ...data,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp()
  }, { merge: true });
}

export async function updateLastLogin(uid) {
  await setDoc(doc(db, "users", uid), { lastLogin: serverTimestamp() }, { merge: true });
                       }
