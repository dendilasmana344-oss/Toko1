import { db, IMGBB_KEY } from "../../config/firebase-config.js";
import {
  collection, doc, addDoc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, where, orderBy, limit, startAfter, serverTimestamp, Timestamp,
  writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getCurrentUser, setCurrentUser, clearCurrentUser, isLoggedIn,
  startSession, getUserId, getUserName, getUserPhone, requireLogin, requireVerified
} from "./device.js";
import { hashPin, verifyPin, generateOTP, normalizePhone, isValidPhone } from "./crypto.js";
import { sendOTP, sendOrderNotif, sendBroadcast, getWaSettings, sendWa } from "./wa-bot.js";
import { getBannerForGame, getColorForGame, generateBannerSVG } from "./banner-map.js";

export { db, IMGBB_KEY };
export {
  collection, doc, addDoc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, where, orderBy, limit, startAfter, serverTimestamp, Timestamp,
  writeBatch
};
export {
  getCurrentUser, setCurrentUser, clearCurrentUser, isLoggedIn,
  startSession, getUserId, getUserName, getUserPhone, requireLogin, requireVerified
};
export { hashPin, verifyPin, generateOTP, normalizePhone, isValidPhone };
export { sendOTP, sendOrderNotif, sendBroadcast, getWaSettings, sendWa };
export { getBannerForGame, getColorForGame, generateBannerSVG };

export function toast(msg, type = "info", duration = 3000) {
  const t = document.createElement("div");
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span class="font-semibold">${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("show"), 100);
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 400);
  }, duration);
}

export function playSound(type = "notif") {
  try {
    const audio = new Audio();
    if (type === "notif") {
      audio.src = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQBvT18AAAAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA";
    } else if (type === "success") {
      audio.src = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQBvT18AAAAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA";
    } else if (type === "error") {
      audio.src = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQBvT18AAAAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA";
    }
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (e) {}
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

export function formatTime(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function timeAgo(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return Math.floor(diff / 60) + "m lalu";
  if (diff < 86400) return Math.floor(diff / 3600) + "j lalu";
  if (diff < 604800) return Math.floor(diff / 86400) + "h lalu";
  return formatDate(ts);
}

export function generateOrderId() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `CHAOS${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}${rand}`;
}

export async function uploadToImgBB(file, maxSizeMB = 5) {
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`Maksimal ${maxSizeMB}MB`);
  }
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: "POST",
    body: formData
  });
  const data = await res.json();
  if (!data.success) throw new Error("Upload gagal");
  return data.data.url;
}

export function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function throttle(fn, limit = 200) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export async function paginateQuery(coll, pageSize = 20, lastDoc = null, filters = []) {
  let q = query(coll, ...filters, orderBy("createdAt", "desc"), limit(pageSize));
  if (lastDoc) q = query(coll, ...filters, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize));
  const snap = await getDocs(q);
  return {
    docs: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snap.docs[snap.docs.length - 1] || null,
    hasMore: snap.docs.length === pageSize
  };
}

export function observeVisibility(elements, callback) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "100px" });
  elements.forEach((el) => observer.observe(el));
  return observer;
}