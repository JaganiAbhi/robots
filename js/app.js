import { initCursor } from "./cursor.js";
import { bindScrollReveal } from "./scroll-reveal.js";
import { renderCartDrawer, updateCartBadge } from "./cart.js";
import { renderHome, destroyHome } from "./sections/home.js";
import { renderShowcase } from "./sections/showcase.js";
import { renderDetail } from "./sections/detail.js";
import { renderBuilder, destroyBuilder } from "./sections/builder.js";
import { renderShop } from "./sections/shop.js";
import { renderFaq } from "./sections/faq.js";
import { parseRoute, navTo, hrefToNavPath } from "./router.js";
import { getRobotById } from "./data/robots.js";

const app = document.getElementById("app");
const header = document.getElementById("site-header");
const cartBtn = document.getElementById("cart-btn");
const cartDrawer = document.getElementById("cart-drawer");
const cartBackdrop = document.getElementById("cart-backdrop");
const cartClose = document.getElementById("cart-close");
const cartBody = document.getElementById("cart-drawer-body");
const cartTotal = document.getElementById("cart-total-price");
const cartBadge = document.getElementById("cart-badge");
const hamburger = document.getElementById("hamburger");
const mobileOverlay = document.getElementById("mobile-overlay");
const themeToggleBtn = document.getElementById("theme-toggle");

let teardownCursor = () => {};
let unbindReveal = () => {};
let teardownRoute = () => {};

const BASE_TITLE = "NEXUS — Intelligence. Embodied.";

function setHeaderScrolled() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 80);
}

function closeMobileMenu() {
  if (!mobileOverlay || !hamburger) return;
  mobileOverlay.hidden = true;
  hamburger.setAttribute("aria-expanded", "false");
}

function openCart() {
  cartDrawer?.classList.add("is-open");
  cartDrawer?.setAttribute("aria-hidden", "false");
  renderCartDrawer(cartBody, cartTotal);
}

function closeCart() {
  cartDrawer?.classList.remove("is-open");
  cartDrawer?.setAttribute("aria-hidden", "true");
}

function setDocumentTitle(route) {
  if (route.name === "detail" && route.id) {
    const r = getRobotById(route.id);
    document.title = r ? `${r.name} — NEXUS` : BASE_TITLE;
    return;
  }
  const titles = {
    home: BASE_TITLE,
    robots: "Robot lineup — NEXUS",
    shop: "Shop — NEXUS",
    builder: "Config Studio — NEXUS",
    faq: "Support & FAQ — NEXUS",
  };
  document.title = titles[route.name] || BASE_TITLE;
}

function updateNavActive(route) {
  document.querySelectorAll(".nav-center a[data-link], .mobile-nav a[data-link]").forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.remove("is-active");
    if (!href?.startsWith("#")) return;
    const path = hrefToNavPath(href);
    const isHome = link.textContent.trim() === "Home";
    if (isHome) {
      if (route.name === "home") link.classList.add("is-active");
      return;
    }
    if (route.name === "detail" && path === "/robots") {
      link.classList.add("is-active");
      return;
    }
    if (path === route.path) link.classList.add("is-active");
  });
}

function renderRoute() {
  if (!app) return;

  teardownRoute();
  teardownRoute = () => {};

  window.scrollTo(0, 0);

  const route = parseRoute();
  setDocumentTitle(route);
  updateNavActive(route);

  switch (route.name) {
    case "home":
      renderHome(app);
      teardownRoute = destroyHome;
      break;
    case "robots":
      renderShowcase(app);
      break;
    case "shop":
      renderShop(app);
      break;
    case "builder":
      renderBuilder(app);
      teardownRoute = destroyBuilder;
      break;
    case "faq":
      renderFaq(app);
      break;
    case "detail":
      renderDetail(app, route.id);
      break;
    default:
      renderHome(app);
      teardownRoute = destroyHome;
  }

  unbindReveal();
  unbindReveal = bindScrollReveal(app);
}

function navigateAllLinks(e) {
  const a = e.target.closest("[data-link]");
  if (!a) return;
  const href = a.getAttribute("href");
  if (!href || !href.startsWith("#")) return;
  if (href === "#" || href === "#!") return;
  e.preventDefault();
  closeMobileMenu();
  navTo(hrefToNavPath(href));
}

function initTheme() {
  const savedTheme = localStorage.getItem("nexus-theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
  
  if (!themeToggleBtn) return;
  
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    // Toggle standard DOM values
    if (newTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("nexus-theme", "light");
      themeToggleBtn.innerHTML = `
        <svg class="theme-icon-moon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("nexus-theme", "dark");
      themeToggleBtn.innerHTML = `
        <svg class="theme-icon-sun" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    }
  });

  // Sync initial button state
  const curTheme = document.documentElement.getAttribute("data-theme") || "dark";
  if (curTheme === "light" && themeToggleBtn) {
    themeToggleBtn.innerHTML = `
      <svg class="theme-icon-moon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }
}

function init() {
  initTheme();
  teardownCursor = initCursor();

  document.addEventListener("click", navigateAllLinks);

  window.addEventListener("hashchange", () => {
    renderRoute();
    setHeaderScrolled();
  });

  window.addEventListener("scroll", setHeaderScrolled, { passive: true });
  setHeaderScrolled();

  if (!location.hash || location.hash === "#") {
    location.replace("#/");
  } else {
    renderRoute();
  }

  cartBtn?.addEventListener("click", openCart);
  cartBackdrop?.addEventListener("click", closeCart);
  cartClose?.addEventListener("click", closeCart);
  document.getElementById("cart-checkout")?.addEventListener("click", () => {
    alert("Checkout opens a secure NEXUS payment session. This demo stops here.");
    closeCart();
  });

  window.addEventListener("nexus-cart", () => {
    updateCartBadge(cartBadge);
    renderCartDrawer(cartBody, cartTotal);
  });
  updateCartBadge(cartBadge);

  hamburger?.addEventListener("click", () => {
    if (mobileOverlay?.hidden) {
      mobileOverlay.hidden = false;
      hamburger.setAttribute("aria-expanded", "true");
    } else {
      closeMobileMenu();
    }
  });
  mobileOverlay?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => closeMobileMenu());
  });

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    if (a.hasAttribute("data-link")) return;
    a.addEventListener("click", (ev) => {
      const href = a.getAttribute("href");
      if (!href || href === "#" || href.length <= 1) return;
      if (href.startsWith("#/")) return;
      ev.preventDefault();
      const id = href.replace("#", "");
      const target = document.getElementById(id);
      if (target) {
        const yOffset = -90;
        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  });
}

init();
