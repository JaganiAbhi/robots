import { formatPrice } from "../data/robots.js";

const TYPES = [
  { id: "Industrial", label: "Industrial", desc: "Factory-grade power and throughput." },
  { id: "Service", label: "Service", desc: "Indoor navigation and guest interaction." },
  { id: "Medical", label: "Medical", desc: "Sterile workflows and precision tooling." },
  { id: "Personal", label: "Personal", desc: "Adaptive assistance for daily life." },
];

const COLORS = ["#00d4ff", "#7b2fff", "#00ffb4", "#ff9f43", "#ff4d6d"];

function computePrice(state) {
  let p = 12000;
  const base = { Industrial: 45000, Service: 28000, Medical: 62000, Personal: 12000 };
  p = base[state.type] || 12000;
  if (state.vision) p += 4200;
  if (state.voice) p += 2800;
  if (state.mobility) p += 3600;
  p += state.aiLevel * 1800;
  if (state.finish === "Glossy") p += 900;
  if (state.finish === "Carbon") p += 2400;
  return p;
}

function previewSvg(state) {
  const c = state.color;
  return `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#7b2fff" stop-opacity="0.15"/>
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="100" cy="210" rx="70" ry="14" fill="url(#bg)" opacity="0.5"/>
      <g filter="url(#glow)">
        <rect x="72" y="48" width="56" height="52" rx="10" fill="#0a1525" stroke="${c}" stroke-width="2"/>
        <rect x="84" y="58" width="32" height="10" rx="3" fill="${c}" opacity="0.6"/>
        <rect x="78" y="100" width="44" height="56" rx="8" fill="#0d1828" stroke="${c}" stroke-width="1.5"/>
        <rect x="52" y="72" width="18" height="48" rx="6" fill="#0d1828" stroke="${c}"/>
        <rect x="130" y="72" width="18" height="48" rx="6" fill="#0d1828" stroke="${c}"/>
        <rect x="70" y="158" width="22" height="52" rx="8" fill="#0d1828" stroke="${c}"/>
        <rect x="108" y="158" width="22" height="52" rx="8" fill="#0d1828" stroke="${c}"/>
        <circle cx="100" cy="40" r="18" fill="#0a1525" stroke="${c}" stroke-width="2"/>
        <rect x="88" y="34" width="24" height="8" rx="2" fill="${c}" opacity="0.7"/>
      </g>
    </svg>
  `;
}

export function renderBuilder(root) {
  const state = {
    type: "Industrial",
    vision: true,
    voice: false,
    mobility: true,
    aiLevel: 3,
    color: COLORS[0],
    finish: "Matte",
    step: 1,
  };

  root.innerHTML = `
    <section class="section builder-page">
      <div class="builder-panel reveal">
        <div class="progress-wrap">
          <p style="margin:0 0 0.5rem;font-size:0.8rem;color:var(--text-muted);">Step <span id="b-step-num">1</span> of 4</p>
          <div class="progress-bar"><div class="progress-bar__fill" id="b-progress"></div></div>
        </div>
        <div id="b-step-body"></div>
        <div class="builder-nav">
          <button type="button" id="b-prev">Previous</button>
          <button type="button" id="b-next">Next</button>
        </div>
      </div>
      <div class="builder-preview reveal">
        <h3 style="margin:0;font-size:1rem;">Your Build</h3>
        <div class="builder-preview__svg-wrap" id="b-preview-svg"></div>
        <div class="price-badge" id="b-price">${formatPrice(computePrice(state))}</div>
        <p class="delivery-badge">Estimated Delivery: 6–8 weeks</p>
      </div>
    </section>
  `;

  const body = root.querySelector("#b-step-body");
  const progress = root.querySelector("#b-progress");
  const stepNum = root.querySelector("#b-step-num");
  const priceEl = root.querySelector("#b-price");
  const preview = root.querySelector("#b-preview-svg");
  const prevBtn = root.querySelector("#b-prev");
  const nextBtn = root.querySelector("#b-next");

  let countAnim = null;

  function animatePriceTo(n) {
    const start = performance.now();
    const from = parseInt(priceEl.dataset.val || "0", 10) || 0;
    const dur = 700;
    priceEl.dataset.val = String(n);
    function frame(now) {
      const t = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - t, 3);
      const v = Math.round(from + (n - from) * ease);
      priceEl.textContent = formatPrice(v);
      if (t < 1) countAnim = requestAnimationFrame(frame);
    }
    cancelAnimationFrame(countAnim);
    countAnim = requestAnimationFrame(frame);
  }

  function refreshPrice() {
    const p = computePrice(state);
    animatePriceTo(p);
  }

  function renderStep() {
    stepNum.textContent = String(state.step);
    progress.style.width = `${(state.step / 4) * 100}%`;
    prevBtn.disabled = state.step === 1;
    nextBtn.style.display = state.step === 4 ? "none" : "";
    nextBtn.textContent = "Next";

    if (state.step === 1) {
      body.innerHTML = `
        <h3 class="step-title">Robot Type</h3>
        <div class="type-grid" id="type-grid">
          ${TYPES.map(
            (t) => `
            <button type="button" class="type-card ${state.type === t.id ? "is-selected" : ""}" data-type="${t.id}">
              <span class="type-card__check">✓</span>
              <h4>${t.label}</h4>
              <p>${t.desc}</p>
            </button>`
          ).join("")}
        </div>
      `;
      body.querySelectorAll(".type-card").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.type = btn.dataset.type;
          renderStep();
          refreshPrice();
          preview.innerHTML = previewSvg(state);
        });
      });
    } else if (state.step === 2) {
      body.innerHTML = `
        <h3 class="step-title">Features</h3>
        <div class="toggle-row">
          <span>AI Vision</span>
          <button type="button" class="toggle-switch ${state.vision ? "is-on" : ""}" id="tog-vision" aria-pressed="${state.vision}"></button>
        </div>
        <div class="toggle-row">
          <span>Voice Control</span>
          <button type="button" class="toggle-switch ${state.voice ? "is-on" : ""}" id="tog-voice" aria-pressed="${state.voice}"></button>
        </div>
        <div class="toggle-row">
          <span>Mobility Level</span>
          <button type="button" class="toggle-switch ${state.mobility ? "is-on" : ""}" id="tog-mob" aria-pressed="${state.mobility}"></button>
        </div>
        <div class="range-wrap">
          <label><span>AI Processing Level</span><span id="ai-lvl-lbl">${state.aiLevel}</span></label>
          <input type="range" class="glow-range" id="ai-range" min="1" max="5" value="${state.aiLevel}" />
        </div>
      `;
      const bindToggle = (id, key) => {
        const el = body.querySelector(id);
        el?.addEventListener("click", () => {
          state[key] = !state[key];
          el.classList.toggle("is-on", state[key]);
          el.setAttribute("aria-pressed", state[key]);
          refreshPrice();
        });
      };
      bindToggle("#tog-vision", "vision");
      bindToggle("#tog-voice", "voice");
      bindToggle("#tog-mob", "mobility");
      const range = body.querySelector("#ai-range");
      const lbl = body.querySelector("#ai-lvl-lbl");
      range?.addEventListener("input", () => {
        state.aiLevel = Number(range.value);
        if (lbl) lbl.textContent = String(state.aiLevel);
        refreshPrice();
      });
    } else if (state.step === 3) {
      body.innerHTML = `
        <h3 class="step-title">Appearance</h3>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-top:0;">Accent color</p>
        <div class="swatches" id="swatches">
          ${COLORS.map(
            (c, i) =>
              `<button type="button" class="swatch ${state.color === c ? "is-active" : ""}" style="background:${c}" data-color="${c}" aria-label="Color ${i + 1}"></button>`
          ).join("")}
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);">Finish</p>
        <div class="finish-tabs" id="finish-tabs">
          ${["Matte", "Glossy", "Carbon"].map(
            (f) =>
              `<button type="button" class="${state.finish === f ? "is-active" : ""}" data-finish="${f}">${f}</button>`
          ).join("")}
        </div>
      `;
      body.querySelectorAll(".swatch").forEach((sw) => {
        sw.addEventListener("click", () => {
          state.color = sw.dataset.color;
          body.querySelectorAll(".swatch").forEach((s) => s.classList.toggle("is-active", s.dataset.color === state.color));
          preview.innerHTML = previewSvg(state);
        });
      });
      body.querySelectorAll("#finish-tabs button").forEach((fb) => {
        fb.addEventListener("click", () => {
          state.finish = fb.dataset.finish;
          body.querySelectorAll("#finish-tabs button").forEach((b) => b.classList.toggle("is-active", b.dataset.finish === state.finish));
          refreshPrice();
        });
      });
    } else {
      const p = computePrice(state);
      body.innerHTML = `
        <h3 class="step-title">Summary</h3>
        <div class="summary-lines">
          <div><span>Type</span><span>${state.type}</span></div>
          <div><span>AI Vision</span><span>${state.vision ? "Yes" : "No"}</span></div>
          <div><span>Voice</span><span>${state.voice ? "Yes" : "No"}</span></div>
          <div><span>Mobility</span><span>${state.mobility ? "Yes" : "No"}</span></div>
          <div><span>AI Level</span><span>${state.aiLevel}</span></div>
          <div><span>Finish</span><span>${state.finish}</span></div>
          <div><span>Total</span><span>${formatPrice(p)}</span></div>
        </div>
        <button type="button" class="btn-gradient full cta-glow-pulse" id="b-submit">Submit Order</button>
      `;
      body.querySelector("#b-submit")?.addEventListener("click", () => {
        alert("Thank you. A NEXUS specialist will contact you within one business day to confirm configuration and delivery.");
      });
    }
    preview.innerHTML = previewSvg(state);
  }

  prevBtn.addEventListener("click", () => {
    if (state.step > 1) {
      state.step--;
      renderStep();
    }
  });
  nextBtn.addEventListener("click", () => {
    if (state.step < 4) {
      state.step++;
      renderStep();
      refreshPrice();
    }
  });

  priceEl.dataset.val = String(computePrice(state));
  renderStep();
  refreshPrice();
}
