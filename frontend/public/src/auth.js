// auth.js — Shared auth guard & utilities for protected pages

// Determine the backend URL dynamically
const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === ''
  ? 'http://localhost:5000'
  : 'https://nexbazaar-api.onrender.com'; // 👈 Replace this with your actual production URL when you deploy


/**
 * Returns the stored user payload, or null if not authenticated.
 * Call this at the top of every protected page.
 */
function getUser() {
  const token = localStorage.getItem('nexbazaar_token');
  const userStr = localStorage.getItem('nexbazaar_user');
  if (!token || !userStr) return null;

  try {
    const user = JSON.parse(userStr);
    // Check JWT expiry (exp is in seconds)
    if (user.exp && Date.now() / 1000 > user.exp) {
      signOut();
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

/**
 * Require authentication. If not authenticated, redirect to login.
 * Optionally require a specific role ('admin' or 'customer').
 */
function requireAuth(requiredRole) {
  const user = getUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  if (requiredRole && user.role !== requiredRole) {
    window.location.href = 'login.html?error=not_authorized';
    return null;
  }
  return user;
}

/**
 * Sign out and go to login page.
 */
function signOut() {
  localStorage.removeItem('nexbazaar_token');
  localStorage.removeItem('nexbazaar_user');
  localStorage.removeItem('nexbazaar_redirect');
  window.location.href = 'login.html';
}

/**
 * Render the navbar user section given a user object.
 */
function renderNavUser(user, navbarUserEl) {
  if (!navbarUserEl) return;

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '??';

  const avatarHTML = user.avatar
    ? `<img class="navbar-avatar" src="${user.avatar}" alt="${user.name}" referrerpolicy="no-referrer">`
    : `<div class="navbar-avatar-placeholder">${initials}</div>`;

  navbarUserEl.innerHTML = `
    ${avatarHTML}
    <span class="navbar-name">${user.name}</span>
    <button class="btn-signout" onclick="signOut()">Sign out</button>
  `;
}
