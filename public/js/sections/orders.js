/**
 * orders.js — My Orders section (#/orders)
 */
import { API } from '../utils/api.js';
import { formatPrice } from '../data/robots.js';
import { isLoggedIn } from '../utils/nexus-auth.js';
import { navTo } from '../router.js';

export async function renderOrders(appEl) {
  if (!isLoggedIn()) {
    navTo('/login');
    return;
  }

  // Loading skeleton
  appEl.innerHTML = `
    <div class="orders-page">
      <h2>My <span style="background:linear-gradient(135deg,var(--accent-blue),var(--accent-purple));-webkit-background-clip:text;background-clip:text;color:transparent">Orders</span></h2>
      <p class="text-muted" id="orders-status">Loading your orders…</p>
      <div id="orders-list"></div>
    </div>
  `;

  const statusEl = appEl.querySelector('#orders-status');
  const listEl   = appEl.querySelector('#orders-list');

  try {
    const { orders } = await API.getOrders();

    if (!orders || orders.length === 0) {
      statusEl.style.display = 'none';
      listEl.innerHTML = `
        <div class="orders-empty">
          <p style="font-size:2rem;margin-bottom:1rem">🤖</p>
          <p>No orders yet. Start building your NEXUS fleet!</p>
          <br>
          <a href="#/shop" data-link class="btn-gradient" style="display:inline-flex">Explore Models</a>
        </div>`;
      return;
    }

    statusEl.style.display = 'none';

    listEl.innerHTML = orders.map(order => {
      const date   = new Date(order.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
      const isCOD  = order.paymentMethod === 'COD';
      const items  = order.items || [];

      return `
        <div class="order-card">
          <div class="order-card__head">
            <div>
              <div class="order-card__id">Order # <strong>${order._id}</strong></div>
              <div class="order-card__date">${date}</div>
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center">
              <span class="order-badge order-badge--success">✓ ${order.paymentStatus}</span>
              <span class="order-badge ${isCOD ? 'order-badge--cod' : 'order-badge--success'}">
                ${isCOD ? '💵 COD' : '📲 UPI'}
              </span>
            </div>
          </div>

          <div class="order-items-list">
            ${items.map(it => `
              <div class="order-item-row">
                <span>${it.name || it.robotId} <span style="color:rgba(255,255,255,0.35)">×${it.qty}</span></span>
                <span>${formatPrice(it.price * it.qty)}</span>
              </div>`).join('')}
          </div>

          <div class="order-card__footer">
            <div>
              <div class="order-method">
                ${isCOD ? 'Cash on Delivery' : `UPI — ${order.transactionId || ''}`}
              </div>
            </div>
            <div>
              <span style="font-size:0.78rem;color:var(--text-muted)">Total</span>
              <div class="order-total">${formatPrice(order.total)}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    statusEl.textContent = `Failed to load orders: ${err.message}`;
    statusEl.style.color = '#ff6b7a';
  }
}
