/* IS_DEV flag (set to false in production builds) */
const IS_DEV =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

async function apiCall(endpoint, method = 'GET', body = null, requiresAuth = false) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10000);

  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (requiresAuth) {
      const token = localStorage.getItem(CONFIG.TOKEN_KEY);
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const fetchOptions = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal
    };

    const response = await fetch(`${CONFIG.API_BASE}${endpoint}`, fetchOptions);

    const data = await response
      .json()
      .catch(() => ({}));

    // Only force-redirect on 401 when the call required auth (token-protected routes).
    if (response.status === 401 && requiresAuth) {
      try {
        if (typeof clearAuth === 'function') clearAuth();
      } catch (e) {}
      const prefix = CONFIG.AUTH_PREFIX || '';
      window.location.href = `${prefix}/pages/login.html`;
      return null;
    }

    if (!response.ok) {
      // Backend may return { message } or legacy { error }
      const err = new Error(data.message || data.error || 'Request failed');
      err.status = response.status;
      err.details = data.errors || null;
      throw err;
    }

    return data;
  } catch (err) {
    if (err && err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    // If we already created a structured error from a non-2xx response,
    // keep its message (e.g., OTP invalid, rate limit, invalid credentials).
    if (err && typeof err.status !== 'undefined') {
      throw err;
    }

    const msg = String(err && err.message ? err.message : err);
    const lower = msg.toLowerCase();
    if (lower.includes('cors')) {
      throw new Error('Connection error. Please contact support.');
    }

    throw new Error('Network error. Check your connection.');
  } finally {
    window.clearTimeout(timeout);
  }
}

async function signup(name, email, password, phone, company, gst, designation) {
  try {
    return await apiCall(
      '/auth/signup',
      'POST',
      { name, email, password, phone, company, gst, designation },
      false
    );
  } catch (err) {
    if (IS_DEV) console.error(err);
    throw err;
  }
}

async function login(email, password) {
  try {
    return await apiCall('/auth/login', 'POST', { email, password }, false);
  } catch (err) {
    if (IS_DEV) console.error(err);
    throw err;
  }
}

async function forgotPassword(email) {
  try {
    return await apiCall('/auth/forgot-password', 'POST', { email }, false);
  } catch (err) {
    if (IS_DEV) console.error(err);
    throw err;
  }
}

async function resetPassword(email, otp, password) {
  try {
    return await apiCall('/auth/reset-password', 'POST', { email, otp, password }, false);
  } catch (err) {
    if (IS_DEV) console.error(err);
    throw err;
  }
}

async function getMe() {
  try {
    return await apiCall('/auth/me', 'GET', null, true);
  } catch (err) {
    if (IS_DEV) console.error(err);
    throw err;
  }
}

async function updateProfile(data) {
  try {
    return await apiCall('/auth/update-profile', 'PATCH', data, true);
  } catch (err) {
    if (IS_DEV) console.error(err);
    throw err;
  }
}

window.apiCall = apiCall;
window.signup = signup;
window.login = login;
window.forgotPassword = forgotPassword;
window.resetPassword = resetPassword;
window.getMe = getMe;
window.updateProfile = updateProfile;

