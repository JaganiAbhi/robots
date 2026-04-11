/**
 * auth.js — Login / Signup section (SPA route #/login and #/signup)
 */
import { API } from '../utils/api.js';
import { saveAuth, isLoggedIn } from '../utils/nexus-auth.js';
import { navTo } from '../router.js';

// ── Shared helpers ────────────────────────────────────────────────────────────
function setLoading(btn, loading) {
  const txt     = btn.querySelector('.btn-text');
  const spinner = btn.querySelector('.btn-spinner');
  btn.disabled  = loading;
  if (txt)     txt.style.opacity = loading ? '0.5' : '1';
  if (spinner) spinner.style.display = loading ? 'inline-block' : 'none';
}

function showError(el, msg) {
  el.textContent = msg;
  el.classList.add('visible');
}

function clearError(el) { el.classList.remove('visible'); }

// ── Login Page ────────────────────────────────────────────────────────────────
export function renderLogin(appEl, { redirectAfter = '/' } = {}) {
  if (isLoggedIn()) { navTo(redirectAfter); return; }

  appEl.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="auth-logo-mark">NEXUS</div>
          <div class="auth-logo-sub">Intelligence. Embodied.</div>
        </div>
        <h1 class="auth-title">Welcome <span style="background:linear-gradient(135deg,var(--accent-blue),var(--accent-purple));-webkit-background-clip:text;background-clip:text;color:transparent">back</span></h1>
        <p class="auth-subtitle">Sign in to continue to your account.</p>

        <div class="auth-error" id="auth-error"></div>

        <form class="auth-form" id="login-form" novalidate>
          <div class="auth-input-group">
            <label for="login-email">Email address</label>
            <input type="email" id="login-email" class="auth-input" placeholder="you@example.com" required />
          </div>
          <div class="auth-input-group">
            <label for="login-pass">Password</label>
            <input type="password" id="login-pass" class="auth-input" placeholder="••••••••" required />
          </div>
          <button type="submit" class="auth-submit" id="login-btn">
            <span class="btn-text">Sign In</span>
            <span class="btn-spinner" style="display:none"></span>
          </button>
        </form>

        <p class="auth-switch">
          Don't have an account? <a id="go-signup">Create one</a>
        </p>
      </div>
    </div>
  `;

  const form  = appEl.querySelector('#login-form');
  const btn   = appEl.querySelector('#login-btn');
  const errEl = appEl.querySelector('#auth-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError(errEl);
    const email    = appEl.querySelector('#login-email').value.trim();
    const password = appEl.querySelector('#login-pass').value;
    if (!email || !password) { showError(errEl, 'Please fill in all fields.'); return; }
    setLoading(btn, true);
    try {
      const data = await API.login({ email, password });
      saveAuth(data.token, data.user);
      navTo(redirectAfter);
    } catch (err) {
      showError(errEl, err.message);
      setLoading(btn, false);
    }
  });

  appEl.querySelector('#go-signup')?.addEventListener('click', () => navTo('/signup'));
}

// ── Signup Page ───────────────────────────────────────────────────────────────
export function renderSignup(appEl) {
  if (isLoggedIn()) { navTo('/'); return; }

  appEl.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="auth-logo-mark">NEXUS</div>
          <div class="auth-logo-sub">Intelligence. Embodied.</div>
        </div>
        <h1 class="auth-title">Create your <span style="background:linear-gradient(135deg,var(--accent-blue),var(--accent-purple));-webkit-background-clip:text;background-clip:text;color:transparent">account</span></h1>
        <p class="auth-subtitle">Join the NEXUS network today.</p>

        <div class="auth-error" id="auth-error"></div>

        <form class="auth-form" id="signup-form" novalidate>
          <div class="auth-input-group">
            <label for="signup-name">Full name</label>
            <input type="text" id="signup-name" class="auth-input" placeholder="Ada Lovelace" required />
          </div>
          <div class="auth-input-group">
            <label for="signup-email">Email address</label>
            <input type="email" id="signup-email" class="auth-input" placeholder="you@example.com" required />
          </div>
          <div class="auth-input-group">
            <label for="signup-pass">Password <span style="color:var(--text-muted);font-size:0.72rem">(min 6 chars)</span></label>
            <input type="password" id="signup-pass" class="auth-input" placeholder="••••••••" required />
          </div>
          <button type="submit" class="auth-submit" id="signup-btn">
            <span class="btn-text">Create Account</span>
            <span class="btn-spinner" style="display:none"></span>
          </button>
        </form>

        <p class="auth-switch">
          Already have an account? <a id="go-login">Sign in</a>
        </p>
      </div>
    </div>
  `;

  const form  = appEl.querySelector('#signup-form');
  const btn   = appEl.querySelector('#signup-btn');
  const errEl = appEl.querySelector('#auth-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError(errEl);
    const name     = appEl.querySelector('#signup-name').value.trim();
    const email    = appEl.querySelector('#signup-email').value.trim();
    const password = appEl.querySelector('#signup-pass').value;
    if (!name || !email || !password) { showError(errEl, 'Please fill in all fields.'); return; }
    if (password.length < 6) { showError(errEl, 'Password must be at least 6 characters.'); return; }
    setLoading(btn, true);
    try {
      const data = await API.register({ name, email, password });
      saveAuth(data.token, data.user);
      navTo('/');
    } catch (err) {
      showError(errEl, err.message);
      setLoading(btn, false);
    }
  });

  appEl.querySelector('#go-login')?.addEventListener('click', () => navTo('/login'));
}
