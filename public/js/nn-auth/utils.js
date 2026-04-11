/* IS_DEV flag (set to false in production builds) */
const IS_DEV =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

function showToast(message, type = 'info', duration = 4000) {
  try {
    const div = document.createElement('div');
    div.className = `nn-toast nn-toast-${type} nn-toast-enter`;
    div.setAttribute('role', 'status');
    div.setAttribute('aria-live', 'polite');
    div.textContent = message;

    document.body.appendChild(div);

    window.setTimeout(() => {
      div.classList.remove('nn-toast-enter');
      div.classList.add('nn-toast-exit');
      window.setTimeout(() => div.remove(), 260);
    }, duration);
  } catch (err) {
    if (IS_DEV) console.error('showToast failed', err);
  }
}

function showFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.classList.add('nn-input-error');

  const parent = input.parentElement || input;
  let span = parent.querySelector(`.nn-field-error[data-for="${inputId}"]`);
  if (!span) {
    span = document.createElement('span');
    span.className = 'nn-field-error';
    span.setAttribute('data-for', inputId);
    input.insertAdjacentElement('afterend', span);
  }
  span.textContent = message;
}

function clearFieldError(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.classList.remove('nn-input-error');
  const parent = input.parentElement || input;
  const span = parent.querySelector(`.nn-field-error[data-for="${inputId}"]`);
  if (span) span.remove();
}

function clearAllErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(el => {
    if (el && el.id) clearFieldError(el.id);
  });
}

function setButtonLoading(btnId, isLoading, originalText) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  if (isLoading) {
    btn.disabled = true;
    const baseText = originalText || btn.textContent.trim();
    btn.dataset.originalText = baseText;
    btn.innerHTML = `<span class="nn-spinner" aria-hidden="true"></span>Please wait...`;
  } else {
    btn.disabled = false;
    const restored = btn.dataset.originalText || originalText || 'Submit';
    btn.textContent = restored;
  }
}

function validateFields(fields) {
  const errors = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  for (const f of fields) {
    const el = document.getElementById(f.id);
    if (!el) continue;
    const raw = el.value;
    const value = typeof raw === 'string' ? raw.trim() : '';

    const isEmpty = value.length === 0;
    if (f.required && isEmpty) {
      errors.push({ id: f.id, message: `${f.label || 'This field'} is required` });
      continue;
    }
    if (!f.required && isEmpty) continue;

    if (f.type === 'email' && !emailRegex.test(value)) {
      errors.push({ id: f.id, message: f.label ? `${f.label} must be a valid email` : 'Invalid email' });
      continue;
    }

    if (f.type === 'phone' && !phoneRegex.test(value)) {
      errors.push({ id: f.id, message: f.label ? `${f.label} must be exactly 10 digits` : 'Invalid phone' });
      continue;
    }

    if (f.type === 'password' && !passwordRegex.test(value)) {
      errors.push({
        id: f.id,
        message: f.label ? `${f.label} must include uppercase, lowercase, and a number (min 8)` : 'Invalid password'
      });
      continue;
    }

    if (typeof f.minLength === 'number' && value.length < f.minLength) {
      errors.push({ id: f.id, message: `${f.label || 'This field'} must be at least ${f.minLength} characters` });
      continue;
    }

    if (typeof f.maxLength === 'number' && value.length > f.maxLength) {
      errors.push({ id: f.id, message: `${f.label || 'This field'} must be at most ${f.maxLength} characters` });
      continue;
    }

    if (f.pattern instanceof RegExp && !f.pattern.test(value)) {
      errors.push({ id: f.id, message: f.patternMessage || `${f.label || 'This field'} is invalid` });
      continue;
    }
  }

  return { valid: errors.length === 0, errors };
}

function sanitize(str) {
  try {
    const s = String(str ?? '').trim();
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  } catch (err) {
    return '';
  }
}

function formatINR(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '₹0';
  return '₹' + n.toLocaleString('en-IN');
}

function generateInvoiceNumber() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `INV-${yyyy}${mm}${dd}-${rand}`;
}

window.showToast = showToast;
window.showFieldError = showFieldError;
window.clearFieldError = clearFieldError;
window.clearAllErrors = clearAllErrors;
window.setButtonLoading = setButtonLoading;
window.validateFields = validateFields;
window.sanitize = sanitize;
window.formatINR = formatINR;
window.generateInvoiceNumber = generateInvoiceNumber;

