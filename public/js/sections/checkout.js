/**
 * checkout.js — 2-step checkout
 *   Step 1 → Collect shipping address
 *   Step 2 → Show order summary + "Proceed to Payment"
 */
import { API } from '../utils/api.js';
import { formatPrice, getRobotById } from '../data/robots.js';
import { isLoggedIn } from '../utils/nexus-auth.js';
import { navTo } from '../router.js';
import { renderPayment } from './payment.js';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra & Nagar Haveli and Daman & Diu',
  'Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
];

export async function renderCheckout(appEl) {
  // ── Auth Guard ─────────────────────────────────────────────────────────────
  if (!isLoggedIn()) { navTo('/login'); return; }

  // Loading state
  appEl.innerHTML = `
    <div style="min-height:60vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem">
      <span class="spinner-loader"></span>
      <p class="text-muted" style="font-size:0.9rem">Loading your cart…</p>
    </div>`;

  try {
    const cartData = await API.getCart();
    const { items, isNewUser } = cartData;
    console.log('[DEBUG_AUTH] isNewUser Status from API:', isNewUser);
    console.log('[DEBUG_CART] Full data received:', cartData);

    if (!items || items.length === 0) {
      appEl.innerHTML = `
        <section class="section" style="text-align:center;padding:6rem 1rem">
          <h2 class="auth-title">Cart is <span class="text-accent">Empty</span></h2>
          <p class="text-muted">Return to the shop to build your NEXUS.</p><br>
          <a href="#/shop" data-link class="btn-gradient">Explore Models</a>
        </section>`;
      return;
    }

    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const gst      = Math.round(subtotal * 0.18);
    const discount = isNewUser ? 25000 : 0;
    const total    = Math.max(0, subtotal + gst - discount);

    // ── Step 1 — Shipping Address ───────────────────────────────────────────
    renderAddressStep(appEl, { items, subtotal, gst, discount, total, isNewUser });

  } catch (err) {
    appEl.innerHTML = `
      <div style="text-align:center;padding:4rem 1rem">
        <p style="color:#ff6b7a">Failed to load cart: ${err.message}</p>
        <br><a href="#/shop" data-link class="btn-outline-glass">Back to Shop</a>
      </div>`;
  }
}

// ── Step 1: Address Form ───────────────────────────────────────────────────────
function renderAddressStep(appEl, orderData) {
  const stateOptions = INDIAN_STATES.map(s =>
    `<option value="${s}">${s}</option>`).join('');

  appEl.innerHTML = `
    <section class="checkout-section">
      <div class="checkout-grid page-transition" style="grid-template-columns:1fr 1fr;gap:2rem">

        <!-- Left: Order mini-summary -->
        <div class="glass-panel glow-border">
          <h2 class="auth-title" style="font-size:1.4rem">Order <span class="text-accent">Summary</span></h2>
          <div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1.5rem">
            ${orderData.items.map(it => {
              const robot = getRobotById(it.robotId);
              const name  = it.name || (robot ? robot.name : it.robotId);
              return `<div style="display:flex;justify-content:space-between;padding:0.45rem 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:0.88rem">
                <span style="color:var(--text-muted)">${name} <span style="opacity:0.5">×${it.qty}</span></span>
                <span>${formatPrice(it.price * it.qty)}</span>
              </div>`;
            }).join('')}
          </div>
          <div style="display:flex;flex-direction:column;gap:0.35rem;font-size:0.82rem;color:var(--text-muted)">
            <div class="checkout-row"><span>Subtotal</span><span>${formatPrice(orderData.subtotal)}</span></div>
            <div class="checkout-row"><span>GST (18%)</span><span>${formatPrice(orderData.gst)}</span></div>
            <div class="checkout-row text-accent">
              <span>${orderData.isNewUser ? 'New User Gift' : 'NEXUS Discount'}</span>
              <span>−${formatPrice(orderData.discount)}</span>
            </div>
            <div class="checkout-row checkout-total-row" style="margin-top:0.5rem"><span>Total Payable</span><strong>${formatPrice(orderData.total)}</strong></div>
          </div>
          <p class="text-muted" style="font-size:0.75rem;margin-top:1.5rem;display:flex;align-items:center;gap:0.4rem">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            256-bit SSL secured checkout
          </p>
        </div>

        <!-- Right: Address form -->
        <div class="glass-panel glow-border">
          <h2 class="auth-title" style="font-size:1.4rem">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:0.4rem"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            Shipping <span class="text-accent">Address</span>
          </h2>

          <form id="address-form" class="addr-form" novalidate autocomplete="on">
            <div class="addr-row">
              <div class="addr-field">
                <label class="addr-label" for="addr-name">Full Name *</label>
                <input class="addr-input" id="addr-name" name="fullName" type="text"
                  placeholder="Rahul Sharma" autocomplete="name" required/>
              </div>
              <div class="addr-field">
                <label class="addr-label" for="addr-phone">Phone Number *</label>
                <input class="addr-input" id="addr-phone" name="phone" type="tel"
                  placeholder="9876543210" autocomplete="tel" maxlength="10" required/>
              </div>
            </div>

            <div class="addr-field">
              <label class="addr-label" for="addr-line1">Address Line 1 *</label>
              <input class="addr-input" id="addr-line1" name="line1" type="text"
                placeholder="Flat / House No., Building, Street" autocomplete="address-line1" required/>
            </div>

            <div class="addr-field">
              <label class="addr-label" for="addr-line2">Address Line 2 <span style="opacity:0.5">(optional)</span></label>
              <input class="addr-input" id="addr-line2" name="line2" type="text"
                placeholder="Area, Landmark" autocomplete="address-line2"/>
            </div>

            <div class="addr-row">
              <div class="addr-field">
                <label class="addr-label" for="addr-city">City *</label>
                <input class="addr-input" id="addr-city" name="city" type="text"
                  placeholder="New Delhi" autocomplete="address-level2" required/>
              </div>
              <div class="addr-field">
                <label class="addr-label" for="addr-pincode">PIN Code *</label>
                <input class="addr-input" id="addr-pincode" name="pincode" type="text"
                  placeholder="400001" maxlength="6" required/>
              </div>
            </div>

            <div class="addr-field">
              <label class="addr-label" for="addr-state">State *</label>
              <select class="addr-input addr-select" id="addr-state" name="state" required>
                <option value="" disabled selected>Select State</option>
                ${stateOptions}
              </select>
            </div>

            <div id="addr-error" style="color:#ff6b7a;font-size:0.82rem;min-height:1.2rem;margin-top:0.25rem"></div>

            <button type="submit" class="pgw-pay-btn" style="margin-top:1.25rem;width:100%">
              Continue to Payment →
            </button>
          </form>
        </div>

      </div>
    </section>`;

  // ── Form validation & submission ──────────────────────────────────────────
  const form    = appEl.querySelector('#address-form');
  const errDiv  = appEl.querySelector('#addr-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errDiv.textContent = '';

    const fd = new FormData(form);
    const addr = {
      fullName : fd.get('fullName')?.trim(),
      phone    : fd.get('phone')?.trim(),
      line1    : fd.get('line1')?.trim(),
      line2    : fd.get('line2')?.trim() || '',
      city     : fd.get('city')?.trim(),
      state    : fd.get('state')?.trim(),
      pincode  : fd.get('pincode')?.trim()
    };

    // Validation
    if (!addr.fullName)              { errDiv.textContent = 'Full name is required.'; return; }
    if (!/^\d{10}$/.test(addr.phone)) { errDiv.textContent = 'Enter a valid 10-digit phone number.'; return; }
    if (!addr.line1)                 { errDiv.textContent = 'Address line 1 is required.'; return; }
    if (!addr.city)                  { errDiv.textContent = 'City is required.'; return; }
    if (!addr.state)                 { errDiv.textContent = 'Please select a state.'; return; }
    if (!/^\d{6}$/.test(addr.pincode)) { errDiv.textContent = 'Enter a valid 6-digit PIN code.'; return; }

    // Go to payment with address embedded
    renderPayment(appEl, { ...orderData, shippingAddress: addr });
  });
}
