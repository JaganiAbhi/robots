import { mountThreeHero } from "../three-hero.js";

let teardownThree = null;

export function renderHome(root) {
  root.innerHTML = `
    <section class="hero">
      <div class="hero__left reveal">
        <p class="hero__eyebrow">Next-gen robotics</p>
        <h1>The Future<br>Moves With You</h1>
        <p class="hero__sub">NEXUS builds AI-powered robots that think, adapt, and operate autonomously — built for the world of tomorrow.</p>
        <div class="hero__cta-row">
          <a href="#/robots" class="btn-gradient" data-link>Explore Robots</a>
          <a href="#/builder" class="btn-outline-glass" data-link>Build Custom Robot</a>
        </div>
        <div class="hero__trust reveal">
          <span>Trusted by 200+ enterprises</span>
          <div class="hero__badges">
            <span class="trust-pill">ORION Labs</span>
            <span class="trust-pill">Helix Motors</span>
            <span class="trust-pill">Apex Med</span>
            <span class="trust-pill">Vertex Retail</span>
          </div>
        </div>
      </div>
      <div class="hero__right reveal">
        <div class="hero__glow" aria-hidden="true"></div>
        <div class="hero-orbit hero-orbit--1" aria-hidden="true"></div>
        <div class="hero-orbit hero-orbit--2" aria-hidden="true"></div>
        <div class="hero-orbit hero-orbit--3" aria-hidden="true"></div>
        <div class="hero__three-wrap" id="hero-three" aria-label="3D robot visualization"></div>
      </div>
    </section>
    <div class="scroll-hint reveal">
      <span>Scroll</span>
      <span class="scroll-hint__arrow" aria-hidden="true"></span>
      <a href="#/robots" style="margin-top:0.5rem;color:var(--accent-blue);font-size:0.65rem;letter-spacing:0.15em;" data-link>Discover lineup</a>
    </div>
  `;

  const threeEl = root.querySelector("#hero-three");
  if (threeEl) {
    teardownThree = mountThreeHero(threeEl);
  }
}

export function destroyHome() {
  if (typeof teardownThree === "function") {
    teardownThree();
    teardownThree = null;
  }
}
