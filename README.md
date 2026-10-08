# 🛒 FreshCart — Online Grocery Store

A modern, full-stack Online Grocery Store built with **Supabase PostgreSQL** as the relational database management system, a high-performance **Node.js & Express** backend REST API, and a modern **Vanilla HTML5, CSS3 & JavaScript** frontend.

Designed with clean aesthetics, responsive glassmorphic cards, micro-animations, instant search, dynamic cart calculations, an interactive checkout pipeline, and a built-in **Store Admin Management Portal**.

---

## 📁 Project Architecture & Folder Structure

This project is built inside the root directory:

```text
grocery store/
│
├── frontend/                     # Modern Vanilla Web Application
│   ├── index.html                # Semantic HTML5 single-page store
│   ├── css/
│   │   ├── style.css             # Design system tokens, variables & typography
│   │   └── components.css        # Responsive layouts, glassmorphism & animations
│   └── js/
│       ├── api.js                # Clean REST API client
│       ├── cart.js               # State manager for Cart & Wishlist (localStorage)
│       ├── ui.js                 # DOM renderers, modals, drawers & toasts
│       ├── admin.js              # Admin portal, live metrics & inventory CRUD
│       └── app.js                # Application bootstrapper & event controller
│
├── backend/                      # Node.js & Express REST API Layer
│   ├── config/
│   │   └── supabase.js           # Supabase client connector + resilient datastore
│   ├── controllers/
│   │   ├── productController.js  # Product listing, filtering, search, CRUD
│   │   ├── categoryController.js # Departments & counts
│   │   ├── orderController.js    # Order checkout, stock decrement & tracking
│   │   ├── couponController.js   # Coupon validation & discount logic
│   │   └── statsController.js    # Revenue & order pipeline analytics
│   ├── routes/
│   │   ├── productRoutes.js      # /api/products endpoints
│   │   ├── categoryRoutes.js     # /api/categories endpoints
│   │   ├── orderRoutes.js        # /api/orders endpoints
│   │   ├── couponRoutes.js       # /api/coupons endpoints
│   │   └── statsRoutes.js        # /api/stats endpoints
│   ├── data/
│   │   └── initialProducts.js    # 24+ initial grocery items & seed structure
│   ├── package.json              # Backend package configuration
│   └── server.js                 # Express server & static frontend serving
│
├── database/                     # Supabase PostgreSQL Database Layer
│   ├── schema.sql                # Complete PostgreSQL DDL (Tables, RLS, Indexes, Triggers)
│   ├── seed.sql                  # Seed data with organic produce, coupons, reviews
│   └── README.md                 # 3-minute Supabase step-by-step setup guide
│
├── package.json                  # Root npm scripts & workspace dependencies
├── .env.example                  # Environment template for Supabase credentials
├── .env                          # Local environment configuration
├── .gitignore                    # Git ignore file
├── vercel.json                   # Zero-config Vercel deployment configuration
└── README.md                     # Documentation & Quick Start guide
```

---

## ⚡ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Database** | **Supabase PostgreSQL** (Tables: `categories`, `products`, `coupons`, `orders`, `order_items`, `reviews` with RLS & Triggers) |
| **Backend API** | **Node.js** + **Express.js** + `@supabase/supabase-js` |
| **Frontend UI** | **Vanilla HTML5**, **Vanilla CSS3** (Custom design tokens, Glassmorphism, Dark/Light mode), **Modern JavaScript (ES6+)** |
| **Fonts & Icons** | Google Fonts (*Outfit* & *Plus Jakarta Sans*) + Embedded SVG icons |

---

## 🚀 Quick Start (Run in VS Code)

You can open this folder directly in **VS Code** and run the entire application in 2 simple steps:

### 1. Install Dependencies
Open a terminal in the root folder and run:
```bash
npm install
```

### 2. Start the Application
```bash
npm run dev
```
*(or `npm start`)*

### 3. Open in Browser
Visit:
```text
http://localhost:5000
```

> **Note on Out-of-the-Box Execution:**  
> The backend features a resilient data engine. If you launch the app before adding your Supabase credentials to `.env`, it runs seamlessly with full search, filtering, order placement, and admin management enabled!

---

## 🗄️ Connecting Your Supabase PostgreSQL Database

Connecting to live Supabase takes less than 3 minutes:

1. **Create a Free Supabase Project:**
   - Head over to [supabase.com](https://supabase.com) and create a new project.
2. **Execute Database Scripts:**
   - Go to **SQL Editor** in the Supabase Dashboard.
   - Run the contents of [`database/schema.sql`](file:///c:/Grocery_store/database/schema.sql) (creates tables, foreign keys, RLS policies, and triggers).
   - Run the contents of [`database/seed.sql`](file:///c:/Grocery_store/database/seed.sql) (populates categories, grocery products, coupons, and reviews).
3. **Copy API Credentials:**
   - In Supabase, go to **Project Settings** ➔ **API**.
   - Copy your **Project URL** and **anon public key**.
4. **Update `.env`:**
   ```env
   PORT=5000
   NODE_ENV=development
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-actual-anon-key
   ```
5. **Restart Server:**
   ```bash
   npm run dev
   ```
   You will see the live confirmation:
   ```text
   [Supabase PostgreSQL] Connection verified successfully! Live database active.
   ```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Check server and Supabase PostgreSQL connection status |
| `GET` | `/api/categories` | Retrieve all product categories and counts |
| `GET` | `/api/products` | Query products with filters (`category`, `search`, `minPrice`, `maxPrice`, `organic`, `inStock`, `sort`, `page`) |
| `GET` | `/api/products/:id` | Get details, nutrition facts, and stock for a single item |
| `POST` | `/api/products` | Create a new product (Admin) |
| `PUT` | `/api/products/:id` | Update price, stock, or details (Admin) |
| `DELETE`| `/api/products/:id` | Remove a product from inventory (Admin) |
| `GET` | `/api/coupons` | List all active promotional coupons |
| `POST` | `/api/coupons/validate`| Validate coupon code (`FRESH20`, `ORGANIC15`, `FREESHIP`) |
| `POST` | `/api/orders` | Place an order (validates stock, calculates totals, inserts order items, decrements inventory) |
| `GET` | `/api/orders` | List customer orders (supports `?email=` filter) |
| `GET` | `/api/orders/:id` | Get order details & tracking status |
| `PATCH`| `/api/orders/:id/status`| Update order status (`Confirmed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`) |
| `GET` | `/api/stats` | Admin metrics: revenue, total orders, product counts, and status breakdown |

---

## ✨ Key Store Features

1. **Storefront & Departments:**
   - Fresh Produce 🍎, Dairy & Eggs 🥛, Artisan Bakery 🥖, Juices & Beverages 🧃, Organic Pantry 🌾, Meat & Seafood 🥩.
2. **Instant Search & Interactive Filtering:**
   - Debounced search bar across products and descriptions.
   - Price range slider (₹20 - ₹1,000).
   - "Organic Only 🌱" and "In Stock Only 📦" toggle filters.
   - Sort by *Featured*, *Price: Low to High*, *Price: High to Low*, or *Highest Rated*.
3. **Slide-over Shopping Cart:**
   - Free delivery progress meter (qualify with ₹499+ cart).
   - Promo coupon validation (`FRESH20` for 20% off).
   - Real-time tax and delivery calculation.
4. **End-to-End Checkout & Live Tracking:**
   - Contact and delivery address form with preferred dispatch window.
   - Real-time delivery tracker timeline (*Order Confirmed* ➔ *Packing Produce* ➔ *Out for Delivery* ➔ *Delivered*).
   - Print receipt & confirmation receipt.
5. **Quick View & Nutrition Facts:**
   - High-resolution zoom view with macro-nutritional facts (Calories, Protein, Carbs, Healthy Fats).
6. **Wishlist Drawer:**
   - Save favorite grocery items and move them to cart with one click.
7. **Admin Inventory Portal (`⚙️ Admin`):**
   - Live revenue, total orders, active inventory stats, and average basket value.
   - Order pipeline status management.
   - Instant new product creation form and catalog manager.
8. **Dark / Light Theme:**
   - High-contrast night mode with smooth CSS transitions.

---

## 🚢 Deploying to Vercel

This repository includes a preconfigured `vercel.json`:
1. Push this repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Add your `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Vercel's Environment Variables.
4. Click **Deploy**!
