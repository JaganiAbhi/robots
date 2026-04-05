/* IS_DEV flag (set to false in production builds) */
const IS_DEV =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Central configuration for frontend modules (plain JS).
const CONFIG = {
  API_BASE: IS_DEV ? 'http://localhost:5000/api/v1' : 'https://api.nanoninja.in/api/v1',
  TOKEN_KEY: 'nn_token',
  USER_KEY: 'nn_user',
  LANG_KEY: 'nn_lang',
  IS_DEV,
  // Helps when the auth pages are hosted under a subfolder.
  AUTH_PREFIX: ''
};

// Derive AUTH_PREFIX from the current pathname.
// Example: /nexus/pages/login.html -> AUTH_PREFIX = /nexus
try {
  const segments = (window.location.pathname || '').split('/').filter(Boolean);
  const pagesIdx = segments.indexOf('pages');
  if (pagesIdx > 0) {
    CONFIG.AUTH_PREFIX = '/' + segments.slice(0, pagesIdx).join('/');
  } else {
    CONFIG.AUTH_PREFIX = '';
  }
} catch (err) {
  CONFIG.AUTH_PREFIX = '';
}

window.CONFIG = CONFIG;

if (CONFIG.IS_DEV) {
  // console.log('NanoNinja CONFIG ready');
}

