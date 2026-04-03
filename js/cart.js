import { getRobotById, formatPrice } from "./data/robots.js";

const cart = [];

export function getCart() {
  return cart;
}

export function addToCart(robotId, qty = 1) {
  const existing = cart.find((c) => c.id === robotId);
  if (existing) existing.qty += qty;
  else cart.push({ id: robotId, qty });
  notify();
}

export function removeFromCart(robotId) {
  const i = cart.findIndex((c) => c.id === robotId);
  if (i >= 0) cart.splice(i, 1);
  notify();
}

function notify() {
  window.dispatchEvent(new CustomEvent("nexus-cart"));
}

export function cartCount() {
  return cart.reduce((s, c) => s + c.qty, 0);
}

export function calculateCartTotal() {
  let t = 0;
  for (const line of cart) {
    const r = getRobotById(line.id);
    if (r) t += r.price * line.qty;
  }
  return t;
}

export function renderCartDrawer(bodyEl, totalEl) {
  if (!bodyEl) return;
  if (!cart.length) {
    bodyEl.innerHTML = "<p>Your cart is empty. Explore the shop to add a NEXUS robot.</p>";
  } else {
    bodyEl.innerHTML = cart
      .map((line) => {
        const r = getRobotById(line.id);
        if (!r) return "";
        return `<div class="cart-line">
          <div><strong>${r.name}</strong><br><span>× ${line.qty}</span></div>
          <div>${formatPrice(r.price * line.qty)}</div>
        </div>`;
      })
      .join("");
  }
  if (totalEl) totalEl.textContent = formatPrice(calculateCartTotal());
}

export function updateCartBadge(el) {
  if (el) {
    el.textContent = String(cartCount());
    el.style.display = "grid";
  }
}
