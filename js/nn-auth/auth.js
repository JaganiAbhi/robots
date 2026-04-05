/* IS_DEV flag (set to false in production builds) */
const IS_DEV =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

function saveAuth(token, user) {
  try {
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
  } catch (err) {
    if (IS_DEV) console.error('saveAuth failed', err);
  }
}

function clearAuth() {
  try {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
  } catch (err) {
    if (IS_DEV) console.error('clearAuth failed', err);
  }
}

function getToken() {
  try {
    return localStorage.getItem(CONFIG.TOKEN_KEY);
  } catch (err) {
    return null;
  }
}

function getUser() {
  try {
    const raw = localStorage.getItem(CONFIG.USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function isLoggedIn() {
  return !!getToken();
}

function getRole() {
  const u = getUser();
  return u ? u.role : null;
}

function redirectTo(url) {
  window.location.href = url;
}

function checkAuth(requiredRole) {
  const user = getUser();
  if (!isLoggedIn() || !user) {
    const prefix = CONFIG.AUTH_PREFIX || '';
    redirectTo(`${prefix}/pages/login.html`);
    return null;
  }

  if (requiredRole) {
    const role = user.role;
    const roleOk = Array.isArray(requiredRole) ? requiredRole.includes(role) : role === requiredRole;
    if (!roleOk) {
      const prefix = CONFIG.AUTH_PREFIX || '';
      redirectTo(`${prefix}/pages/dashboard.html`);
      return null;
    }
  }

  return user;
}

function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    const prefix = CONFIG.AUTH_PREFIX || '';
    redirectTo(`${prefix}/pages/dashboard.html`);
  }
}

function updateNavbar() {
  try {
    const loginLink = document.getElementById('loginLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const dashboardLink = document.getElementById('dashboardLink');
    const adminLink = document.getElementById('adminLink');
    const greetingName = document.getElementById('greetingName');

    const user = getUser();
    const loggedIn = !!(user && getToken());
    const role = user ? user.role : null;

    if (loginLink) loginLink.style.display = loggedIn ? 'none' : '';
    if (logoutBtn) logoutBtn.style.display = loggedIn ? '' : 'none';
    if (dashboardLink) dashboardLink.style.display = loggedIn ? '' : 'none';
    if (adminLink) adminLink.style.display = role === 'admin' ? '' : 'none';

    if (greetingName && user && user.name) greetingName.textContent = user.name;
  } catch (err) {
    if (IS_DEV) console.error('updateNavbar failed', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearAuth();
      const prefix = CONFIG.AUTH_PREFIX || '';
      redirectTo(`${prefix}/index.html`);
    });
  }
});

window.saveAuth = saveAuth;
window.clearAuth = clearAuth;
window.getToken = getToken;
window.getUser = getUser;
window.isLoggedIn = isLoggedIn;
window.getRole = getRole;
window.checkAuth = checkAuth;
window.redirectIfLoggedIn = redirectIfLoggedIn;
window.updateNavbar = updateNavbar;

