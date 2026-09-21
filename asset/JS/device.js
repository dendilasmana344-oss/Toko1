const USER_KEY = "chaos_user";
const SESSION_KEY = "chaos_session";

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

export function setCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn() {
  const user = getCurrentUser();
  if (!user) return false;
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return false;
  try {
    const s = JSON.parse(session);
    if (Date.now() > s.expiresAt) {
      clearCurrentUser();
      return false;
    }
  } catch (e) { return false; }
  return true;
}

export function startSession(hours = 24) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    startedAt: Date.now(),
    expiresAt: Date.now() + hours * 60 * 60 * 1000
  }));
}

export function getUserId() {
  const u = getCurrentUser();
  return u?.phone || null;
}

export function getUserName() {
  const u = getCurrentUser();
  return u?.username || "Guest";
}

export function getUserPhone() {
  const u = getCurrentUser();
  return u?.phone || null;
}

export function requireLogin(redirect = "/login.html") {
  if (!isLoggedIn()) {
    sessionStorage.setItem("chaos_redirect", location.href);
    location.href = redirect;
    return false;
  }
  return true;
}

export function requireVerified() {
  if (!requireLogin()) return false;
  const u = getCurrentUser();
  if (!u?.verified) {
    location.href = "/login.html";
    return false;
  }
  return true;
}