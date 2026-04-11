import { initCursor } from './cursor.js';
import { bindScrollReveal } from './scroll-reveal.js';
import { renderCartDrawer, updateCartBadge, syncCartFromServer, clearCartLocal } from './cart.js';
import { renderHome, destroyHome } from './sections/home.js';
import { renderShowcase } from './sections/showcase.js';
import { renderDetail } from './sections/detail.js';
import { renderBuilder, destroyBuilder } from './sections/builder.js';
import { renderShop } from './sections/shop.js';
import { renderFaq } from './sections/faq.js';
import { renderCheckout } from './sections/checkout.js';
import { renderLogin, renderSignup } from './sections/auth.js';
import { renderOrders } from './sections/orders.js';
import { parseRoute, navTo, hrefToNavPath } from './router.js';
import { getRobotById } from './data/robots.js';
import { isLoggedIn, getAuthUser, clearAuth } from './utils/nexus-auth.js';

// ── DOM refs ──────────────────────────────────────────────────────────────────
const app          = document.getElementById('app');
const header       = document.getElementById('site-header');
const cartBtn      = document.getElementById('cart-btn');
const cartDrawer   = document.getElementById('cart-drawer');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartClose    = document.getElementById('cart-close');
const cartBody     = document.getElementById('cart-drawer-body');
const cartTotal    = document.getElementById('cart-total-price');
const cartBadge    = document.getElementById('cart-badge');
const hamburger    = document.getElementById('hamburger');
const mobileClose  = document.getElementById('mobile-close');
const mobileOverlay= document.getElementById('mobile-overlay');
const themeToggleBtn = document.getElementById('theme-toggle');

// Nav auth slots
const navAuthDesktop = document.getElementById('nav-auth-desktop');
const navAuthMobile  = document.getElementById('nav-auth-mobile');

let teardownCursor = () => {};
let unbindReveal   = () => {};
let teardownRoute  = () => {};

const BASE_TITLE = 'NEXUS — Intelligence. Embodied.';

// ── Navbar auth rendering ─────────────────────────────────────────────────────
function renderNavAuth() {
  const loggedIn  = isLoggedIn();
  const user      = getAuthUser();
  const firstName = user?.name?.split(' ')[0] || 'Account';
  const initials  = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  /* ── Desktop ─────────────────────────────────────────────────────── */
  const desktopHTML = loggedIn ? `
    <a href="#/orders" data-link class="nav-auth-link orders-link">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
      Orders
    </a>
    <div class="nav-user-menu" id="nav-user-menu">
      <button type="button" class="nav-avatar-btn" id="nav-avatar-btn"
              aria-haspopup="true" aria-expanded="false">
        <span class="nav-avatar">${initials}</span>
        <span class="nav-avatar-name">${firstName}</span>
        <svg class="nav-avatar-chevron" width="12" height="12" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div class="nav-dropdown" id="nav-dropdown" aria-hidden="true">
        <div class="nav-dropdown__header">
          <span class="nav-dropdown__avatar">${initials}</span>
          <div>
            <div class="nav-dropdown__name">${user?.name || 'User'}</div>
            <div class="nav-dropdown__email">${user?.email || ''}</div>
          </div>
        </div>
        <div class="nav-dropdown__divider"></div>
        <a href="#/orders" data-link class="nav-dropdown__item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
          </svg>
          My Orders
        </a>
        <button type="button" class="nav-dropdown__item nav-dropdown__logout" id="logout-btn-desktop">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  ` : `
    <a href="#/login"  data-link class="btn-nav-ghost">Log In</a>
    <a href="#/signup" data-link class="btn-nav-cta">Sign Up</a>
  `;

  /* ── Mobile ──────────────────────────────────────────────────────── */
  const mobileHTML = loggedIn ? `
    <div class="mobile-divider"></div>
    <a href="#/orders" data-link>
      <span class="mobile-nav__icon">📦</span> My Orders
    </a>
    <button type="button" class="mobile-logout-btn" id="logout-btn-mobile">
      <span class="mobile-nav__icon">🚪</span> Sign Out
    </button>
  ` : `
    <div class="mobile-divider"></div>
    <a href="#/login"  data-link>
      <span class="mobile-nav__icon">🔑</span> Log In
    </a>
    <a href="#/signup" data-link>
      <span class="mobile-nav__icon">✨</span> Sign Up
    </a>
  `;

  if (navAuthDesktop) navAuthDesktop.innerHTML = desktopHTML;
  if (navAuthMobile)  navAuthMobile.innerHTML  = mobileHTML;

  /* ── Avatar dropdown logic ───────────────────────────────────────── */
  const avatarBtn = document.getElementById('nav-avatar-btn');
  const dropdown  = document.getElementById('nav-dropdown');
  if (avatarBtn && dropdown) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle('is-open');
      avatarBtn.setAttribute('aria-expanded', String(open));
      dropdown.setAttribute('aria-hidden',   String(!open));
    });
    // Close when clicking anywhere else
    document.addEventListener('click', () => {
      dropdown.classList.remove('is-open');
      avatarBtn.setAttribute('aria-expanded', 'false');
    });
  }

  /* ── Logout ──────────────────────────────────────────────────────── */
  ['logout-btn-desktop', 'logout-btn-mobile'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', async () => {
      clearAuth();
      await clearCartLocal();
      navTo('/');
    });
  });
}

// ── Header scroll ─────────────────────────────────────────────────────────────
function setHeaderScrolled() {
  header?.classList.toggle('is-scrolled', window.scrollY > 80);
}

// ── Mobile menu ───────────────────────────────────────────────────────────────
function closeMobileMenu() {
  if (!mobileOverlay || !hamburger) return;
  mobileOverlay.hidden = true;
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.classList.remove('is-open');
}

// ── Cart drawer ───────────────────────────────────────────────────────────────
function openCart() {
  cartDrawer?.classList.add('is-open');
  cartDrawer?.setAttribute('aria-hidden', 'false');
  renderCartDrawer(cartBody, cartTotal);
}

function closeCart() {
  cartDrawer?.classList.remove('is-open');
  cartDrawer?.setAttribute('aria-hidden', 'true');
}

// ── Document title ────────────────────────────────────────────────────────────
function setDocumentTitle(route) {
  if (route.name === 'detail' && route.id) {
    const r = getRobotById(route.id);
    document.title = r ? `${r.name} — NEXUS` : BASE_TITLE;
    return;
  }
  const titles = {
    home:     BASE_TITLE,
    robots:   'Robot lineup — NEXUS',
    shop:     'Shop — NEXUS',
    builder:  'Config Studio — NEXUS',
    faq:      'Support & FAQ — NEXUS',
    checkout: 'Checkout — NEXUS',
    login:    'Sign In — NEXUS',
    signup:   'Create Account — NEXUS',
    orders:   'My Orders — NEXUS',
  };
  document.title = titles[route.name] || BASE_TITLE;
}

// ── Active nav link ───────────────────────────────────────────────────────────
function updateNavActive(route) {
  document.querySelectorAll('.nav-center a[data-link], .mobile-nav a[data-link]').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.remove('is-active');
    if (!href?.startsWith('#')) return;
    const path   = hrefToNavPath(href);
    const isHome = link.textContent.trim() === 'Home';
    if (isHome) { if (route.name === 'home') link.classList.add('is-active'); return; }
    if (route.name === 'detail' && path === '/robots') { link.classList.add('is-active'); return; }
    if (path === route.path) link.classList.add('is-active');
  });
}

// ── Route renderer ────────────────────────────────────────────────────────────
function renderRoute() {
  if (!app) return;
  
  // Blur active element to prevent orphaned focus triggering aria-hidden errors across navigation
  if (document.activeElement && document.activeElement !== document.body) {
    document.activeElement.blur();
  }

  teardownRoute();
  teardownRoute = () => {};
  window.scrollTo(0, 0);

  const route = parseRoute();
  setDocumentTitle(route);
  updateNavActive(route);

  switch (route.name) {
    case 'home':     renderHome(app);                 teardownRoute = destroyHome;    break;
    case 'robots':   renderShowcase(app);                                             break;
    case 'shop':     renderShop(app);                                                 break;
    case 'builder':  renderBuilder(app);              teardownRoute = destroyBuilder; break;
    case 'faq':      renderFaq(app);                                                  break;
    case 'checkout': renderCheckout(app);                                             break;
    case 'login':    renderLogin(app);                                                break;
    case 'signup':   renderSignup(app);                                               break;
    case 'orders':   renderOrders(app);                                               break;
    case 'detail':   renderDetail(app, route.id);                                     break;
    default:         renderHome(app);                 teardownRoute = destroyHome;
  }

  unbindReveal();
  unbindReveal = bindScrollReveal(app);
}

// ── Navigation handler ────────────────────────────────────────────────────────
function navigateAllLinks(e) {
  const a = e.target.closest('[data-link]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || !href.startsWith('#')) return;
  if (href === '#' || href === '#!') return;
  e.preventDefault();
  closeMobileMenu();
  closeCart();
  navTo(hrefToNavPath(href));
}

// ── Theme toggle ──────────────────────────────────────────────────────────────
function initTheme() {
  const savedTheme = localStorage.getItem('nexus-theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn?.addEventListener('click', () => {
    const cur    = document.documentElement.getAttribute('data-theme') || 'dark';
    const newT   = cur === 'dark' ? 'light' : 'dark';
    if (newT === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('nexus-theme', 'light');
      themeToggleBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('nexus-theme', 'dark');
      themeToggleBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    }
  });

  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  if (cur === 'light') {
    themeToggleBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
async function init() {
  initTheme();
  teardownCursor = initCursor();

  // Initial nav render
  renderNavAuth();

  // Re-render nav on auth state change
  window.addEventListener('nexus-auth', () => {
    renderNavAuth();
    updateCartBadge(cartBadge);
    renderCartDrawer(cartBody, cartTotal);
  });

  document.addEventListener('click', navigateAllLinks);

  window.addEventListener('hashchange', () => {
    renderRoute();
    setHeaderScrolled();
  });

  window.addEventListener('scroll', setHeaderScrolled, { passive: true });
  setHeaderScrolled();

  // Sync cart from server if already logged in
  if (isLoggedIn()) await syncCartFromServer();

  if (!location.hash || location.hash === '#') {
    location.replace('#/');
  } else {
    renderRoute();
  }

  // Cart drawer bindings
  cartBtn?.addEventListener('click', openCart);
  cartBackdrop?.addEventListener('click', closeCart);
  cartClose?.addEventListener('click', closeCart);

  document.getElementById('cart-checkout')?.addEventListener('click', () => {
    closeCart();
    navTo('/checkout');
  });

  // Update cart UI
  window.addEventListener('nexus-cart', () => {
    updateCartBadge(cartBadge);
    renderCartDrawer(cartBody, cartTotal);
  });

  // After successful order — server cleared cart, sync locally
  window.addEventListener('nexus-cart-cleared', async () => {
    await clearCartLocal();
    updateCartBadge(cartBadge);
  });

  updateCartBadge(cartBadge);

  // Hamburger
  hamburger?.addEventListener('click', () => {
    if (mobileOverlay?.hidden) {
      mobileOverlay.hidden = false;
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.classList.add('is-open');
    } else {
      closeMobileMenu();
    }
  });
  mobileClose?.addEventListener('click', closeMobileMenu);
  mobileOverlay?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));

  // Smooth scroll for non-SPA hash links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    if (a.hasAttribute('data-link')) return;
    a.addEventListener('click', ev => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.length <= 1 || href.startsWith('#/')) return;
      ev.preventDefault();
      const target = document.getElementById(href.replace('#', ''));
      if (target) {
        const y = target.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

init();
