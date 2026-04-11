/**
 * api.js — Centralised fetch helpers for NEXUS backend
 * All calls automatically attach Bearer token from localStorage.
 */
const IS_DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const BASE = IS_DEV ? 'http://localhost:5000/api' : '/api';

function getToken() {
  return localStorage.getItem('nexus_token') || '';
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────
export const API = {
  register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => apiFetch('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  me:       ()     => apiFetch('/auth/me'),

  // Cart
  getCart:      ()     => apiFetch('/cart'),
  addToCart:    (body) => apiFetch('/cart/add',    { method: 'POST',   body: JSON.stringify(body) }),
  removeFromCart:(body)=> apiFetch('/cart/remove', { method: 'DELETE', body: JSON.stringify(body) }),
  clearCart:    ()     => apiFetch('/cart/clear',  { method: 'DELETE' }),

  // Orders
  createOrder:  (body) => apiFetch('/orders/create', { method: 'POST', body: JSON.stringify(body) }),
  getOrders:    ()     => apiFetch('/orders/user'),
};
