# GunLite E-Commerce Store & MERN Admin Panel

Full-stack MERN e-commerce storefront and Admin Console for **GunLite** (operated by Jerone Enterprises, Coimbatore), featuring dynamic MongoDB catalog integration, Cloudinary multi-image management, JWT HTTP-only cookie authentication, and Vercel + Node.js deployment readiness.

---

## Architecture Overview

- **Frontend (`src/`)**: React 19, Vite, Tailwind CSS v4, React Router v7, Context API (`AuthContext`, `CatalogContext`, `CartContext`, `ToastContext`).
- **Backend (`server/`)**: Node.js, Express, MongoDB + Mongoose, bcryptjs, JWT HTTP-only cookies, Helmet, Express Rate Limit, CORS, Multer, and Cloudinary SDK.

### Key Features

1. **Secure Admin Authentication (`/admin/login`)**
   - Bcrypt password hashing (`12` rounds) and JWT stored strictly in HTTP-only cookies.
   - Rate-limited login endpoint (`POST /api/admin/login`) and persistent session verification (`GET /api/admin/me`).
   - Initial admin account seeded via backend script (`server/scripts/seed.js`) using environment variables.

2. **Admin Dashboard (`/admin`)**
   - Live statistics cards: Total Products, Active Products, Out-of-Stock Products, Total Categories.
   - Category distribution bar chart & inventory health breakdown.
   - Recently Added Products and Recent Admin Activities audit log.

3. **Product Management (`/admin/products`)**
   - Full CRUD (Add, Edit, Delete, View, Search, Filter by Category / Status / Stock, Pagination).
   - Quick toggles for **Featured Status** and **Active / Inactive Status**.
   - Regular price, optional discount price, stock quantity, SKU, dynamic specs builder, and configurable **Optional Hardware Warranty (+₹500)**.
   - Confirmation dialog before permanent deletion.

4. **Cloudinary Multiple Image Upload**
   - Multi-image upload with client & server format/size validation (`JPG`, `PNG`, `WebP`, `AVIF`, max `5 MB` per file, up to `10` images).
   - Live upload progress bar, image previews before saving, set primary image, replace image, and remove image.
   - Automatic Cloudinary asset cleanup when images or products are removed.

5. **Category Management (`/admin/categories`)**
   - Add, edit, and delete categories (with safe primary-category reassignment on deletion).
   - View category-wise products and assign products to categories directly.

6. **Dynamic Public Website Integration**
   - `Home` (Hero slider, Shop by Category, Featured Collection), `Shop`, `Brands`, `Footer`, and `Product Details` (`/eagle`, `/everest`, `/tiger`, `/sniper`, and `/product/:slug`) fetch products and categories dynamically from MongoDB via REST APIs.
   - Adding, editing, out-of-stock marking, or deleting products in the Admin Panel updates the storefront immediately.

---

## Environment Variables

### 1. Backend (`server/.env`)

Copy `server/.env.example` to `server/.env` and fill in your credentials:

| Variable | Description |
| :--- | :--- |
| `PORT` | Backend server port (default `5000`) |
| `NODE_ENV` | `development` locally or `production` when deployed |
| `MONGODB_URI` | MongoDB Atlas or local MongoDB connection string |
| `JWT_SECRET` | Strong random secret used to sign admin JWT cookies |
| `JWT_EXPIRES_IN` | Token expiration (default `7d`) |
| `CLIENT_URL` | Primary frontend URL (e.g. `http://localhost:5173`) |
| `CORS_ORIGINS` | Comma-separated allowed origins (e.g. `http://localhost:5173,https://gunlight-website.vercel.app`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (server-side only) |
| `ADMIN_NAME` | Initial admin display name for seeding |
| `ADMIN_EMAIL` | Initial admin login email for seeding |
| `ADMIN_PASSWORD` | Initial admin login password (min 8 chars) for seeding |

### 2. Frontend (`.env`)

Copy `.env.example` to `.env`:

| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Leave empty in local dev to use Vite `/api` proxy, or set to your deployed backend URL in production (e.g. `https://gunlite-api.onrender.com`) |

---

## Local Setup & Seed Instructions

### 1. Install Dependencies

Frontend (root directory):
```bash
npm install
```

Backend (`server/` directory):
```bash
cd server
npm install
```

### 2. Seed Database (Initial Admin + Categories + 4 GunLite Products)

Make sure `server/.env` has valid `MONGODB_URI`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`, then run:

```bash
cd server
npm run seed
```

### 3. Run Locally

Terminal 1 (Backend API on port `5000`):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend Vite dev server on port `5173`):
```bash
npm run dev
```

Access:
- **Public Storefront**: `http://localhost:5173/`
- **Admin Login**: `http://localhost:5173/admin/login`

---

## REST API Reference

### Authentication & Dashboard
- `POST /api/admin/login` — Rate-limited admin sign-in (sets HTTP-only cookie)
- `POST /api/admin/logout` — Clears session cookie
- `GET /api/admin/me` — Verify & fetch authenticated admin profile (Protected)
- `GET /api/admin/dashboard` — Dashboard stats, category/stock charts, recent products & activities (Protected)

### Products
- `GET /api/products` — Public active products (`?search=`, `?category=`, `?featured=true`, `?page=`, `?limit=`, `?sort=`)
- `GET /api/products/:id` — Public active product by MongoDB `_id` or `slug`
- `GET /api/admin/products` — All products with admin filters (Protected)
- `GET /api/admin/products/:id` — Single product for editing (Protected)
- `POST /api/admin/products` — Create product (Protected)
- `PUT /api/admin/products/:id` — Update product & clean up removed Cloudinary assets (Protected)
- `DELETE /api/admin/products/:id` — Delete product & all linked Cloudinary assets (Protected)

### Categories
- `GET /api/categories` — Public active categories with product counts
- `GET /api/admin/categories` — All categories with assigned products (Protected)
- `POST /api/admin/categories` — Create category & assign products (Protected)
- `PUT /api/admin/categories/:id` — Update category & product assignments (Protected)
- `DELETE /api/admin/categories/:id` — Delete category safely (Protected)

### Media Upload
- `POST /api/admin/upload` — Upload up to 10 validated images to Cloudinary (Protected)
- `DELETE /api/admin/upload` — Delete Cloudinary asset by `publicId` (Protected)

---

## Deployment Guide

### Backend (Render / Railway / Fly.io)
1. Deploy the `server/` directory as a Node.js web service.
2. Build command: `npm install`
3. Start command: `npm start`
4. Set all environment variables from `server/.env.example`, ensuring `NODE_ENV=production` and `CORS_ORIGINS` includes your Vercel domain (`https://gunlight-website.vercel.app`).
5. Run `npm run seed` once against your production MongoDB Atlas database to create the initial admin user and seed the catalog.

### Frontend (Vercel)
1. Import the root repository in Vercel (Framework Preset: `Vite`, Build Command: `npm run build`, Output Directory: `dist`).
2. `vercel.json` is configured with SPA rewrites so `/admin`, `/shop`, and `/product/:slug` work on direct reload.
3. Add `VITE_API_URL` in Vercel Environment Variables pointing to your deployed backend HTTPS URL (no trailing slash).
4. Redeploy so the production build bundles `VITE_API_URL`.
