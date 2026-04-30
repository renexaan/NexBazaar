# NexBazaar

## How to run

### 1. Backend
```bash
cd backend
npm install
node server.js
# Open https://localhost:5000
```

### 2. Frontend
```bash
cd frontend
node serve.js
# Open http://localhost:3000
```

## Pages
- `login.html`    → Role selection + Google sign in
- `shop.html`     → Customer landing page (empty shop)
- `admin.html`    → Admin dashboard (verified access only)
- `callback.html` → Handles JWT after Google OAuth

## Flow
1. Select Customer or Admin
2. Sign in with Google
3. Customer → shop.html
4. Admin → admin.html (must have Admin role in MongoDB)
5. Unauthorized Admin attempt → error on login page
