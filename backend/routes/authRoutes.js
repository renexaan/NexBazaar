const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// ── GET /auth/google ─────────────────────────────────────────────
// Kick off Google OAuth flow; encode the intended role in state
router.get('/google', (req, res, next) => {
  const intendedRole = req.query.role || 'customer';
  const state = Buffer.from(JSON.stringify({ intendedRole })).toString('base64');

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
    state,
  })(req, res, next);
});

// ── GET /auth/google/callback ────────────────────────────────────
// Google redirects here after the user consents
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login.html?error=oauth_failed`,
  }),
  async (req, res) => {
    try {
      // Decode role from state
      let intendedRole = 'customer';
      try {
        const stateData = JSON.parse(
          Buffer.from(req.query.state || '', 'base64').toString('utf8')
        );
        intendedRole = (stateData.intendedRole || 'customer').toLowerCase();
      } catch {
        // Default to customer on decode failure
      }

      // Role check: if user tried to sign in as admin but isn't one, reject
      if (intendedRole === 'admin' && req.user.role !== 'admin') {
        return res.redirect(
          `${process.env.CLIENT_URL}/login.html?error=not_authorized`
        );
      }

      // Sign JWT
      const payload = {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        status: req.user.status,
        avatar: req.user.avatar,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      // Redirect to frontend callback page with token in hash
      const destination = req.user.role === 'admin' ? 'admin' : 'shop';
      return res.redirect(
        `${process.env.CLIENT_URL}/callback.html#token=${token}&redirect=${destination}`
      );
    } catch (err) {
      console.error('Callback error:', err);
      return res.redirect(
        `${process.env.CLIENT_URL}/login.html?error=oauth_failed`
      );
    }
  }
);

// ── GET /auth/me ─────────────────────────────────────────────────
// Verify JWT and return user info (used by frontend pages)
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ user });
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
