const BANNER_MAP = {
  "blood strike": "/assets/image/banner-bloodstrike.jpg",
  "bloodstrike": "/assets/image/banner-bloodstrike.jpg",
  "mobile legends": "/assets/image/banner-mlbb.jpg",
  "mlbb": "/assets/image/banner-mlbb.jpg",
  "free fire": "/assets/image/banner-ff.jpg",
  "ff": "/assets/image/banner-ff.jpg",
  "valorant": "/assets/image/banner-valorant.jpg",
  "roblox": "/assets/image/banner-roblox.jpg",
  "fivem": "/assets/image/banner-fivem.jpg",
  "five m": "/assets/image/banner-fivem.jpg",
  "genshin": "/assets/image/banner-genshin.jpg",
  "genshin impact": "/assets/image/banner-genshin.jpg"
};

const BANNER_COLORS = {
  "blood strike": "#dc2626",
  "mobile legends": "#0ea5e9",
  "free fire": "#f59e0b",
  "valorant": "#ef4444",
  "roblox": "#dc2626",
  "fivem": "#8b5cf6",
  "genshin": "#06b6d4"
};

export function getBannerForGame(gameName) {
  if (!gameName) return "/assets/image/banner-default.jpg";
  const key = gameName.toLowerCase().trim();
  if (BANNER_MAP[key]) return BANNER_MAP[key];
  for (const [k, v] of Object.entries(BANNER_MAP)) {
    if (key.includes(k)) return v;
  }
  return "/assets/image/banner-default.jpg";
}

export function getColorForGame(gameName) {
  if (!gameName) return "#00d4ff";
  const key = gameName.toLowerCase().trim();
  if (BANNER_COLORS[key]) return BANNER_COLORS[key];
  for (const [k, v] of Object.entries(BANNER_COLORS)) {
    if (key.includes(k)) return v;
  }
  return "#00d4ff";
}

export function generateBannerSVG(gameName) {
  const color = getColorForGame(gameName);
  const name = (gameName || "GAME").toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="600" viewBox="0 0 1920 600">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#000;stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="1920" height="600" fill="url(#g)"/>
      <circle cx="1600" cy="300" r="400" fill="${color}" opacity="0.15"/>
      <circle cx="300" cy="150" r="250" fill="#fff" opacity="0.05"/>
      <text x="960" y="320" font-family="Poppins,sans-serif" font-size="120" font-weight="900" fill="#fff" text-anchor="middle" filter="url(#glow)">${name}</text>
    </svg>
  `;
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}