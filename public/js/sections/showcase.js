import { ROBOTS } from "../data/robots.js";
import { initCardTilt } from "../utils/tilt.js";
import { navTo } from "../router.js";

const CATS = ["All", "Industrial", "Service", "Medical", "Personal"];

function badge(cat) {
  const m = {
    Industrial: "badge--industrial",
    Service: "badge--service",
    Medical: "badge--medical",
    Personal: "badge--personal",
  };
  return m[cat] || "badge--industrial";
}

export function renderShowcase(root) {
  root.innerHTML = `
    <section class="section showcase">
      <div class="showcase__head reveal">
        <h2>Our Robots</h2>
        <span class="showcase__underline" id="showcase-line"></span>
      </div>
      <div class="filter-tabs reveal" id="filter-tabs" role="tablist"></div>
      <div class="robot-grid" id="robot-grid"></div>
    </section>
  `;

  const tabs = root.querySelector("#filter-tabs");
  const grid = root.querySelector("#robot-grid");
  const line = root.querySelector("#showcase-line");

  let active = "All";

  function renderTabs() {
    tabs.innerHTML = CATS.map(
      (c) =>
        `<button type="button" role="tab" class="${c === active ? "is-active" : ""}" data-cat="${c}">${c}</button>`
    ).join("");
    tabs.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        active = btn.dataset.cat;
        renderTabs();
        renderGrid();
      });
    });
  }

  function renderGrid() {
    const list =
      active === "All" ? ROBOTS : ROBOTS.filter((r) => r.category === active);
    grid.innerHTML = list
      .map(
        (r) => `
      <article class="robot-card tilt-card reveal" data-id="${r.id}">
        <div class="robot-card__inner tilt-card__inner">
          <span class="robot-card__badge ${badge(r.category)}">${r.category}</span>
          <div class="robot-card__img-wrap">
            <img src="${r.image}" alt="${r.name} product render" width="200" height="200" loading="lazy" />
          </div>
          <h3>${r.name}</h3>
          <p>${r.shortBlurb}</p>
          <div class="feature-pills">
            ${r.features.map((f) => `<span>${f}</span>`).join("")}
          </div>
          <button type="button" class="btn-ghost-full" data-detail="${r.id}">View Details</button>
        </div>
      </article>
    `
      )
      .join("");

    grid.querySelectorAll("[data-detail]").forEach((btn) => {
      btn.addEventListener("click", () => {
        navTo(`/robot/${btn.dataset.detail}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    initCardTilt(grid, ".tilt-card", ".tilt-card__inner");
  }

  renderTabs();
  renderGrid();

  requestAnimationFrame(() => {
    const ioLine = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            line.classList.add("is-drawn");
            ioLine.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    if (line) ioLine.observe(line);
  });
}
