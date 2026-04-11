/**
 * cart.js — Dual-mode cart
 *   • If logged in  → sync adds/removes to backend API
 *   • If logged out → pure localStorage / in-memory
 */
import { getRobotById, formatPrice } from './data/robots.js';
import { isLoggedIn } from './utils/nexus-auth.js';
import { API } from './utils/api.js';

// In-memory fallback (for guest users)
const localCart = [];

function notify() {
  window.dispatchEvent(new CustomEvent('nexus-cart'));
}

// ── Local helpers ─────────────────────────────────────────────────────────────
function localAdd(robotId, qty = 1) {
  const existing = localCart.find(c => c.robotId === robotId || c.id === robotId);
  if (existing) { existing.qty += qty; }
  else {
    const robot = getRobotById(robotId);
    localCart.push({
      robotId,
      id: robotId,
      name:  robot ? robot.name  : robotId,
      price: robot ? robot.price : 0,
      image: robot ? robot.image : '',
      qty
    });
  }
}

function localRemove(robotId) {
  const i = localCart.findIndex(c => c.robotId === robotId || c.id === robotId);
  if (i >= 0) localCart.splice(i, 1);
}

// ── Public API ────────────────────────────────────────────────────────────────
export function getCart() { return localCart; }

export function cartCount() {
  return localCart.reduce((s, c) => s + c.qty, 0);
}

export function calculateCartTotal() {
  return localCart.reduce((s, c) => s + c.price * c.qty, 0);
}

export async function addToCart(robotId, qty = 1) {
  // Always update local immediately for snappy UI
  localAdd(robotId, qty);
  notify();

  if (isLoggedIn()) {
    try {
      const robot = getRobotById(robotId);
      await API.addToCart({
        robotId,
        name:  robot ? robot.name  : robotId,
        price: robot ? robot.price : 0,
        image: robot ? robot.image : '',
        qty
      });
    } catch (err) {
      console.warn('Cart backend sync failed:', err.message);
    }
  }
}

export async function removeFromCart(robotId) {
  localRemove(robotId);
  notify();

  if (isLoggedIn()) {
    try { await API.removeFromCart({ robotId }); }
    catch (err) { console.warn('Remove sync failed:', err.message); }
  }
}

export async function clearCartLocal() {
  localCart.length = 0;
  notify();
}

/** Pull the server cart into localCart (called after login) */
export async function syncCartFromServer() {
  if (!isLoggedIn()) return;
  try {
    const { items } = await API.getCart();
    localCart.length = 0;
    (items || []).forEach(it => {
      localCart.push({ ...it, id: it.robotId });
    });
    notify();
  } catch (err) {
    console.warn('Cart sync failed:', err.message);
  }
}

// ── Render helpers (used by drawer) ──────────────────────────────────────────
export function renderCartDrawer(bodyEl, totalEl) {
  if (!bodyEl) return;
  
  if (!bodyEl.dataset.initialized) {
    bodyEl.dataset.initialized = 'true';
    bodyEl.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      
      if (action === 'plus') {
        await addToCart(id, 1);
      } else if (action === 'minus') {
        const item = localCart.find(c => (c.robotId === id || c.id === id));
        if (item) {
          if (item.qty > 1) {
            await addToCart(id, -1);
          } else {
            await removeFromCart(id);
          }
        }
      } else if (action === 'remove') {
        await removeFromCart(id);
      }
    });
  }

  if (!localCart.length) {
    bodyEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem">Your cart is empty. Explore the shop.</p>';
  } else {
    bodyEl.innerHTML = localCart.map(item => {
      const robot = getRobotById(item.robotId || item.id);
      const name  = item.name || (robot ? robot.name  : item.id);
      const price = item.price || (robot ? robot.price : 0);
      return `
        <div class="cart-line" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">
          <div style="flex:1">
            <strong style="display:block; margin-bottom:4px;">${name}</strong>
            <div style="color:var(--text-muted); font-size:0.85rem">${formatPrice(price)}</div>
          </div>
          
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.5rem;">
            <div style="font-weight:600; color:var(--text);">${formatPrice(price * item.qty)}</div>
            <div style="display:flex; align-items:center; gap:0.5rem; background:rgba(255,255,255,0.05); padding:0.2rem; border-radius:4px; border:1px solid rgba(255,255,255,0.1);">
              <button type="button" data-action="minus" data-id="${item.robotId || item.id}" style="background:transparent; border:none; color:var(--text); width:20px; height:20px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:1rem;">-</button>
              <span style="font-size:0.85rem; width:16px; text-align:center;">${item.qty}</span>
              <button type="button" data-action="plus" data-id="${item.robotId || item.id}" style="background:transparent; border:none; color:var(--cyan); width:20px; height:20px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:1rem;">+</button>
            </div>
          </div>
        </div>`;
    }).join('');
  }
  if (totalEl) totalEl.textContent = formatPrice(calculateCartTotal());
}

export function updateCartBadge(el) {
  if (!el) return;
  el.textContent = String(cartCount());
  el.style.display = 'grid';
}
