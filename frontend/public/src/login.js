// login.js — NexBazaar login page logic

const BACKEND_URL = 'http://localhost:5000';

// ── If user already has a valid token, skip login ─────────────
const existingToken = localStorage.getItem('nexbazaar_token');
if (existingToken) {
  const redirect = localStorage.getItem('nexbazaar_redirect') || 'shop';
  window.location.href = redirect + '.html';
}

// ── DOM refs ──────────────────────────────────────────────────
const roleCustomer  = document.getElementById('roleCustomer');
const roleAdmin     = document.getElementById('roleAdmin');
const googleBtn     = document.getElementById('googleBtn');
const googleBtnText = document.getElementById('googleBtnText');
const errorBanner   = document.getElementById('errorBanner');
const errorMessage  = document.getElementById('errorMessage');

// ── Error messages ────────────────────────────────────────────
const errorMessages = {
  not_authorized: 'Your Google account does not have admin access.',
  oauth_failed:   'Google sign-in failed. Please try again.',
  no_token:       'Authentication incomplete. Please try again.',
};

const urlParams = new URLSearchParams(window.location.search);
const errorCode = urlParams.get('error');

if (errorCode && errorMessages[errorCode]) {
  errorMessage.textContent = errorMessages[errorCode];
  errorBanner.classList.remove('hidden');
}

// ── Role selection ────────────────────────────────────────────
let selectedRole = null;

function selectRole(card, role) {
  // Deselect both
  roleCustomer.classList.remove('selected');
  roleAdmin.classList.remove('selected');

  // Select clicked
  card.classList.add('selected');
  selectedRole = role;

  // Enable button
  googleBtn.disabled = false;
  googleBtnText.textContent = `Continue as ${role.charAt(0).toUpperCase() + role.slice(1)}`;

  // Hide error
  errorBanner.classList.add('hidden');
}

roleCustomer.addEventListener('click', () => selectRole(roleCustomer, 'customer'));
roleAdmin.addEventListener('click',    () => selectRole(roleAdmin, 'admin'));

// ── Google sign in ────────────────────────────────────────────
googleBtn.addEventListener('click', () => {
  if (!selectedRole) return;
  window.location.href = `${BACKEND_URL}/auth/google?role=${selectedRole}`;
});
