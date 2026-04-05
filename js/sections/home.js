import { Application } from "https://esm.sh/@splinetool/runtime@1.9.46";

const HERO_SPLINE_SCENE =
  "https://prod.spline.design/4nS-N32yEPboehV2/scene.splinecode";

let splineInstance = null;

export function renderHome(root) {
  root.innerHTML = `
    <div class="landing-page">
      <section class="hero" style="position: relative; overflow: hidden;">
        <div class="hero__vignette" aria-hidden="true"></div>
        <div class="hero__left reveal" style="position: relative; z-index: 2;">
          <p class="hero__eyebrow">NEXUS Robotics</p>
          <h1>Intelligence,<br />Embodied at Scale</h1>
          <p class="hero__sub">Deploy perception-rich robots with a unified OS, fleet governance, and safety-certified motion — from factory floors to clinical corridors.</p>
          <div class="hero__cta-row">
            <a href="#/robots" class="btn-gradient" data-link>Explore lineup</a>
            <a href="#/builder" class="btn-outline-glass" data-link>Open Config Studio</a>
          </div>
          <div class="hero__trust reveal">
            <span>Trusted by teams shipping in production</span>
            <div class="hero__badges">
              <span class="trust-pill">ISO-aligned safety</span>
              <span class="trust-pill">Edge + cloud</span>
              <span class="trust-pill">24/7 fleet SLOs</span>
            </div>
          </div>
        </div>
        <div class="hero__right hero__right--spline reveal" style="position: relative; z-index: 2;">
          <canvas id="spline-canvas" class="hero__spline-canvas" aria-hidden="true"></canvas>
        </div>
      </section>

      <div class="landing-metrics">
        <div class="landing-metric reveal">
          <strong>200+</strong>
          <span>Production fleets under NEXUS Fleet Manager</span>
        </div>
        <div class="landing-metric reveal">
          <strong>47</strong>
          <span>Regions with certified field engineering</span>
        </div>
        <div class="landing-metric reveal">
          <strong>99.2%</strong>
          <span>Target uptime on mission-critical cells</span>
        </div>
        <div class="landing-metric reveal">
          <strong>&lt;50ms</strong>
          <span>Typical closed-loop perception latency at the edge</span>
        </div>
      </div>

      <div class="landing-bento">
        <div class="landing-bento__main reveal">
          <h2>One platform. Every deployment class.</h2>
          <p>NEXUS OS connects simulation, on-robot runtime, and fleet analytics so you train once, promote safely, and observe every unit in the field.</p>
        </div>
        <div class="landing-bento__card reveal">
          <h3>Verified motion &amp; safety</h3>
          <p>Human-aware zones, force limits, and audit-ready logs ship with every SKU — not as an afterthought.</p>
        </div>
        <div class="landing-bento__card reveal">
          <h3>Developer-grade SDK</h3>
          <p>Simulation assets, behavior bundles, and signed deploy pipelines mirror how your software team already ships.</p>
        </div>
      </div>

      <div class="landing-spotlight">
        <div class="landing-spotlight__inner reveal">
          <h2>From catalog robot to your exact spec</h2>
          <p>Browse the lineup, compare payloads and perception packs, then step into Config Studio to lock finishes and options. Your build becomes the manufacturing source of truth.</p>
          <div class="landing-spotlight__actions">
            <a href="#/shop" class="btn-gradient" data-link>Shop hardware</a>
            <a href="#/robots" class="btn-outline-glass" data-link>View technical catalog</a>
          </div>
        </div>
      </div>

      <div class="landing-cta">
        <h2 class="reveal">Ready when your roadmap is</h2>
        <p class="reveal">Talk through compliance, integration, and rollout — or start with a single cell and scale the fleet when metrics prove out.</p>
        <div class="landing-cta__row reveal">
          <a href="#/faq" class="btn-outline-glass" data-link>Support &amp; FAQ</a>
          <a href="#/builder" class="btn-gradient" data-link>Configure a robot</a>
        </div>
      </div>
    </div>
  `;

  const canvas = root.querySelector("#spline-canvas");
  if (!canvas) return;

  function startHeroSpline() {
    if (splineInstance) {
      splineInstance.dispose();
      splineInstance = null;
    }
    splineInstance = new Application(canvas);
    splineInstance
      .load(HERO_SPLINE_SCENE)
      .then(() => console.log("Hero Spline loaded"))
      .catch((err) => console.warn("Hero Spline failed to load:", err));
  }

  requestAnimationFrame(() => requestAnimationFrame(startHeroSpline));
}

export function destroyHome() {
  if (splineInstance) {
    splineInstance.dispose();
    splineInstance = null;
  }
}
