/**
 * nexus-auth.js — Auth state helpers (used by app.js, navbar, checkout guard)
 */

export function getAuthUser() {
  try {
    const raw = localStorage.getItem('nexus_user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function isLoggedIn() {
  return !!localStorage.getItem('nexus_token') && !!getAuthUser();
}

export function saveAuth(token, user) {
  localStorage.setItem('nexus_token', token);
  localStorage.setItem('nexus_user', JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('nexus-auth'));
}

export function clearAuth() {
  localStorage.removeItem('nexus_token');
  localStorage.removeItem('nexus_user');
  window.dispatchEvent(new CustomEvent('nexus-auth'));
}
