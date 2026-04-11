/**
 * payment.js — Indian-style payment gateway
 *   UPI  → Shows QR code + UPI ID to scan (user does NOT type their UPI ID)
 *   COD  → Confirm with address summary
 *   Always simulates SUCCESS after 2.2s delay.
 */
import { API } from '../utils/api.js';
import { formatPrice, getRobotById } from '../data/robots.js';

// ── NEXUS Business UPI Details ────────────────────────────────────────────────
const NEXUS_UPI_ID    = 'chitrakhachariya@okicici'; 
const NEXUS_UPI_NAME  = 'Chitra Khachariya';

function fmt(n) { return formatPrice(n); }

// ── Build a UPI deep-link for the QR ─────────────────────────────────────────
function buildUpiUrl(amount) {
  return `upi://pay?pa=${encodeURIComponent(NEXUS_UPI_ID)}&pn=${encodeURIComponent(NEXUS_UPI_NAME)}&am=${amount}&cu=INR&tn=NEXUS+Robot+Order`;
}

// ── Generate QR via public API (no library needed) ────────────────────────────
function qrUrl(text) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=12&color=000000&bgcolor=ffffff&data=${encodeURIComponent(text)}`;
}

// ── Success Screen ────────────────────────────────────────────────────────────
function renderSuccess(appEl, order, addr) {
  const isCOD = order.paymentMethod === 'COD';
  appEl.innerHTML = `
    <div class="payment-page" style="flex-direction:column;align-items:center">
      <div class="pgw-success">
        <div class="pgw-check-wrap">
          <svg class="pgw-checkmark" viewBox="0 0 52 52">
            <circle class="pgw-checkmark-circle" cx="26" cy="26" r="25"/>
            <path  class="pgw-checkmark-check"  d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>

        <h2 class="auth-title" style="margin-top:0">
          ${isCOD ? 'Order' : 'Payment'}
          <span style="background:linear-gradient(135deg,var(--accent-blue),var(--accent-purple));-webkit-background-clip:text;background-clip:text;color:transparent">
            ${isCOD ? 'Confirmed!' : 'Successful!'}
          </span>
        </h2>

        <p class="text-muted" style="margin:0.5rem 0 1.5rem">
          ${isCOD
      ? `Your NEXUS robot will be dispatched within 5–7 days. Pay ${fmt(order.total)} on delivery.`
      : 'Payment received. Your NEXUS system is being prepared for dispatch.'}
        </p>

        <div class="pgw-txn-box">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
            <div>
              <div class="pgw-txn-label">Order ID</div>
              <div class="pgw-txn-id" style="font-size:0.85rem">${order._id}</div>
            </div>
            <div>
              <div class="pgw-txn-label">Amount</div>
              <div class="pgw-txn-id">${fmt(order.total)}</div>
            </div>
          </div>
          
          ${order.transactionId ? `
            <div style="margin-top:1.25rem">
              <div class="pgw-txn-label">Transaction ID</div>
              <div class="pgw-txn-id" style="font-size:0.85rem;color:var(--accent-blue)">${order.transactionId}</div>
            </div>
          ` : ''}

          <div class="pgw-divider" style="margin:1.25rem 0"></div>

          <div>
            <div class="pgw-txn-label" style="display:flex;align-items:center;gap:0.4rem">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Shipping to
            </div>
            <div class="pgw-txn-id" style="font-size:0.85rem;line-height:1.5;margin-top:0.4rem;font-weight:500">
              <span style="color:var(--text-primary);font-weight:700">${addr.fullName}</span><br>
              ${addr.phone}<br>
              ${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}<br>
              ${addr.city}, ${addr.state} – ${addr.pincode}
            </div>
          </div>
        </div>

        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:2rem">
          <a href="#/orders" data-link class="btn-gradient" style="padding:0.8rem 1.5rem">View My Orders</a>
          <a href="#/"       data-link class="btn-outline-glass" style="padding:0.8rem 1.5rem">Return Home</a>
        </div>
      </div>
    </div>`;
}

// ── Main Payment Gateway ──────────────────────────────────────────────────────
export function renderPayment(appEl, { items, subtotal, gst, discount, total, shippingAddress }) {
  const addr = shippingAddress || {};
  const upiLink = buildUpiUrl(total);
  const qr = qrUrl(upiLink);

  appEl.innerHTML = `
    <div class="payment-page">
      <div class="pgw-shell">

        <!-- ── Left panel ── -->
        <div class="pgw-left">
          <div class="pgw-brand">
            <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="pg1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stop-color="#3dffb5"/>
                  <stop offset="100%" stop-color="#ff4bd8"/>
                </linearGradient>
              </defs>
              <path d="M20 4L34 12L34 28L20 36L6 28L6 12Z" stroke="url(#pg1)" stroke-width="3" stroke-linejoin="round"/>
              <path d="M20 20L20 36M20 20L34 12M20 20L6 12" stroke="url(#pg1)" stroke-width="3" stroke-linecap="round"/>
            </svg>
            <span class="pgw-brand-name">NEXUS Pay</span>
          </div>

          <div>
            <div class="pgw-amount">${fmt(total)}</div>
            <div class="pgw-amount-label">Total payable (incl. 18% GST)</div>
          </div>

          <div class="pgw-divider"></div>

          <!-- Cart items -->
          <div class="pgw-item-list" id="pgw-items"></div>

          <div class="pgw-divider"></div>

          <!-- Price breakdown -->
          <div style="font-size:0.78rem;color:var(--text-muted);display:flex;flex-direction:column;gap:0.3rem">
            <div style="display:flex;justify-content:space-between"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
            <div style="display:flex;justify-content:space-between"><span>GST (18%)</span><span>${fmt(gst)}</span></div>
            <div style="display:flex;justify-content:space-between;color:var(--accent-blue)"><span>NEXUS Discount</span><span>-${fmt(discount)}</span></div>
          </div>

          <!-- Delivery address summary -->
          ${addr.fullName ? `
            <div class="pgw-divider"></div>
            <div style="font-size:0.78rem;color:var(--text-muted)">
              <div style="font-weight:600;color:var(--text-primary);margin-bottom:0.35rem">📦 Delivering to</div>
              <div>${addr.fullName} · ${addr.phone}</div>
              <div>${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}</div>
              <div>${addr.city}, ${addr.state} – ${addr.pincode}</div>
            </div>
          ` : ''}

          <div class="pgw-secure-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            256-bit SSL secured
          </div>
        </div>

        <!-- ── Right panel ── -->
        <div class="pgw-right">
          <div class="pgw-right-title">Choose payment method</div>

          <!-- Method tabs -->
          <div class="pgw-methods">
            <div class="pgw-method-tab is-active" data-method="UPI" id="tab-upi">
              <div class="pgw-method-radio"></div>
              <div class="pgw-method-icon">📲</div>
              <div class="pgw-method-info">
                <div class="pgw-method-label">UPI / QR Code</div>
                <div class="pgw-method-desc">GPay · PhonePe · Paytm · BHIM · Any UPI app</div>
              </div>
            </div>
            <div class="pgw-method-tab" data-method="COD" id="tab-cod">
              <div class="pgw-method-radio"></div>
              <div class="pgw-method-icon">💵</div>
              <div class="pgw-method-info">
                <div class="pgw-method-label">Cash on Delivery</div>
                <div class="pgw-method-desc">Pay when your robot arrives</div>
              </div>
            </div>
          </div>

          <!-- UPI Panel — QR + UPI ID display -->
          <div class="pgw-form-panel" id="panel-upi">
            <div class="pgw-qr-wrap">
              <div class="pgw-qr-label">Scan & Pay with any UPI app</div>
              <div class="pgw-qr-box">
                <!-- Using the custom branded QR code provided -->
                <img src="assets/payment-qr.png" alt="UPI QR Code" class="pgw-qr-img" id="pgw-qr-img" onerror="this.src='${qr}'"/>
                <div class="pgw-qr-shimmer" id="pgw-qr-shimmer"></div>
              </div>
              <div class="pgw-upi-row">
                <span class="pgw-upi-id-label">UPI ID</span>
                <span class="pgw-upi-id-val" id="pgw-upi-id-val">${NEXUS_UPI_ID}</span>
                <button class="pgw-copy-btn" id="pgw-copy-btn" title="Copy UPI ID">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                </button>
              </div>
              <div class="pgw-app-row">
                ${['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(a => `
                  <a href="${upiLink}" class="pgw-app-pill" title="Open ${a}">${a}</a>
                `).join('')}
              </div>
              <p class="pgw-qr-note">
                After payment, click <strong>"I've Paid"</strong> to confirm your order.
              </p>
            </div>
          </div>

          <!-- COD Panel -->
          <div class="pgw-form-panel" id="panel-cod" style="display:none">
            <div class="pgw-cod-info">
              <strong>Cash on Delivery</strong> selected.<br>
              Your robot will be dispatched within 5–7 business days.<br>
              Please keep <strong>${fmt(total)}</strong> ready at delivery.<br><br>
              <div style="font-size:0.82rem;color:var(--text-muted)">
                📦 <strong>Delivering to:</strong><br>
                ${addr.fullName}, ${addr.phone}<br>
                ${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}<br>
                ${addr.city}, ${addr.state} – ${addr.pincode}
              </div>
            </div>
          </div>

          <button class="pgw-pay-btn" id="pgw-pay-btn">
            <span id="pgw-btn-text">I've Paid — Confirm Order</span>
            <span class="btn-spinner"></span>
          </button>

          <div class="pgw-trust">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Secured by NEXUS Pay&nbsp;•&nbsp;RBI compliant
          </div>
        </div>

      </div>
    </div>`;

  // ── Hydrate item list ─────────────────────────────────────────────────────
  const pgwItems = appEl.querySelector('#pgw-items');
  if (pgwItems) {
    pgwItems.innerHTML = items.map(it => {
      const robot = getRobotById(it.robotId || it.id);
      const name = it.name || (robot ? robot.name : it.robotId);
      const price = it.price || (robot ? robot.price : 0);
      return `<div class="pgw-item">
        <span class="pgw-item-name">${name} ×${it.qty}</span>
        <span>${fmt(price * it.qty)}</span>
      </div>`;
    }).join('');
  }

  // ── QR image shimmer → hide once loaded ──────────────────────────────────
  const qrImg = appEl.querySelector('#pgw-qr-img');
  const qrShimmer = appEl.querySelector('#pgw-qr-shimmer');
  if (qrImg && qrShimmer) {
    qrImg.style.opacity = '0';
    qrImg.addEventListener('load', () => {
      qrShimmer.style.display = 'none';
      qrImg.style.opacity = '1';
      qrImg.style.transition = 'opacity 0.4s';
    });
  }

  // ── Copy UPI ID ───────────────────────────────────────────────────────────
  appEl.querySelector('#pgw-copy-btn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(NEXUS_UPI_ID).then(() => {
      const btn = appEl.querySelector('#pgw-copy-btn');
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3dffb5" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
      setTimeout(() => {
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg>`;
      }, 2000);
    });
  });

  // ── Method tabs ───────────────────────────────────────────────────────────
  let activeMethod = 'UPI';
  const tabUPI = appEl.querySelector('#tab-upi');
  const tabCOD = appEl.querySelector('#tab-cod');
  const panelUPI = appEl.querySelector('#panel-upi');
  const panelCOD = appEl.querySelector('#panel-cod');
  const btnText = appEl.querySelector('#pgw-btn-text');
  const payBtn = appEl.querySelector('#pgw-pay-btn');

  function switchMethod(method) {
    activeMethod = method;
    [tabUPI, tabCOD].forEach(t => t.classList.remove('is-active'));
    appEl.querySelector(`#tab-${method.toLowerCase()}`).classList.add('is-active');
    panelUPI.style.display = method === 'UPI' ? 'block' : 'none';
    panelCOD.style.display = method === 'COD' ? 'block' : 'none';
    btnText.textContent = method === 'UPI'
      ? `I've Paid — Confirm Order`
      : `Confirm Order · Pay ${fmt(total)} on Delivery`;
  }

  tabUPI.addEventListener('click', () => switchMethod('UPI'));
  tabCOD.addEventListener('click', () => switchMethod('COD'));

  // ── Pay / Confirm Button ─────────────────────────────────────────────────
  payBtn.addEventListener('click', async () => {
    btnText.textContent = 'Confirming order…';
    payBtn.querySelector('.btn-spinner').style.display = 'block';
    payBtn.disabled = true;

    // Simulate brief processing delay
    await new Promise(r => setTimeout(r, 1800));

    try {
      const data = await API.createOrder({
        paymentMethod: activeMethod,
        shippingAddress: addr
      });
      window.dispatchEvent(new CustomEvent('nexus-cart-cleared'));
      renderSuccess(appEl, data.order, addr);
    } catch (err) {
      payBtn.querySelector('.btn-spinner').style.display = 'none';
      btnText.textContent = activeMethod === 'UPI'
        ? `I've Paid — Confirm Order`
        : `Confirm Order · COD`;
      payBtn.disabled = false;

      const errDiv = document.createElement('div');
      errDiv.style.cssText = 'color:#ff6b7a;font-size:0.85rem;margin-top:0.75rem;text-align:center';
      errDiv.textContent = err.message;
      payBtn.after(errDiv);
      setTimeout(() => errDiv.remove(), 5000);
    }
  });
}
