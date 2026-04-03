import { initCursor } from "./cursor.js";
import { initStarfield } from "./starfield.js";
import { bindScrollReveal } from "./scroll-reveal.js";
import { parseRoute, navTo } from "./router.js";
import { renderCartDrawer, updateCartBadge } from "./cart.js";
import { renderHome, destroyHome } from "./sections/home.js";
import { renderShowcase } from "./sections/showcase.js";
import { renderDetail } from "./sections/detail.js";
import { renderBuilder } from "./sections/builder.js";
import { renderShop } from "./sections/shop.js";
import { renderFaq } from "./sections/faq.js";

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

let teardownCursor = () => {};
let teardownStarfield = () => {};
let unbindReveal = () => {};

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

function navigateAllLinks(e) {
  const a = e.target.closest("[data-link]");
  if (!a) return;
  const href = a.getAttribute("href");
  if (href && href.startsWith("#")) {
    e.preventDefault();
    const path = href.replace("#", "") || "/";
    navTo(path);
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function updateActiveNav(route) {
  document.querySelectorAll(".nav-center a, .mobile-nav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const path = href.replace("#", "") || "/";
    let active = false;
    if (route.name === "home" && (path === "/" || path === "/home")) active = true;
    if (route.name === "robots" && path === "/robots") active = true;
    if (route.name === "detail" && path === "/robots") active = true;
    if (route.name === "shop" && path === "/shop") active = true;
    if (route.name === "builder" && path === "/builder") active = true;
    if (route.name === "faq" && path === "/faq") active = true;
    link.classList.toggle("is-active", active);
  });
}

function renderRoute(route) {
  destroyHome();
  unbindReveal();

  app.classList.remove("page-transition");
  void app.offsetWidth;
  app.classList.add("page-transition");

  switch (route.name) {
    case "home":
      renderHome(app);
      break;
    case "robots":
      renderShowcase(app);
      break;
    case "detail":
      renderDetail(app, route.id);
      break;
    case "builder":
      renderBuilder(app);
      break;
    case "shop":
      renderShop(app);
      break;
    case "faq":
      renderFaq(app);
      break;
    default:
      renderHome(app);
  }

  unbindReveal = bindScrollReveal(app);
  updateActiveNav(route);
}

function onHashChange() {
  const route = parseRoute();
  if (route.name === "home" && location.hash && location.hash !== "#/" && location.hash !== "#") {
    /* allow */
  }
  renderRoute(route);
}

function init() {
  teardownCursor = initCursor();
  teardownStarfield = initStarfield();

  document.addEventListener("click", navigateAllLinks);

  window.addEventListener("scroll", setHeaderScrolled, { passive: true });
  setHeaderScrolled();

  window.addEventListener("hashchange", onHashChange);
  if (!location.hash || location.hash === "#") {
    location.replace("#/");
  }
  onHashChange();

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
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#" || href.length <= 1) return;
      e.preventDefault();
      navTo(href.slice(1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

init();
