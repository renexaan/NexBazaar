// callback.js — Reads the JWT from URL hash, saves it, redirects

(function () {
  const hash = window.location.hash.substring(1); // remove '#'
  const params = new URLSearchParams(hash);

  const token    = params.get('token');
  const redirect = params.get('redirect') || 'shop';

  function showError(msg) {
    document.getElementById('loadingState').style.display = 'none';
    const err = document.getElementById('errorState');
    err.style.display = 'flex';
    if (msg) document.getElementById('errorMsg').textContent = msg;
  }

  if (!token) {
    showError('No authentication token received. Please try signing in again.');
    return;
  }

  // Save token
  localStorage.setItem('nexbazaar_token', token);
  localStorage.setItem('nexbazaar_redirect', redirect);

  // Decode payload (base64 middle section of JWT)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem('nexbazaar_user', JSON.stringify(payload));
  } catch {
    showError('Failed to parse authentication token.');
    return;
  }

  // Redirect after brief delay (so spinner is visible)
  setTimeout(() => {
    window.location.href = redirect + '.html';
  }, 800);
})();
