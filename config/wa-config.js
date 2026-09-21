export const WA_PROVIDER = "fonnte";

export const WA_CONFIG = {
  fonnte: {
    endpoint: "https://api.fonnte.com/send",
    token: "" // isi via admin setting.html → tersimpan di Firestore
  },
  wablas: {
    endpoint: "https://console.wablas.com/api/send-message",
    token: ""
  }
};

export const DEFAULT_SENDER = {
  phone: "",
  name: "CHAOS STORE"
};

export const OTP_TEMPLATE = (code, storeName) =>
`🔐 *KODE VERIFIKASI ${storeName}*

Kode OTP Anda: *${code}*

⏱️ Berlaku 5 menit
❗ Jangan bagikan kode ini ke siapa pun

_Pesan otomatis, jangan dibalas._`;

export const ORDER_TEMPLATE = (order) =>
`🎮 *PESANAN ${order.gameName}*

Order ID: ${order.orderId}
Produk: ${order.productName}
User ID: ${order.gameUserId}
${order.serverId ? `Server: ${order.serverId}\n` : ''}Total: Rp ${Number(order.price).toLocaleString('id-ID')}
Status: ${order.status.toUpperCase()}

Cek: ${location.origin}/invoice.html?orderId=${order.orderId}

_${order.storeName}_`;

export const BROADCAST_TEMPLATE = (msg, storeName) =>
`📢 *${storeName}*

${msg}

_Pesan otomatis._`;
