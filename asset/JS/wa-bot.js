import { db } from "../../config/firebase-config.js";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { WA_CONFIG, WA_PROVIDER, OTP_TEMPLATE, ORDER_TEMPLATE, BROADCAST_TEMPLATE, DEFAULT_SENDER } from "../../config/wa-config.js";

async function getWaSettings() {
  try {
    const snap = await getDoc(doc(db, "settings", "wa"));
    if (snap.exists()) return snap.data();
  } catch (e) {}
  return {
    provider: WA_PROVIDER,
    token: WA_CONFIG[WA_PROVIDER].token,
    senderPhone: DEFAULT_SENDER.phone,
    senderName: DEFAULT_SENDER.name,
    enabled: false
  };
}

async function sendWa(phone, message) {
  const settings = await getWaSettings();

  if (!settings.enabled || !settings.token || !settings.senderPhone) {
    console.warn("[WA BOT] Not configured. Message:", message);
    return { success: false, reason: "WA bot belum dikonfigurasi admin" };
  }

  const endpoint = WA_CONFIG[settings.provider]?.endpoint || WA_CONFIG.fonnte.endpoint;

  const formData = new FormData();
  formData.append("target", phone);
  formData.append("message", message);
  formData.append("countryCode", "62");

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: settings.token },
      body: formData
    });
    const data = await res.json();
    await logWa(phone, message, data.status ? "sent" : "failed", data);
    return { success: !!data.status, response: data };
  } catch (err) {
    await logWa(phone, message, "error", { error: err.message });
    return { success: false, error: err.message };
  }
}

async function logWa(phone, message, status, meta = {}) {
  try {
    await addDoc(collection(db, "wa_logs"), {
      phone, message, status, meta,
      createdAt: serverTimestamp()
    });
  } catch (e) {}
}

export async function sendOTP(phone, code) {
  const settings = await getWaSettings();
  const msg = OTP_TEMPLATE(code, settings.senderName || "CHAOS STORE");
  return sendWa(phone, msg);
}

export async function sendOrderNotif(phone, order) {
  const settings = await getWaSettings();
  const msg = ORDER_TEMPLATE({ ...order, storeName: settings.senderName || "CHAOS STORE" });
  return sendWa(phone, msg);
}

export async function sendBroadcast(phones, message) {
  const settings = await getWaSettings();
  const msg = BROADCAST_TEMPLATE(message, settings.senderName || "CHAOS STORE");
  const results = [];
  for (const phone of phones) {
    const r = await sendWa(phone, msg);
    results.push({ phone, ...r });
    await new Promise((r) => setTimeout(r, 1500));
  }
  return results;
}

export { getWaSettings, sendWa };