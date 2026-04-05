import { getRobotById, formatPrice } from "../data/robots.js";
import { navTo } from "../router.js";
import { addToCart } from "../cart.js";

const ICONS = {
  ai: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/></svg>`,
  sensor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>`,
  speed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  weight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3v18"/><path d="M6 21h12"/><rect x="4" y="7" width="16" height="6" rx="1"/></svg>`,
  battery: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/></svg>`,
  net: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>`,
};

function animatePrice(el, target) {
  if (!el) return;
  const dur = 900;
  const start = performance.now();
  const from = 0;
  function frame(now) {
    const t = Math.min(1, (now - start) / dur);
    const ease = 1 - Math.pow(1 - t, 3);
    const v = Math.round(from + (target - from) * ease);
    el.textContent = formatPrice(v);
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

export function renderDetail(root, id) {
  const r = getRobotById(id);
  if (!r) {
    root.innerHTML = `
      <div class="page-shell">
        <section class="section section--tight-top">
          <p>Robot not found.</p>
          <button type="button" class="detail-back" id="detail-fallback">← Back to catalog</button>
        </section>
      </div>`;
    root.querySelector("#detail-fallback")?.addEventListener("click", () => navTo("/robots"));
    return;
  }

  root.innerHTML = `
    <div class="page-shell page-shell--detail">
      <nav class="detail-breadcrumb reveal" aria-label="Breadcrumb">
        <a href="#/" data-link>Home</a>
        <span class="detail-breadcrumb__sep" aria-hidden="true">/</span>
        <a href="#/robots" data-link>Robots</a>
        <span class="detail-breadcrumb__sep" aria-hidden="true">/</span>
        <span class="detail-breadcrumb__here">${r.name}</span>
      </nav>
    <section class="section detail-page section--tight-top">
      <button type="button" class="detail-back" id="detail-back">← Back to lineup</button>
      <div class="detail-hero reveal">
        <div class="detail-hero__visual">
          <img src="${r.image}" alt="${r.name}" loading="lazy" />
        </div>
        <div class="detail-hero__text">
          <span class="robot-card__badge ${r.badgeClass}">${r.category}</span>
          <h1>${r.name}</h1>
          <p class="detail-tagline">${r.tagline}</p>
          <p style="color:var(--text-muted);line-height:1.65;margin:0;">${r.description}</p>
        </div>
      </div>
      <h3 class="reveal">Specifications</h3>
      <div class="specs-grid">
        ${specRow(ICONS.ai, "AI Level", r.specs.aiLevel)}
        ${specRow(ICONS.sensor, "Sensors", r.specs.sensors)}
        ${specRow(ICONS.speed, "Speed", r.specs.speed)}
        ${specRow(ICONS.weight, "Weight", r.specs.weight)}
        ${specRow(ICONS.battery, "Battery", r.specs.battery)}
        ${specRow(ICONS.net, "Connectivity", r.specs.connectivity)}
      </div>
      <div class="timeline-section reveal">
        <h3>How It Works</h3>
        <div class="timeline">
          ${r.howItWorks
            .map(
              (s, i) => `
            <div class="timeline-step">
              <div class="timeline-step__num">${i + 1}</div>
              <h4>${s.title}</h4>
              <p>${s.text}</p>
            </div>`
            )
            .join("")}
        </div>
      </div>
      <h3 class="reveal">Use Cases</h3>
      <div class="use-cases">
        ${r.useCases
          .map(
            (u) => `
          <div class="use-case-card reveal">
            <div class="use-case-card__icon">${u.icon}</div>
            <h4>${u.title}</h4>
            <p>${u.text}</p>
          </div>`
          )
          .join("")}
      </div>
      <div class="detail-cta-row reveal">
        <button type="button" class="btn-gradient" id="detail-buy">Buy Now — <span id="detail-price">${formatPrice(0)}</span></button>
        <a href="#/builder" class="btn-outline-glass" data-link>Open in Config Studio</a>
      </div>
    </section>
    </div>
  `;

  root.querySelector("#detail-back")?.addEventListener("click", () => navTo("/robots"));
  animatePrice(root.querySelector("#detail-price"), r.price);
  root.querySelector("#detail-buy")?.addEventListener("click", () => {
    addToCart(r.id, 1);
    document.getElementById("cart-btn")?.click();
  });
}

function specRow(icon, label, value) {
  return `
    <div class="spec-card reveal">
      <div class="spec-card__icon">${icon}</div>
      <div>
        <label>${label}</label>
        <strong>${value}</strong>
      </div>
    </div>
  `;
}
