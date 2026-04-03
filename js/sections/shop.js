import { ROBOTS, formatPrice } from "../data/robots.js";
import { addToCart } from "../cart.js";
import { navTo } from "../router.js";
import { initCardTilt } from "../utils/tilt.js";
import { bindScrollReveal } from "../scroll-reveal.js";

export function renderShop(root) {
  const minP = Math.min(...ROBOTS.map((r) => r.price));
  const maxP = Math.max(...ROBOTS.map((r) => r.price));

  let rangeMin = minP;
  let rangeMax = maxP;
  const selTypes = new Set();
  const selUse = new Set();

  const useCases = [
    "Factory automation",
    "Hospitality",
    "Clinical assistance",
    "Home assistance",
  ];

  let teardownReveal = () => {};

  root.innerHTML = `
    <section class="section shop-page">
      <button type="button" class="sidebar-toggle" id="shop-filter-toggle">Filters</button>
      <aside class="shop-sidebar reveal">
        <div class="shop-filters" id="shop-filters">
          <h3>Price</h3>
          <div class="dual-range" id="dual-range">
            <div class="dual-range__track"></div>
            <div class="dual-range__fill" id="range-fill"></div>
            <input type="range" id="r-min" min="${minP}" max="${maxP}" value="${rangeMin}" />
            <input type="range" id="r-max" min="${minP}" max="${maxP}" value="${rangeMax}" />
          </div>
          <p style="font-size:0.8rem;color:var(--text-muted);margin:-0.5rem 0 1rem;">
            <span id="lbl-min">${formatPrice(rangeMin)}</span> — <span id="lbl-max">${formatPrice(rangeMax)}</span>
          </p>
          <h3>Type</h3>
          ${["Industrial", "Service", "Medical", "Personal"]
            .map(
              (t) => `
            <label class="check-glass">
              <input type="checkbox" data-type="${t}" />
              <span class="check-glass__box"><svg viewBox="0 0 24 24"><polyline points="4 12 9 17 20 6"/></svg></span>
              ${t}
            </label>`
            )
            .join("")}
          <h3 style="margin-top:1rem;">Use case</h3>
          ${useCases
            .map(
              (u) => `
            <label class="check-glass">
              <input type="checkbox" data-use="${u}" />
              <span class="check-glass__box"><svg viewBox="0 0 24 24"><polyline points="4 12 9 17 20 6"/></svg></span>
              ${u}
            </label>`
            )
            .join("")}
        </div>
      </aside>
      <div class="shop-grid" id="shop-grid"></div>
    </section>
  `;

  const grid = root.querySelector("#shop-grid");
  const fill = root.querySelector("#range-fill");
  const rMin = root.querySelector("#r-min");
  const rMax = root.querySelector("#r-max");
  const lblMin = root.querySelector("#lbl-min");
  const lblMax = root.querySelector("#lbl-max");
  const toggle = root.querySelector("#shop-filter-toggle");
  const filters = root.querySelector("#shop-filters");

  toggle?.addEventListener("click", () => {
    filters?.classList.toggle("is-open");
  });

  function updateRangeUI() {
    let a = Number(rMin.value);
    let b = Number(rMax.value);
    if (a > b) {
      const t = a;
      a = b;
      b = t;
      rMin.value = String(a);
      rMax.value = String(b);
    }
    rangeMin = a;
    rangeMax = b;
    const span = maxP - minP || 1;
    const left = ((a - minP) / span) * 100;
    const rightPct = ((b - minP) / span) * 100;
    fill.style.left = left + "%";
    fill.style.width = Math.max(0, rightPct - left) + "%";
    lblMin.textContent = formatPrice(a);
    lblMax.textContent = formatPrice(b);
    renderProducts();
  }

  function renderProducts() {
    const list = ROBOTS.filter((r) => {
      if (r.price < rangeMin || r.price > rangeMax) return false;
      if (selTypes.size && !selTypes.has(r.category)) return false;
      if (selUse.size) {
        const map = {
          "Factory automation": "Industrial",
          Hospitality: "Service",
          "Clinical assistance": "Medical",
          "Home assistance": "Personal",
        };
        let ok = false;
        selUse.forEach((u) => {
          if (map[u] === r.category) ok = true;
        });
        if (!ok) return false;
      }
      return true;
    });

    grid.innerHTML = list
      .map(
        (r) => `
      <article class="shop-card tilt-card reveal" data-id="${r.id}">
        <div class="shop-card__inner tilt-card__inner">
          <span class="robot-card__badge ${r.badgeClass}">${r.category}</span>
          <div class="robot-card__img-wrap" style="height:140px;">
            <img src="${r.image}" alt="" width="160" height="160" loading="lazy" />
          </div>
          <h3 style="font-size:1.1rem;margin:0.5rem 0 0;">${r.name}</h3>
          <div class="shop-card__price">${formatPrice(r.price)}</div>
          <div class="shop-card__quick">${r.shopQuick.map((s) => `• ${s}`).join("<br/>")}</div>
          <div class="shop-card__actions">
            <button type="button" class="btn-add" data-add="${r.id}">Add to Cart</button>
            <button type="button" class="btn-buy" data-buy="${r.id}">Buy Now</button>
          </div>
          <div class="shop-card__overlay">
            <button type="button" class="btn-outline-glass" data-quick="${r.id}">Quick View</button>
          </div>
        </div>
      </article>
    `
      )
      .join("");

    grid.querySelectorAll("[data-add]").forEach((b) =>
      b.addEventListener("click", () => addToCart(b.dataset.add, 1))
    );
    grid.querySelectorAll("[data-buy]").forEach((b) =>
      b.addEventListener("click", () => {
        addToCart(b.dataset.buy, 1);
        document.getElementById("cart-btn")?.click();
      })
    );
    grid.querySelectorAll("[data-quick]").forEach((b) =>
      b.addEventListener("click", () => navTo(`/robot/${b.dataset.quick}`))
    );

    initCardTilt(grid, ".tilt-card", ".tilt-card__inner");

    // Re-bind scroll reveal after re-rendering cards (filters change content).
    teardownReveal();
    grid.querySelectorAll(".reveal").forEach((el) => el.classList.remove("is-visible"));
    teardownReveal = bindScrollReveal(grid);
  }

  rMin.addEventListener("input", updateRangeUI);
  rMax.addEventListener("input", updateRangeUI);

  root.querySelectorAll('input[type="checkbox"][data-type]').forEach((cb) => {
    cb.addEventListener("change", () => {
      if (cb.checked) selTypes.add(cb.dataset.type);
      else selTypes.delete(cb.dataset.type);
      renderProducts();
    });
  });
  root.querySelectorAll('input[type="checkbox"][data-use]').forEach((cb) => {
    cb.addEventListener("change", () => {
      if (cb.checked) selUse.add(cb.dataset.use);
      else selUse.delete(cb.dataset.use);
      renderProducts();
    });
  });

  updateRangeUI();
}
