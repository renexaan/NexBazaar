# NexBazaar 🛍️

NexBazaar is a premium procurement platform designed for seamless administrative order processing and high-performance 3D browsing experiences.

## 🚀 Features
- **Cinematic Shop UI**: Premium product catalog with GSAP-powered animations.
- **Role-Based Access**: Distinct flows for Customers and Administrators.
- **Google OAuth**: Secure authentication via Google.
- **Admin Dashboard**: Specialized interface for managing products and approving orders.
- **Order Tracking**: Real-time feedback and message persistence for order status updates.

## 🛠️ Technology Stack
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript, GSAP (Animations).
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Auth**: Passport.js (Google Strategy), JWT.

## 🏁 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI.

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm run dev  # Starts with nodemon
   ```

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Start the static server:
   ```bash
   node serve.js
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure
- `/backend`: Express API, Mongoose models, and authentication logic.
- `/frontend`: Static assets, styles, and client-side logic.
