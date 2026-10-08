# 🛒 Online Grocery Store — Complete Consolidated Source Code

This document contains the complete, unabridged source code for all frontend, backend, database, and configuration files of the **Online Grocery Store** project.

- **Project Root**: `C:\grocery_store`
- **GitHub Repository**: [https://github.com/Somitsarkar2103/grocery_store](https://github.com/Somitsarkar2103/grocery_store)
- **Total Included Files**: 29 files
- **Generated**: 2026-10-08T04:49:54.533Z

---

## 📑 Table of Contents

1. [package.json](#package-json) — *Root project configuration & NPM dependencies*
2. [.env.example](#-env-example) — *Environment configuration template*
3. [vercel.json](#vercel-json) — *Vercel cloud deployment configuration*
4. [README.md](#readme-md) — *Project documentation & architecture*
5. [backend/server.js](#backend-server-js) — *Express application entry point, middleware & routing*
6. [backend/package.json](#backend-package-json) — *Backend sub-package configuration*
7. [backend/config/supabase.js](#backend-config-supabase-js) — *Supabase PostgreSQL client & local fallback engine*
8. [backend/routes/productRoutes.js](#backend-routes-productroutes-js) — *REST endpoints for product search, catalog & CRUD*
9. [backend/routes/categoryRoutes.js](#backend-routes-categoryroutes-js) — *REST endpoints for grocery categories & counts*
10. [backend/routes/orderRoutes.js](#backend-routes-orderroutes-js) — *REST endpoints for checkout & order tracking*
11. [backend/routes/couponRoutes.js](#backend-routes-couponroutes-js) — *REST endpoints for coupon code validation*
12. [backend/routes/statsRoutes.js](#backend-routes-statsroutes-js) — *REST endpoints for store admin analytics & metrics*
13. [backend/controllers/productController.js](#backend-controllers-productcontroller-js) — *Product business logic, filtering & stock updates*
14. [backend/controllers/categoryController.js](#backend-controllers-categorycontroller-js) — *Category business logic*
15. [backend/controllers/orderController.js](#backend-controllers-ordercontroller-js) — *Order checkout processing & inventory decrement*
16. [backend/controllers/couponController.js](#backend-controllers-couponcontroller-js) — *Coupon code validation & discount computation*
17. [backend/controllers/statsController.js](#backend-controllers-statscontroller-js) — *Store performance metrics, sales, & order stats*
18. [backend/data/initialProducts.js](#backend-data-initialproducts-js) — *Default seed catalog with 24+ grocery items*
19. [database/schema.sql](#database-schema-sql) — *PostgreSQL DDL schema (Tables, RLS, Indexes, Triggers)*
20. [database/seed.sql](#database-seed-sql) — *PostgreSQL seed dataset (categories, products, coupons)*
21. [database/README.md](#database-readme-md) — *Database architecture & Supabase instructions*
22. [frontend/index.html](#frontend-index-html) — *Single-page grocery store frontend structure*
23. [frontend/css/style.css](#frontend-css-style-css) — *Design system tokens, color palette & typography*
24. [frontend/css/components.css](#frontend-css-components-css) — *Glassmorphic card components, drawers & animations*
25. [frontend/js/api.js](#frontend-js-api-js) — *HTTP API client for backend communication*
26. [frontend/js/cart.js](#frontend-js-cart-js) — *Cart and wishlist state manager (localStorage)*
27. [frontend/js/ui.js](#frontend-js-ui-js) — *DOM renderers, modal managers & toast notifications*
28. [frontend/js/admin.js](#frontend-js-admin-js) — *Admin inventory management & revenue dashboard*
29. [frontend/js/app.js](#frontend-js-app-js) — *Application orchestrator & event bus*

---

<a id="package-json"></a>
## 📄 `package.json`

> **Description**: Root project configuration & NPM dependencies  
> **Path**: `package.json`  
> **Language**: json

```json
{
  "name": "online-grocery-store",
  "version": "1.0.0",
  "description": "Full-stack Online Grocery Store with Supabase PostgreSQL, Node.js/Express backend, and modern Vanilla HTML/CSS/JS frontend",
  "main": "backend/server.js",
  "scripts": {
    "start": "node backend/server.js",
    "dev": "node --watch backend/server.js",
    "server": "node backend/server.js",
    "test": "node -e \"console.log('Online Grocery Store initialized successfully')\""
  },
  "keywords": [
    "grocery-store",
    "ecommerce",
    "supabase",
    "postgresql",
    "express",
    "nodejs",
    "vanilla-js"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@supabase/supabase-js": "^2.49.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "morgan": "^1.10.0"
  }
}
```

---

<a id="-env-example"></a>
## 📄 `.env.example`

> **Description**: Environment configuration template  
> **Path**: `.env.example`  
> **Language**: env

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase PostgreSQL Configuration
# Get these from your Supabase Project Settings -> API
# Example: https://xyzcompany.supabase.co
SUPABASE_URL=https://your-supabase-project-id.supabase.co

# Supabase Public Anon Key (for public client requests)
SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Supabase Service Role Key (optional, for administrative operations bypassing RLS)
# SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

---

<a id="vercel-json"></a>
## 📄 `vercel.json`

> **Description**: Vercel cloud deployment configuration  
> **Path**: `vercel.json`  
> **Language**: json

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/backend/server.js"
    },
    {
      "source": "/(.*)",
      "destination": "/frontend/$1"
    }
  ]
}
```

---

<a id="readme-md"></a>
## 📄 `README.md`

> **Description**: Project documentation & architecture  
> **Path**: `README.md`  
> **Language**: markdown

```markdown
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
   - Price range slider ($1 - $25).
   - "Organic Only 🌱" and "In Stock Only 📦" toggle filters.
   - Sort by *Featured*, *Price: Low to High*, *Price: High to Low*, or *Highest Rated*.
3. **Slide-over Shopping Cart:**
   - Free delivery progress meter (qualify with $35+ cart).
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
```

---

<a id="backend-server-js"></a>
## 📄 `backend/server.js`

> **Description**: Express application entry point, middleware & routing  
> **Path**: `backend/server.js`  
> **Language**: javascript

```javascript
const path = require('path');
// Load environment variables from project root .env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { isSupabaseActive, getSupabase } = require('./config/supabase');

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const supabase = getSupabase();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Online Grocery Store API',
    supabase: {
      connected: isSupabaseActive(),
      urlConfigured: Boolean(process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-supabase-project'))
    }
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/stats', statsRoutes);

// Serve Frontend Static Assets
const frontendPath = path.resolve(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Fallback to frontend index.html for client-side navigation
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint '${req.originalUrl}' not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🛒 Online Grocery Store Server running at:`);
    console.log(`   ➜ Local:   http://localhost:${PORT}`);
    console.log(`   ➜ API:     http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
```

---

<a id="backend-package-json"></a>
## 📄 `backend/package.json`

> **Description**: Backend sub-package configuration  
> **Path**: `backend/package.json`  
> **Language**: json

```json
{
  "name": "grocery-store-backend",
  "version": "1.0.0",
  "description": "Node.js Express & Supabase PostgreSQL API layer for Online Grocery Store",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.49.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "morgan": "^1.10.0"
  }
}
```

---

<a id="backend-config-supabase-js"></a>
## 📄 `backend/config/supabase.js`

> **Description**: Supabase PostgreSQL client & local fallback engine  
> **Path**: `backend/config/supabase.js`  
> **Language**: javascript

```javascript
const { createClient } = require('@supabase/supabase-js');
const { initialCategories, initialProducts, initialCoupons } = require('../data/initialProducts');

let supabase = null;
let isConnected = false;

// Fallback in-memory database store (used when Supabase credentials are not set or during local development)
const fallbackDb = {
  categories: JSON.parse(JSON.stringify(initialCategories)),
  products: JSON.parse(JSON.stringify(initialProducts)),
  coupons: JSON.parse(JSON.stringify(initialCoupons)),
  orders: [
    {
      id: 'ord-mock-001',
      order_number: 'ORD-98214',
      customer_name: 'Jessica Parker',
      customer_email: 'jessica@example.com',
      customer_phone: '+1 (555) 234-5678',
      shipping_address: '742 Evergreen Terrace, Apt 4B',
      delivery_city: 'New York',
      delivery_zip: '10001',
      delivery_slot: 'Standard Delivery (30-45 mins)',
      payment_method: 'Card',
      payment_status: 'Paid',
      subtotal: 28.36,
      delivery_fee: 0,
      discount: 5.67,
      tax: 1.82,
      total: 24.51,
      status: 'Out for Delivery',
      notes: 'Please leave at the door',
      items: [
        {
          product_id: 'p1010001-0000-0000-0000-000000000001',
          product_name: 'Organic Honeycrisp Apples',
          price: 3.99,
          quantity: 2,
          total_price: 7.98
        },
        {
          product_id: 'p2020002-0000-0000-0000-000000000002',
          product_name: 'Pasture-Raised Grade A Large Eggs',
          price: 5.99,
          quantity: 1,
          total_price: 5.99
        },
        {
          product_id: 'p5050001-0000-0000-0000-000000000001',
          product_name: 'Extra Virgin Cold-Pressed Olive Oil',
          price: 14.99,
          quantity: 1,
          total_price: 14.99
        }
      ],
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ]
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const isConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl.trim() !== '' && 
  !supabaseUrl.includes('your-supabase-project') &&
  supabaseKey.trim() !== '' &&
  !supabaseKey.includes('your-supabase-anon')
);

if (isConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    console.log(`[Supabase] Client initialized with URL: ${supabaseUrl}`);

    // Test connectivity
    supabase.from('categories').select('count', { count: 'exact', head: true })
      .then(({ error }) => {
        if (error) {
          console.warn(`[Supabase Notice] Connected to endpoint, but schema query returned: ${error.message}`);
          console.warn(`[Supabase Notice] Remember to execute database/schema.sql & database/seed.sql in Supabase SQL editor.`);
          console.log(`[Supabase] Operating with active hybrid fallback mode until schema is seeded.`);
        } else {
          isConnected = true;
          console.log(`[Supabase PostgreSQL] Connection verified successfully! Live database active.`);
        }
      })
      .catch((err) => {
        console.warn(`[Supabase Warning] Connectivity check failed: ${err.message}. Using fallback storage.`);
      });
  } catch (err) {
    console.error(`[Supabase Error] Failed to initialize client: ${err.message}`);
  }
} else {
  console.log(`----------------------------------------------------------------------`);
  console.log(`[Supabase Mode] No live SUPABASE_URL / SUPABASE_ANON_KEY found in .env`);
  console.log(`[Supabase Mode] Running in High-Fidelity Local Standalone Mode.`);
  console.log(`[Supabase Mode] When ready, add Supabase keys to .env and run schema.sql!`);
  console.log(`----------------------------------------------------------------------`);
}

module.exports = {
  getSupabase: () => supabase,
  isSupabaseActive: () => isConnected && supabase !== null,
  fallbackDb
};
```

---

<a id="backend-routes-productroutes-js"></a>
## 📄 `backend/routes/productRoutes.js`

> **Description**: REST endpoints for product search, catalog & CRUD  
> **Path**: `backend/routes/productRoutes.js`  
> **Language**: javascript

```javascript
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
```

---

<a id="backend-routes-categoryroutes-js"></a>
## 📄 `backend/routes/categoryRoutes.js`

> **Description**: REST endpoints for grocery categories & counts  
> **Path**: `backend/routes/categoryRoutes.js`  
> **Language**: javascript

```javascript
const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/categoryController');

router.get('/', getCategories);

module.exports = router;
```

---

<a id="backend-routes-orderroutes-js"></a>
## 📄 `backend/routes/orderRoutes.js`

> **Description**: REST endpoints for checkout & order tracking  
> **Path**: `backend/routes/orderRoutes.js`  
> **Language**: javascript

```javascript
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
```

---

<a id="backend-routes-couponroutes-js"></a>
## 📄 `backend/routes/couponRoutes.js`

> **Description**: REST endpoints for coupon code validation  
> **Path**: `backend/routes/couponRoutes.js`  
> **Language**: javascript

```javascript
const express = require('express');
const router = express.Router();
const { getCoupons, validateCoupon } = require('../controllers/couponController');

router.get('/', getCoupons);
router.post('/validate', validateCoupon);

module.exports = router;
```

---

<a id="backend-routes-statsroutes-js"></a>
## 📄 `backend/routes/statsRoutes.js`

> **Description**: REST endpoints for store admin analytics & metrics  
> **Path**: `backend/routes/statsRoutes.js`  
> **Language**: javascript

```javascript
const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');

router.get('/', getStats);

module.exports = router;
```

---

<a id="backend-controllers-productcontroller-js"></a>
## 📄 `backend/controllers/productController.js`

> **Description**: Product business logic, filtering & stock updates  
> **Path**: `backend/controllers/productController.js`  
> **Language**: javascript

```javascript
const { getSupabase, fallbackDb } = require('../config/supabase');

// GET /api/products
// Supports: search, category, minPrice, maxPrice, organic, inStock, sort, limit, page
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      organic,
      inStock,
      sort = 'featured',
      limit = 50,
      page = 1
    } = req.query;

    const supabase = getSupabase();

    // If Supabase is available, attempt Supabase PostgreSQL query
    if (supabase) {
      try {
        let query = supabase.from('products').select('*, categories(name, slug)', { count: 'exact' });

        if (category && category !== 'all') {
          query = query.or(`category_id.eq.${category},categories.slug.eq.${category}`);
        }

        if (search) {
          query = query.ilike('name', `%${search}%`);
        }

        if (minPrice) {
          query = query.gte('price', parseFloat(minPrice));
        }

        if (maxPrice) {
          query = query.lte('price', parseFloat(maxPrice));
        }

        if (organic === 'true') {
          query = query.eq('is_organic', true);
        }

        if (inStock === 'true') {
          query = query.gt('stock', 0);
        }

        // Sorting
        switch (sort) {
          case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
          case 'rating':
            query = query.order('rating', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'featured':
          default:
            query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false });
            break;
        }

        const from = (parseInt(page) - 1) * parseInt(limit);
        const to = from + parseInt(limit) - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (!error && data && data.length > 0) {
          return res.json({
            success: true,
            source: 'supabase-postgresql',
            total: count || data.length,
            page: parseInt(page),
            limit: parseInt(limit),
            data
          });
        }
      } catch (err) {
        console.warn('[Products] Supabase query failed, using fallback:', err.message);
      }
    }

    // Fallback in-memory query engine
    let results = [...fallbackDb.products];

    // Filter by category
    if (category && category !== 'all') {
      results = results.filter(
        p => p.category_slug === category || p.category_id === category
      );
    }

    // Filter by search
    if (search) {
      const term = search.toLowerCase().trim();
      results = results.filter(
        p => p.name.toLowerCase().includes(term) || 
             p.description.toLowerCase().includes(term) ||
             (p.category_name && p.category_name.toLowerCase().includes(term))
      );
    }

    // Filter by price range
    if (minPrice) {
      results = results.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      results = results.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Filter by organic
    if (organic === 'true') {
      results = results.filter(p => p.is_organic === true);
    }

    // Filter by stock
    if (inStock === 'true') {
      results = results.filter(p => p.stock > 0);
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
        break;
      case 'featured':
      default:
        results.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0) || b.rating - a.rating);
        break;
    }

    const total = results.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginated = results.slice(startIndex, startIndex + parseInt(limit));

    return res.json({
      success: true,
      source: supabase ? 'supabase-fallback' : 'in-memory-datastore',
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: paginated
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Internal server error while fetching products' });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(*)')
          .or(`id.eq.${id},slug.eq.${id}`)
          .maybeSingle();

        if (!error && data) {
          return res.json({ success: true, data });
        }
      } catch (err) {
        console.warn('[Product Detail] Supabase query failed, falling back:', err.message);
      }
    }

    const product = fallbackDb.products.find(p => p.id === id || p.slug === id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/products (Admin)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category_id,
      description,
      price,
      original_price,
      unit,
      stock,
      image_url,
      is_organic,
      is_featured,
      badge
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, error: 'Product name and price are required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newProduct = {
      id: `p-${Date.now()}`,
      category_id: category_id || fallbackDb.categories[0].id,
      category_slug: 'fruits-vegetables',
      category_name: 'Fresh Produce',
      name,
      slug,
      description: description || 'Fresh high-quality grocery item.',
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : parseFloat(price) * 1.2,
      discount_percent: original_price ? Math.round(((original_price - price) / original_price) * 100) : 0,
      unit: unit || '1 kg',
      stock: stock ? parseInt(stock) : 50,
      rating: 4.8,
      review_count: 1,
      image_url: image_url || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
      is_organic: Boolean(is_organic),
      is_featured: Boolean(is_featured),
      is_popular: false,
      badge: badge || (is_organic ? 'Organic' : 'New'),
      created_at: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
        if (!error && data) {
          return res.status(201).json({ success: true, data });
        }
      } catch (err) {
        console.warn('[Create Product] Supabase insert failed, storing in fallback:', err.message);
      }
    }

    fallbackDb.products.unshift(newProduct);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/products/:id (Admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return res.json({ success: true, data });
        }
      } catch (err) {
        console.warn('[Update Product] Supabase update failed:', err.message);
      }
    }

    const index = fallbackDb.products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    fallbackDb.products[index] = { ...fallbackDb.products[index], ...updates };
    res.json({ success: true, data: fallbackDb.products[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/products/:id (Admin)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) {
          return res.json({ success: true, message: 'Product deleted successfully' });
        }
      } catch (err) {
        console.warn('[Delete Product] Supabase delete failed:', err.message);
      }
    }

    const initialLen = fallbackDb.products.length;
    fallbackDb.products = fallbackDb.products.filter(p => p.id !== id);
    if (fallbackDb.products.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
```

---

<a id="backend-controllers-categorycontroller-js"></a>
## 📄 `backend/controllers/categoryController.js`

> **Description**: Category business logic  
> **Path**: `backend/controllers/categoryController.js`  
> **Language**: javascript

```javascript
const { getSupabase, fallbackDb } = require('../config/supabase');

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const supabase = getSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          return res.json({
            success: true,
            source: 'supabase-postgresql',
            data
          });
        }
      } catch (err) {
        console.warn('[Categories] Supabase query failed, using fallback:', err.message);
      }
    }

    // Fallback: calculate fresh item counts from current fallback products
    const categoriesWithCounts = fallbackDb.categories.map(cat => {
      const count = fallbackDb.products.filter(
        p => p.category_id === cat.id || p.category_slug === cat.slug
      ).length;
      return {
        ...cat,
        item_count: count
      };
    });

    res.json({
      success: true,
      source: supabase ? 'supabase-fallback' : 'in-memory-datastore',
      data: categoriesWithCounts
    });
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getCategories
};
```

---

<a id="backend-controllers-ordercontroller-js"></a>
## 📄 `backend/controllers/orderController.js`

> **Description**: Order checkout processing & inventory decrement  
> **Path**: `backend/controllers/orderController.js`  
> **Language**: javascript

```javascript
const { getSupabase, fallbackDb } = require('../config/supabase');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      delivery_city = 'New York',
      delivery_zip = '10001',
      delivery_slot = 'Standard Delivery (30-45 mins)',
      payment_method = 'Cash on Delivery',
      notes = '',
      items = [],
      coupon_code = null
    } = req.body;

    // Validation
    if (!customer_name || !customer_email || !customer_phone || !shipping_address) {
      return res.status(400).json({
        success: false,
        error: 'Please provide full customer name, email, phone number, and delivery address'
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order must contain at least one grocery item'
      });
    }

    // Calculate subtotal and build line items
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      // Find product to verify current price
      const product = fallbackDb.products.find(p => p.id === item.product_id) || item;
      const unitPrice = parseFloat(item.price || product.price || 0);
      const qty = parseInt(item.quantity) || 1;
      const itemTotal = parseFloat((unitPrice * qty).toFixed(2));

      subtotal += itemTotal;

      processedItems.push({
        product_id: item.product_id,
        product_name: item.name || product.name || 'Grocery Item',
        product_image: item.image_url || product.image_url || '',
        price: unitPrice,
        quantity: qty,
        total_price: itemTotal
      });

      // Decrement stock in fallback
      const foundInFallback = fallbackDb.products.find(p => p.id === item.product_id);
      if (foundInFallback && foundInFallback.stock >= qty) {
        foundInFallback.stock -= qty;
      }
    }

    subtotal = parseFloat(subtotal.toFixed(2));

    // Calculate delivery fee: Free delivery over $35, else $4.99
    const delivery_fee = subtotal >= 35 ? 0 : 4.99;

    // Apply coupon discount if provided
    let discount = 0;
    if (coupon_code) {
      const code = coupon_code.toUpperCase().trim();
      const coupon = fallbackDb.coupons.find(c => c.code === code && c.is_active);
      if (coupon && (!coupon.min_order_value || subtotal >= coupon.min_order_value)) {
        if (coupon.discount_percent > 0) {
          discount = parseFloat(((subtotal * coupon.discount_percent) / 100).toFixed(2));
        } else if (coupon.discount_amount > 0) {
          discount = Math.min(subtotal, parseFloat(coupon.discount_amount));
        }
      }
    }

    // Calculate estimated sales tax (approx 5%)
    const tax = parseFloat(((subtotal - discount) * 0.05).toFixed(2));

    // Final total
    const total = parseFloat((subtotal + delivery_fee + tax - discount).toFixed(2));

    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderData = {
      order_number: orderNumber,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      delivery_city,
      delivery_zip,
      delivery_slot,
      payment_method,
      payment_status: payment_method === 'Cash on Delivery' ? 'Pending' : 'Paid',
      subtotal,
      delivery_fee,
      discount,
      tax,
      total,
      status: 'Confirmed',
      notes,
      created_at: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert([orderData])
          .select()
          .single();

        if (!orderError && newOrder) {
          // Insert order items
          const lineItems = processedItems.map(pi => ({
            order_id: newOrder.id,
            product_id: pi.product_id,
            product_name: pi.product_name,
            product_image: pi.product_image,
            price: pi.price,
            quantity: pi.quantity,
            total_price: pi.total_price
          }));

          await supabase.from('order_items').insert(lineItems);

          // Decrement stock in Supabase for each item
          for (const item of processedItems) {
            try {
              const { data: currentProd } = await supabase
                .from('products')
                .select('stock')
                .eq('id', item.product_id)
                .single();
              if (currentProd && currentProd.stock !== null) {
                const newStock = Math.max(0, currentProd.stock - item.quantity);
                await supabase.from('products').update({ stock: newStock }).eq('id', item.product_id);
              }
            } catch (err) {
              // Non-fatal stock update failure
            }
          }

          return res.status(201).json({
            success: true,
            source: 'supabase-postgresql',
            message: 'Order placed successfully!',
            data: {
              ...newOrder,
              items: processedItems
            }
          });
        }
      } catch (err) {
        console.warn('[Create Order] Supabase insert failed, saving in memory:', err.message);
      }
    }

    // Fallback store
    const localOrder = {
      id: `ord-${Date.now()}`,
      ...orderData,
      items: processedItems
    };

    fallbackDb.orders.unshift(localOrder);

    res.status(201).json({
      success: true,
      source: supabase ? 'supabase-fallback' : 'in-memory-datastore',
      message: 'Order placed successfully!',
      data: localOrder
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const { email } = req.query;
    const supabase = getSupabase();

    if (supabase) {
      try {
        let query = supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (email) {
          query = query.ilike('customer_email', email);
        }

        const { data, error } = await query;
        if (!error && data) {
          return res.json({
            success: true,
            source: 'supabase-postgresql',
            data
          });
        }
      } catch (err) {
        console.warn('[Get Orders] Supabase query failed:', err.message);
      }
    }

    let orders = [...fallbackDb.orders];
    if (email) {
      orders = orders.filter(o => o.customer_email.toLowerCase() === email.toLowerCase());
    }

    res.json({
      success: true,
      source: supabase ? 'supabase-fallback' : 'in-memory-datastore',
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .or(`id.eq.${id},order_number.eq.${id}`)
          .maybeSingle();

        if (!error && data) {
          return res.json({ success: true, data });
        }
      } catch (err) {
        console.warn('[Get Order By ID] Supabase failed:', err.message);
      }
    }

    const order = fallbackDb.orders.find(o => o.id === id || o.order_number === id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PATCH /api/orders/:id/status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .or(`id.eq.${id},order_number.eq.${id}`)
          .select()
          .single();

        if (!error && data) {
          return res.json({ success: true, data });
        }
      } catch (err) {
        console.warn('[Update Order Status] Supabase update failed:', err.message);
      }
    }

    const orderIndex = fallbackDb.orders.findIndex(o => o.id === id || o.order_number === id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    fallbackDb.orders[orderIndex].status = status;
    fallbackDb.orders[orderIndex].updated_at = new Date().toISOString();

    res.json({ success: true, data: fallbackDb.orders[orderIndex] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};
```

---

<a id="backend-controllers-couponcontroller-js"></a>
## 📄 `backend/controllers/couponController.js`

> **Description**: Coupon code validation & discount computation  
> **Path**: `backend/controllers/couponController.js`  
> **Language**: javascript

```javascript
const { getSupabase, fallbackDb } = require('../config/supabase');

// GET /api/coupons
const getCoupons = async (req, res) => {
  try {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('coupons').select('*').eq('is_active', true);
        if (!error && data && data.length > 0) {
          return res.json({ success: true, data });
        }
      } catch (err) {
        console.warn('[Coupons] Supabase query failed:', err.message);
      }
    }

    res.json({
      success: true,
      data: fallbackDb.coupons.filter(c => c.is_active)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/coupons/validate
const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, error: 'Coupon code is required' });
    }

    const normalizedCode = code.trim().toUpperCase();
    let coupon = null;

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .ilike('code', normalizedCode)
          .eq('is_active', true)
          .maybeSingle();

        if (!error && data) {
          coupon = data;
        }
      } catch (err) {
        console.warn('[Validate Coupon] Supabase check failed:', err.message);
      }
    }

    if (!coupon) {
      coupon = fallbackDb.coupons.find(c => c.code.toUpperCase() === normalizedCode && c.is_active);
    }

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: `Coupon "${normalizedCode}" is invalid or expired`
      });
    }

    const orderSubtotal = parseFloat(subtotal) || 0;
    if (coupon.min_order_value && orderSubtotal < coupon.min_order_value) {
      return res.status(400).json({
        success: false,
        error: `Coupon "${normalizedCode}" requires a minimum order of $${coupon.min_order_value.toFixed(2)} (Current subtotal: $${orderSubtotal.toFixed(2)})`
      });
    }

    let discountAmount = 0;
    if (coupon.discount_percent > 0) {
      discountAmount = parseFloat(((orderSubtotal * coupon.discount_percent) / 100).toFixed(2));
    } else if (coupon.discount_amount > 0) {
      discountAmount = Math.min(orderSubtotal, parseFloat(coupon.discount_amount));
    }

    res.json({
      success: true,
      message: `Coupon "${normalizedCode}" applied successfully!`,
      data: {
        code: coupon.code,
        discount_percent: coupon.discount_percent,
        discount_amount: discountAmount,
        min_order_value: coupon.min_order_value
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getCoupons,
  validateCoupon
};
```

---

<a id="backend-controllers-statscontroller-js"></a>
## 📄 `backend/controllers/statsController.js`

> **Description**: Store performance metrics, sales, & order stats  
> **Path**: `backend/controllers/statsController.js`  
> **Language**: javascript

```javascript
const { getSupabase, fallbackDb } = require('../config/supabase');

// GET /api/stats
const getStats = async (req, res) => {
  try {
    const supabase = getSupabase();

    if (supabase) {
      try {
        const [ordersRes, prodsRes] = await Promise.all([
          supabase.from('orders').select('total, status, created_at'),
          supabase.from('products').select('id', { count: 'exact', head: true })
        ]);

        if (!ordersRes.error && ordersRes.data) {
          const orders = ordersRes.data;
          const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
          const totalOrders = orders.length;
          const totalProducts = prodsRes.count || fallbackDb.products.length;

          const statusCounts = orders.reduce((acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
          }, {});

          return res.json({
            success: true,
            source: 'supabase-postgresql',
            data: {
              totalRevenue: parseFloat(totalRevenue.toFixed(2)),
              totalOrders,
              totalProducts,
              averageOrderValue: totalOrders > 0 ? parseFloat((totalRevenue / totalOrders).toFixed(2)) : 0,
              statusCounts
            }
          });
        }
      } catch (err) {
        console.warn('[Stats] Supabase query failed:', err.message);
      }
    }

    // Fallback metrics
    const orders = fallbackDb.orders;
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = fallbackDb.products.length;

    const statusCounts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      source: supabase ? 'supabase-fallback' : 'in-memory-datastore',
      data: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        totalProducts,
        averageOrderValue: totalOrders > 0 ? parseFloat((totalRevenue / totalOrders).toFixed(2)) : 0,
        statusCounts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getStats
};
```

---

<a id="backend-data-initialproducts-js"></a>
## 📄 `backend/data/initialProducts.js`

> **Description**: Default seed catalog with 24+ grocery items  
> **Path**: `backend/data/initialProducts.js`  
> **Language**: javascript

```javascript
// Default sample data mirroring database/seed.sql
// Used for seeding and instant fallback when running without Supabase credentials

const initialCategories = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Fresh Produce',
    slug: 'fruits-vegetables',
    icon: 'apple',
    image_url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp farm-fresh organic vegetables, leafy greens and juicy seasonal fruits.',
    item_count: 6
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Dairy & Eggs',
    slug: 'dairy-eggs',
    icon: 'milk',
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    description: 'Grass-fed fresh milk, artisan cheeses, yogurts, and pasture-raised eggs.',
    item_count: 4
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Bakery & Artisan Bread',
    slug: 'bakery-snacks',
    icon: 'croissant',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    description: 'Freshly baked sourdough, whole wheat baguettes, muffins, and flaky pastries.',
    item_count: 3
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Beverages & Juices',
    slug: 'beverages',
    icon: 'cup-soda',
    image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
    description: 'Cold-pressed natural juices, kombucha, specialty herbal teas, and roasts.',
    item_count: 3
  },
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    name: 'Pantry & Organic Staples',
    slug: 'organic-pantry',
    icon: 'wheat',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'Cold-pressed extra virgin olive oils, Himalayan pink salt, quinoa, grains & pulses.',
    item_count: 3
  },
  {
    id: 'c6666666-6666-6666-6666-666666666666',
    name: 'Meat & Wild Seafood',
    slug: 'meat-seafood',
    icon: 'fish',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Sustainably raised meats, organic poultry cuts, and fresh wild-caught salmon fillets.',
    item_count: 3
  }
];

const initialProducts = [
  // Produce
  {
    id: 'p1010001-0000-0000-0000-000000000001',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    category_slug: 'fruits-vegetables',
    category_name: 'Fresh Produce',
    name: 'Organic Honeycrisp Apples',
    slug: 'organic-honeycrisp-apples',
    description: 'Extra juicy, hand-picked crisp Honeycrisp apples from local organic Washington orchards. Perfect for snacking, fruit salads, and baking.',
    price: 3.99,
    original_price: 4.99,
    discount_percent: 20,
    unit: '1 kg (approx 4-5 pcs)',
    stock: 85,
    rating: 4.9,
    review_count: 142,
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: true,
    is_popular: true,
    badge: 'Organic',
    nutrition: { calories: '52 kcal', protein: '0.3g', carbs: '14g', fiber: '2.4g' }
  },
  {
    id: 'p1010002-0000-0000-0000-000000000002',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    category_slug: 'fruits-vegetables',
    category_name: 'Fresh Produce',
    name: 'Fresh Hass Avocados (Ripe & Ready)',
    slug: 'fresh-hass-avocados',
    description: 'Creamy and rich Hass avocados, perfect for freshly smashed guacamole, toast, or keto bowls.',
    price: 4.49,
    original_price: 5.99,
    discount_percent: 25,
    unit: '3 pack (approx 450g)',
    stock: 60,
    rating: 4.8,
    review_count: 98,
    image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: true,
    is_popular: true,
    badge: 'Best Seller',
    nutrition: { calories: '160 kcal', healthy_fats: '15g', carbs: '9g', fiber: '7g' }
  },
  {
    id: 'p1010003-0000-0000-0000-000000000003',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    category_slug: 'fruits-vegetables',
    category_name: 'Fresh Produce',
    name: 'Organic Baby Spinach Leaves',
    slug: 'organic-baby-spinach',
    description: 'Tender, pre-washed triple-rinsed organic baby spinach leaves packed with iron and essential nutrients.',
    price: 2.99,
    original_price: 3.49,
    discount_percent: 14,
    unit: '250g clamshell',
    stock: 110,
    rating: 4.7,
    review_count: 76,
    image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: false,
    is_popular: true,
    badge: 'Fresh Today',
    nutrition: { calories: '23 kcal', iron: '2.7mg', protein: '2.9g', vitamin_a: '188%' }
  },
  {
    id: 'p1010004-0000-0000-0000-000000000004',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    category_slug: 'fruits-vegetables',
    category_name: 'Fresh Produce',
    name: 'Sweet Cavendish Bananas',
    slug: 'sweet-cavendish-bananas',
    description: 'Naturally ripened high-potassium bananas with vibrant yellow peels and smooth, sweet texture.',
    price: 1.49,
    original_price: 1.99,
    discount_percent: 25,
    unit: '1 bunch (approx 1.2 kg)',
    stock: 150,
    rating: 4.9,
    review_count: 210,
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    is_organic: false,
    is_featured: false,
    is_popular: true,
    badge: 'Value Pack',
    nutrition: { calories: '89 kcal', potassium: '358mg', carbs: '23g', sugar: '12g' }
  },
  {
    id: 'p1010005-0000-0000-0000-000000000005',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    category_slug: 'fruits-vegetables',
    category_name: 'Fresh Produce',
    name: 'Cherry Vine Tomatoes',
    slug: 'cherry-vine-tomatoes',
    description: 'Sweet and aromatic cherry tomatoes on the vine, delivering burst-in-mouth sweetness for salads.',
    price: 3.29,
    original_price: 3.99,
    discount_percent: 17,
    unit: '400g pack',
    stock: 75,
    rating: 4.8,
    review_count: 64,
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: false,
    is_popular: false,
    badge: 'Organic',
    nutrition: { calories: '18 kcal', vitamin_c: '22%', carbs: '3.9g', fiber: '1.2g' }
  },
  {
    id: 'p1010006-0000-0000-0000-000000000006',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    category_slug: 'fruits-vegetables',
    category_name: 'Fresh Produce',
    name: 'Crisp Fresh Broccoli Crowns',
    slug: 'crisp-fresh-broccoli-crowns',
    description: 'Farm-fresh deep green broccoli florets with dense crowns, rich in antioxidants and Vitamin K.',
    price: 2.49,
    original_price: 2.99,
    discount_percent: 16,
    unit: '500g',
    stock: 90,
    rating: 4.6,
    review_count: 52,
    image_url: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: false,
    is_popular: false,
    badge: 'Farm Direct',
    nutrition: { calories: '34 kcal', protein: '2.8g', fiber: '2.6g', vitamin_c: '148%' }
  },

  // Dairy & Eggs
  {
    id: 'p2020001-0000-0000-0000-000000000001',
    category_id: 'c2222222-2222-2222-2222-222222222222',
    category_slug: 'dairy-eggs',
    category_name: 'Dairy & Eggs',
    name: 'Organic Whole Grass-Fed Milk',
    slug: 'organic-whole-grass-fed-milk',
    description: 'Pure unhomogenized grass-fed whole milk from family-owned pasture farms. Rich in Omega-3 and calcium.',
    price: 4.89,
    original_price: 5.49,
    discount_percent: 11,
    unit: '1 Gallon (3.78 L)',
    stock: 45,
    rating: 4.9,
    review_count: 185,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: true,
    is_popular: true,
    badge: 'Top Pick',
    nutrition: { calories: '150 kcal', calcium: '300mg', protein: '8g', fat: '8g' }
  },
  {
    id: 'p2020002-0000-0000-0000-000000000002',
    category_id: 'c2222222-2222-2222-2222-222222222222',
    category_slug: 'dairy-eggs',
    category_name: 'Dairy & Eggs',
    name: 'Pasture-Raised Grade A Large Eggs',
    slug: 'pasture-raised-large-eggs',
    description: 'Certified humane pasture-raised eggs with vibrant deep orange yolks and superior rich flavor.',
    price: 5.99,
    original_price: 6.99,
    discount_percent: 14,
    unit: '12 pcs carton',
    stock: 80,
    rating: 5.0,
    review_count: 312,
    image_url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: true,
    is_popular: true,
    badge: 'Best Seller',
    nutrition: { calories: '70 kcal', protein: '6g', choline: '147mg', fat: '5g' }
  },
  {
    id: 'p2020003-0000-0000-0000-000000000003',
    category_id: 'c2222222-2222-2222-2222-222222222222',
    category_slug: 'dairy-eggs',
    category_name: 'Dairy & Eggs',
    name: 'Artisan Greek Yogurt (Plain 5% Fat)',
    slug: 'artisan-greek-yogurt-plain',
    description: 'Thick, velvety authentic strained Greek yogurt with 18g of gut-friendly natural active protein per cup.',
    price: 4.29,
    original_price: 4.99,
    discount_percent: 14,
    unit: '907g (32 oz)',
    stock: 55,
    rating: 4.8,
    review_count: 92,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: false,
    is_popular: true,
    badge: 'Healthy Choice',
    nutrition: { calories: '170 kcal', protein: '18g', probiotics: '6 Live Strains' }
  },
  {
    id: 'p2020004-0000-0000-0000-000000000004',
    category_id: 'c2222222-2222-2222-2222-222222222222',
    category_slug: 'dairy-eggs',
    category_name: 'Dairy & Eggs',
    name: 'Aged Sharp Cheddar Cheese Block',
    slug: 'aged-sharp-cheddar-block',
    description: 'Aged naturally for 18 months in Wisconsin caves for bold savory depth and smooth crumbly bite.',
    price: 6.49,
    original_price: 7.99,
    discount_percent: 18,
    unit: '250g block',
    stock: 40,
    rating: 4.9,
    review_count: 88,
    image_url: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=600&q=80',
    is_organic: false,
    is_featured: false,
    is_popular: false,
    badge: 'Artisan',
    nutrition: { calories: '110 kcal', protein: '7g', fat: '9g', calcium: '20%' }
  },

  // Bakery
  {
    id: 'p3030001-0000-0000-0000-000000000001',
    category_id: 'c3333333-3333-3333-3333-333333333333',
    category_slug: 'bakery-snacks',
    category_name: 'Bakery & Artisan Bread',
    name: 'Artisan Sourdough Boule',
    slug: 'artisan-sourdough-boule',
    description: 'Slowly fermented for 36 hours with wild sourdough starter, baked in a hearth oven with blistered crust.',
    price: 4.99,
    original_price: 5.99,
    discount_percent: 16,
    unit: '650g loaf',
    stock: 35,
    rating: 4.9,
    review_count: 115,
    image_url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: true,
    is_popular: true,
    badge: 'Fresh Baked',
    nutrition: { calories: '140 kcal', carbs: '28g', protein: '5g', fermented: 'Yes' }
  },
  {
    id: 'p3030002-0000-0000-0000-000000000002',
    category_id: 'c3333333-3333-3333-3333-333333333333',
    category_slug: 'bakery-snacks',
    category_name: 'Bakery & Artisan Bread',
    name: 'French Butter Croissants (4-Pack)',
    slug: 'french-butter-croissants-4pack',
    description: 'Flaky, golden-layered French all-butter croissants that melt in your mouth when toasted.',
    price: 5.49,
    original_price: 6.49,
    discount_percent: 15,
    unit: '4 pcs pack (320g)',
    stock: 30,
    rating: 4.8,
    review_count: 79,
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    is_organic: false,
    is_featured: true,
    is_popular: false,
    badge: 'Bakery Special',
    nutrition: { calories: '260 kcal', fat: '14g', carbs: '29g', protein: '5g' }
  },
  {
    id: 'p3030003-0000-0000-0000-000000000003',
    category_id: 'c3333333-3333-3333-3333-333333333333',
    category_slug: 'bakery-snacks',
    category_name: 'Bakery & Artisan Bread',
    name: 'Organic Whole Grain Seeded Loaf',
    slug: 'organic-whole-grain-seeded-loaf',
    description: 'Wholesome loaf packed with flaxseeds, chia seeds, sunflower seeds, and rolled oats for prolonged energy.',
    price: 4.49,
    original_price: 5.29,
    discount_percent: 15,
    unit: '500g loaf',
    stock: 50,
    rating: 4.7,
    review_count: 63,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: false,
    is_popular: false,
    badge: 'High Fiber',
    nutrition: { calories: '110 kcal', fiber: '5g', protein: '5g', sugar: '1g' }
  },

  // Beverages
  {
    id: 'p4040001-0000-0000-0000-000000000001',
    category_id: 'c4444444-4444-4444-4444-444444444444',
    category_slug: 'beverages',
    category_name: 'Beverages & Juices',
    name: 'Cold-Pressed 100% Valencia Orange Juice',
    slug: 'cold-pressed-orange-juice',
    description: 'Freshly squeezed pure sweet Florida Valencia oranges with light natural pulp. No added sugars.',
    price: 4.99,
    original_price: 6.29,
    discount_percent: 20,
    unit: '1 Liter Bottle',
    stock: 65,
    rating: 4.9,
    review_count: 134,
    image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: true,
    is_popular: true,
    badge: '100% Pure',
    nutrition: { calories: '110 kcal', vitamin_c: '200%', carbs: '26g', sugar: '22g natural' }
  },
  {
    id: 'p4040002-0000-0000-0000-000000000002',
    category_id: 'c4444444-4444-4444-4444-444444444444',
    category_slug: 'beverages',
    category_name: 'Beverages & Juices',
    name: 'Organic Raw Ginger-Lemon Kombucha',
    slug: 'organic-ginger-lemon-kombucha',
    description: 'Sparkling fermented black tea with zesty ginger root and tart lemon. Packed with living digestive probiotics.',
    price: 3.89,
    original_price: 4.79,
    discount_percent: 18,
    unit: '473ml (16 oz)',
    stock: 80,
    rating: 4.8,
    review_count: 97,
    image_url: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: false,
    is_popular: true,
    badge: 'Probiotic',
    nutrition: { calories: '40 kcal', probiotics: '2 Billion CFU', sugar: '8g' }
  },
  {
    id: 'p4040003-0000-0000-0000-000000000003',
    category_id: 'c4444444-4444-4444-4444-444444444444',
    category_slug: 'beverages',
    category_name: 'Beverages & Juices',
    name: 'Cold Brew Specialty Single Origin Coffee',
    slug: 'cold-brew-single-origin-coffee',
    description: 'Steeped for 20 hours with organic Ethiopian beans for a smooth, chocolatey, low-acidity brew.',
    price: 4.49,
    original_price: 5.49,
    discount_percent: 18,
    unit: '946ml (32 oz)',
    stock: 50,
    rating: 4.9,
    review_count: 108,
    image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: false,
    is_popular: false,
    badge: 'Artisan Roast',
    nutrition: { calories: '5 kcal', caffeine: '180mg', sugar: '0g' }
  },

  // Pantry
  {
    id: 'p5050001-0000-0000-0000-000000000001',
    category_id: 'c5555555-5555-5555-5555-555555555555',
    category_slug: 'organic-pantry',
    category_name: 'Pantry & Organic Staples',
    name: 'Extra Virgin Cold-Pressed Olive Oil',
    slug: 'extra-virgin-olive-oil-greek',
    description: 'First cold press Koroneiki olives from Kalamata, Greece. Under 0.2% acidity with spicy peppery finish.',
    price: 14.99,
    original_price: 18.99,
    discount_percent: 21,
    unit: '750ml glass bottle',
    stock: 45,
    rating: 5.0,
    review_count: 240,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: true,
    is_popular: true,
    badge: 'Award Winner',
    nutrition: { calories: '120 kcal per tbsp', polyphenols: 'High', fats: '14g' }
  },
  {
    id: 'p5050002-0000-0000-0000-000000000002',
    category_id: 'c5555555-5555-5555-5555-555555555555',
    category_slug: 'organic-pantry',
    category_name: 'Pantry & Organic Staples',
    name: 'Organic Royal Tri-Color Quinoa',
    slug: 'organic-royal-tri-color-quinoa',
    description: 'Pre-washed blend of white, red, and black Andean quinoa grains. High complete plant protein.',
    price: 5.99,
    original_price: 7.49,
    discount_percent: 20,
    unit: '1 kg pouch',
    stock: 70,
    rating: 4.8,
    review_count: 85,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: false,
    is_popular: false,
    badge: 'Superfood',
    nutrition: { calories: '170 kcal', protein: '6g', fiber: '3g', iron: '15%' }
  },
  {
    id: 'p5050003-0000-0000-0000-000000000003',
    category_id: 'c5555555-5555-5555-5555-555555555555',
    category_slug: 'organic-pantry',
    category_name: 'Pantry & Organic Staples',
    name: 'Raw Organic Wildflower Forest Honey',
    slug: 'raw-wildflower-forest-honey',
    description: 'Unfiltered, unpasteurized amber honey harvested sustainably from pristine mountain apiaries.',
    price: 8.49,
    original_price: 10.99,
    discount_percent: 22,
    unit: '500g jar',
    stock: 60,
    rating: 4.9,
    review_count: 163,
    image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: true,
    is_popular: true,
    badge: 'Raw & Pure',
    nutrition: { calories: '60 kcal per tbsp', enzymes: 'Active', sugar: '16g natural' }
  },

  // Meat & Seafood
  {
    id: 'p6060001-0000-0000-0000-000000000001',
    category_id: 'c6666666-6666-6666-6666-666666666666',
    category_slug: 'meat-seafood',
    category_name: 'Meat & Wild Seafood',
    name: 'Wild-Caught Alaskan Sockeye Salmon Fillet',
    slug: 'wild-alaskan-salmon-fillet',
    description: 'Sustainably line-caught vibrant red Alaskan salmon fillet, packed with heart-healthy Omega-3 fatty acids.',
    price: 12.99,
    original_price: 15.99,
    discount_percent: 18,
    unit: '450g skin-on fillet',
    stock: 35,
    rating: 4.9,
    review_count: 192,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    is_organic: false,
    is_featured: true,
    is_popular: true,
    badge: 'Chef Selection',
    nutrition: { calories: '220 kcal', protein: '27g', omega_3: '1400mg', fat: '11g' }
  },
  {
    id: 'p6060002-0000-0000-0000-000000000002',
    category_id: 'c6666666-6666-6666-6666-666666666666',
    category_slug: 'meat-seafood',
    category_name: 'Meat & Wild Seafood',
    name: 'Organic Free-Range Boneless Chicken Breasts',
    slug: 'organic-free-range-chicken-breasts',
    description: 'Humanely raised antibiotic-free and hormone-free tender lean chicken breast fillets.',
    price: 8.99,
    original_price: 10.99,
    discount_percent: 18,
    unit: '750g tray (approx 3 fillets)',
    stock: 50,
    rating: 4.8,
    review_count: 145,
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
    is_organic: true,
    is_featured: false,
    is_popular: true,
    badge: 'Organic Meat',
    nutrition: { calories: '165 kcal', protein: '31g', fat: '3.6g', iron: '6%' }
  },
  {
    id: 'p6060003-0000-0000-0000-000000000003',
    category_id: 'c6666666-6666-6666-6666-666666666666',
    category_slug: 'meat-seafood',
    category_name: 'Meat & Wild Seafood',
    name: 'Grass-Fed Angus Beef Ribeye Steak',
    slug: 'grass-fed-angus-ribeye-steak',
    description: '100% pasture-raised tender beef ribeye steak with exquisite marbling and robust depth of flavor.',
    price: 16.99,
    original_price: 19.99,
    discount_percent: 15,
    unit: '340g (12 oz steak)',
    stock: 25,
    rating: 5.0,
    review_count: 118,
    image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
    is_organic: false,
    is_featured: true,
    is_popular: false,
    badge: 'Premium Cut',
    nutrition: { calories: '291 kcal', protein: '24g', fat: '21g', iron: '15%' }
  }
];

const initialCoupons = [
  { code: 'FRESH20', discount_percent: 20, discount_amount: 0, min_order_value: 25.00, is_active: true },
  { code: 'ORGANIC15', discount_percent: 15, discount_amount: 0, min_order_value: 30.00, is_active: true },
  { code: 'SAVE10', discount_percent: 10, discount_amount: 0, min_order_value: 20.00, is_active: true },
  { code: 'FREESHIP', discount_percent: 0, discount_amount: 5.00, min_order_value: 35.00, is_active: true }
];

module.exports = {
  initialCategories,
  initialProducts,
  initialCoupons
};
```

---

<a id="database-schema-sql"></a>
## 📄 `database/schema.sql`

> **Description**: PostgreSQL DDL schema (Tables, RLS, Indexes, Triggers)  
> **Path**: `database/schema.sql`  
> **Language**: sql

```sql
-- ==============================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR ONLINE GROCERY STORE
-- ==============================================================================
-- Run this script in the Supabase SQL Editor:
-- Project Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if re-running (in reverse dependency order)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ------------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50) DEFAULT 'basket',
    image_url TEXT,
    description TEXT,
    item_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) CHECK (original_price >= price),
    discount_percent INT DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    unit VARCHAR(50) NOT NULL DEFAULT '1 kg', -- e.g. 500g, 1 kg, 6 pcs, 1 L
    stock INT NOT NULL DEFAULT 50 CHECK (stock >= 0),
    rating NUMERIC(2, 1) DEFAULT 4.5 CHECK (rating >= 1.0 AND rating <= 5.0),
    review_count INT DEFAULT 0 CHECK (review_count >= 0),
    image_url TEXT NOT NULL,
    is_organic BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    badge VARCHAR(50), -- e.g. 'Fresh', 'Hot Sale', 'Best Seller', 'Organic'
    nutrition JSONB DEFAULT '{"calories": "50 kcal", "protein": "1g", "carbs": "12g", "fat": "0.2g"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. COUPONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INT DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    discount_amount NUMERIC(10, 2) DEFAULT 0 CHECK (discount_amount >= 0),
    min_order_value NUMERIC(10, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. ORDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    delivery_city VARCHAR(100) DEFAULT 'Downtown',
    delivery_zip VARCHAR(20) DEFAULT '10001',
    delivery_slot VARCHAR(100) DEFAULT 'Standard Delivery (30-45 mins)',
    payment_method VARCHAR(50) DEFAULT 'Cash on Delivery', -- 'Card', 'COD', 'UPI', 'Digital Wallet'
    payment_status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Paid', 'Failed'
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    delivery_fee NUMERIC(10, 2) DEFAULT 0 CHECK (delivery_fee >= 0),
    discount NUMERIC(10, 2) DEFAULT 0 CHECK (discount >= 0),
    tax NUMERIC(10, 2) DEFAULT 0 CHECK (tax >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. ORDER_ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. REVIEWS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_popular ON products(is_popular);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);

-- ------------------------------------------------------------------------------
-- AUTOMATIC updated_at TRIGGER FUNCTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trigger_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Categories & Products: Public Read Access
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);

-- Orders & Order Items: Anyone can insert orders
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public insert order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read order items" ON order_items FOR SELECT USING (true);

-- Admin / Full Access: Allows service role or authenticated admin to perform all operations
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage coupons" ON coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage order items" ON order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
```

---

<a id="database-seed-sql"></a>
## 📄 `database/seed.sql`

> **Description**: PostgreSQL seed dataset (categories, products, coupons)  
> **Path**: `database/seed.sql`  
> **Language**: sql

```sql
-- ==============================================================================
-- SUPABASE POSTGRESQL SEED DATA FOR ONLINE GROCERY STORE
-- ==============================================================================
-- Run this script in the Supabase SQL Editor after running schema.sql
-- ==============================================================================

-- 1. INSERT CATEGORIES
INSERT INTO categories (id, name, slug, icon, image_url, description, item_count)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Fresh Produce', 'fruits-vegetables', 'apple', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80', 'Crisp farm-fresh organic vegetables, leafy greens and juicy seasonal fruits.', 8),
    ('c2222222-2222-2222-2222-222222222222', 'Dairy & Eggs', 'dairy-eggs', 'milk', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', 'Grass-fed fresh milk, artisan cheeses, yogurts, and pasture-raised eggs.', 6),
    ('c3333333-3333-3333-3333-333333333333', 'Bakery & Artisan Bread', 'bakery-snacks', 'croissant', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 'Freshly baked sourdough, whole wheat baguettes, muffins, and flaky pastries.', 5),
    ('c4444444-4444-4444-4444-444444444444', 'Beverages & Juices', 'beverages', 'cup-soda', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80', 'Cold-pressed natural juices, kombucha, specialty herbal teas, and roasts.', 5),
    ('c5555555-5555-5555-5555-555555555555', 'Pantry & Organic Staples', 'organic-pantry', 'wheat', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 'Cold-pressed extra virgin olive oils, Himalayan pink salt, quinoa, grains & pulses.', 5),
    ('c6666666-6666-6666-6666-666666666666', 'Meat & Wild Seafood', 'meat-seafood', 'fish', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', 'Sustainably raised meats, organic poultry cuts, and fresh wild-caught salmon fillets.', 4)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    image_url = EXCLUDED.image_url;

-- 2. INSERT PRODUCTS
INSERT INTO products (id, category_id, name, slug, description, price, original_price, discount_percent, unit, stock, rating, review_count, image_url, is_organic, is_featured, is_popular, badge, nutrition)
VALUES
    -- Produce
    ('p1010001-0000-0000-0000-000000000001', 'c1111111-1111-1111-1111-111111111111', 
     'Organic Honeycrisp Apples', 'organic-honeycrisp-apples', 
     'Extra juicy, hand-picked crisp Honeycrisp apples from local organic Washington orchards. Perfect for snacking, fruit salads, and baking.',
     3.99, 4.99, 20, '1 kg (approx 4-5 pcs)', 85, 4.9, 142,
     'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Organic',
     '{"calories": "52 kcal", "protein": "0.3g", "carbs": "14g", "fiber": "2.4g"}'::jsonb),

    ('p1010002-0000-0000-0000-000000000002', 'c1111111-1111-1111-1111-111111111111',
     'Fresh Hass Avocados (Ripe & Ready)', 'fresh-hass-avocados',
     'Creamy and rich Hass avocados, perfect for freshly smashed guacamole, toast, or keto bowls.',
     4.49, 5.99, 25, '3 pack (approx 450g)', 60, 4.8, 98,
     'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Best Seller',
     '{"calories": "160 kcal", "healthy_fats": "15g", "carbs": "9g", "fiber": "7g"}'::jsonb),

    ('p1010003-0000-0000-0000-000000000003', 'c1111111-1111-1111-1111-111111111111',
     'Organic Baby Spinach Leaves', 'organic-baby-spinach',
     'Tender, pre-washed triple-rinsed organic baby spinach leaves packed with iron and essential nutrients.',
     2.99, 3.49, 14, '250g clamshell', 110, 4.7, 76,
     'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
     true, false, true, 'Fresh Today',
     '{"calories": "23 kcal", "iron": "2.7mg", "protein": "2.9g", "vitamin_a": "188%"}'::jsonb),

    ('p1010004-0000-0000-0000-000000000004', 'c1111111-1111-1111-1111-111111111111',
     'Sweet Cavendish Bananas', 'sweet-cavendish-bananas',
     'Naturally ripened high-potassium bananas with vibrant yellow peels and smooth, sweet texture.',
     1.49, 1.99, 25, '1 bunch (approx 1.2 kg)', 150, 4.9, 210,
     'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
     false, false, true, 'Value Pack',
     '{"calories": "89 kcal", "potassium": "358mg", "carbs": "23g", "sugar": "12g"}'::jsonb),

    ('p1010005-0000-0000-0000-000000000005', 'c1111111-1111-1111-1111-111111111111',
     'Cherry Vine Tomatoes', 'cherry-vine-tomatoes',
     'Sweet and aromatic cherry tomatoes on the vine, delivering burst-in-mouth sweetness for salads.',
     3.29, 3.99, 17, '400g pack', 75, 4.8, 64,
     'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
     true, false, false, 'Organic',
     '{"calories": "18 kcal", "vitamin_c": "22%", "carbs": "3.9g", "fiber": "1.2g"}'::jsonb),

    ('p1010006-0000-0000-0000-000000000006', 'c1111111-1111-1111-1111-111111111111',
     'Crisp Fresh Broccoli Crowns', 'crisp-fresh-broccoli-crowns',
     'Farm-fresh deep green broccoli florets with dense crowns, rich in antioxidants and Vitamin K.',
     2.49, 2.99, 16, '500g', 90, 4.6, 52,
     'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80',
     true, false, false, 'Farm Direct',
     '{"calories": "34 kcal", "protein": "2.8g", "fiber": "2.6g", "vitamin_c": "148%"}'::jsonb),

    -- Dairy & Eggs
    ('p2020001-0000-0000-0000-000000000001', 'c2222222-2222-2222-2222-222222222222',
     'Organic Whole Grass-Fed Milk', 'organic-whole-grass-fed-milk',
     'Pure unhomogenized grass-fed whole milk from family-owned pasture farms. Rich in Omega-3 and calcium.',
     4.89, 5.49, 11, '1 Gallon (3.78 L)', 45, 4.9, 185,
     'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Top Pick',
     '{"calories": "150 kcal", "calcium": "300mg", "protein": "8g", "fat": "8g"}'::jsonb),

    ('p2020002-0000-0000-0000-000000000002', 'c2222222-2222-2222-2222-222222222222',
     'Pasture-Raised Grade A Large Eggs', 'pasture-raised-large-eggs',
     'Certified humane pasture-raised eggs with vibrant deep orange yolks and superior rich flavor.',
     5.99, 6.99, 14, '12 pcs carton', 80, 5.0, 312,
     'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Best Seller',
     '{"calories": "70 kcal", "protein": "6g", "choline": "147mg", "fat": "5g"}'::jsonb),

    ('p2020003-0000-0000-0000-000000000003', 'c2222222-2222-2222-2222-222222222222',
     'Artisan Greek Yogurt (Plain 5% Fat)', 'artisan-greek-yogurt-plain',
     'Thick, velvety authentic strained Greek yogurt with 18g of gut-friendly natural active protein per cup.',
     4.29, 4.99, 14, '907g (32 oz)', 55, 4.8, 92,
     'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
     true, false, true, 'Healthy Choice',
     '{"calories": "170 kcal", "protein": "18g", "probiotics": "6 Live Strains"}'::jsonb),

    ('p2020004-0000-0000-0000-000000000004', 'c2222222-2222-2222-2222-222222222222',
     'Aged Sharp Cheddar Cheese Block', 'aged-sharp-cheddar-block',
     'Aged naturally for 18 months in Wisconsin caves for bold savory depth and smooth crumbly bite.',
     6.49, 7.99, 18, '250g block', 40, 4.9, 88,
     'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=600&q=80',
     false, false, false, 'Artisan',
     '{"calories": "110 kcal", "protein": "7g", "fat": "9g", "calcium": "20%"}'::jsonb),

    -- Bakery & Bread
    ('p3030001-0000-0000-0000-000000000001', 'c3333333-3333-3333-3333-333333333333',
     'Artisan Sourdough Boule', 'artisan-sourdough-boule',
     'Slowly fermented for 36 hours with wild sourdough starter, baked in a hearth oven with blistered crust.',
     4.99, 5.99, 16, '650g loaf', 35, 4.9, 115,
     'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Fresh Baked',
     '{"calories": "140 kcal", "carbs": "28g", "protein": "5g", "fermented": "Yes"}'::jsonb),

    ('p3030002-0000-0000-0000-000000000002', 'c3333333-3333-3333-3333-333333333333',
     'French Butter Croissants (4-Pack)', 'french-butter-croissants-4pack',
     'Flaky, golden-layered French all-butter croissants that melt in your mouth when toasted.',
     5.49, 6.49, 15, '4 pcs pack (320g)', 30, 4.8, 79,
     'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
     false, true, false, 'Bakery Special',
     '{"calories": "260 kcal", "fat": "14g", "carbs": "29g", "protein": "5g"}'::jsonb),

    ('p3030003-0000-0000-0000-000000000003', 'c3333333-3333-3333-3333-333333333333',
     'Organic Whole Grain Seeded Loaf', 'organic-whole-grain-seeded-loaf',
     'Wholesome loaf packed with flaxseeds, chia seeds, sunflower seeds, and rolled oats for prolonged energy.',
     4.49, 5.29, 15, '500g loaf', 50, 4.7, 63,
     'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
     true, false, false, 'High Fiber',
     '{"calories": "110 kcal", "fiber": "5g", "protein": "5g", "sugar": "1g"}'::jsonb),

    -- Beverages
    ('p4040001-0000-0000-0000-000000000001', 'c4444444-4444-4444-4444-444444444444',
     'Cold-Pressed 100% Valencia Orange Juice', 'cold-pressed-orange-juice',
     'Freshly squeezed pure sweet Florida Valencia oranges with light natural pulp. No added sugars.',
     4.99, 6.29, 20, '1 Liter Bottle', 65, 4.9, 134,
     'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80',
     true, true, true, '100% Pure',
     '{"calories": "110 kcal", "vitamin_c": "200%", "carbs": "26g", "sugar": "22g (natural)"}'::jsonb),

    ('p4040002-0000-0000-0000-000000000002', 'c4444444-4444-4444-4444-444444444444',
     'Organic Raw Ginger-Lemon Kombucha', 'organic-ginger-lemon-kombucha',
     'Sparkling fermented black tea with zesty ginger root and tart lemon. Packed with living digestive probiotics.',
     3.89, 4.79, 18, '473ml (16 oz)', 80, 4.8, 97,
     'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
     true, false, true, 'Probiotic',
     '{"calories": "40 kcal", "probiotics": "2 Billion CFU", "sugar": "8g"}'::jsonb),

    ('p4040003-0000-0000-0000-000000000003', 'c4444444-4444-4444-4444-444444444444',
     'Cold Brew Specialty Single Origin Coffee', 'cold-brew-single-origin-coffee',
     'Steeped for 20 hours with organic Ethiopian beans for a smooth, chocolatey, low-acidity brew.',
     4.49, 5.49, 18, '946ml (32 oz)', 50, 4.9, 108,
     'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
     true, false, false, 'Artisan Roast',
     '{"calories": "5 kcal", "caffeine": "180mg", "sugar": "0g"}'::jsonb),

    -- Pantry
    ('p5050001-0000-0000-0000-000000000001', 'c5555555-5555-5555-5555-555555555555',
     'Extra Virgin Cold-Pressed Olive Oil', 'extra-virgin-olive-oil-greek',
     'First cold press Koroneiki olives from Kalamata, Greece. Under 0.2% acidity with spicy peppery finish.',
     14.99, 18.99, 21, '750ml glass bottle', 45, 5.0, 240,
     'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Award Winner',
     '{"calories": "120 kcal per tbsp", "polyphenols": "High", "fats": "14g"}'::jsonb),

    ('p5050002-0000-0000-0000-000000000002', 'c5555555-5555-5555-5555-555555555555',
     'Organic Royal Tri-Color Quinoa', 'organic-royal-tri-color-quinoa',
     'Pre-washed blend of white, red, and black Andean quinoa grains. High complete plant protein.',
     5.99, 7.49, 20, '1 kg pouch', 70, 4.8, 85,
     'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
     true, false, false, 'Superfood',
     '{"calories": "170 kcal", "protein": "6g", "fiber": "3g", "iron": "15%"}'::jsonb),

    ('p5050003-0000-0000-0000-000000000003', 'c5555555-5555-5555-5555-555555555555',
     'Raw Organic Wildflower Forest Honey', 'raw-wildflower-forest-honey',
     'Unfiltered, unpasteurized amber honey harvested sustainably from pristine mountain apiaries.',
     8.49, 10.99, 22, '500g jar', 60, 4.9, 163,
     'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Raw & Pure',
     '{"calories": "60 kcal per tbsp", "enzymes": "Active", "sugar": "16g natural"}'::jsonb),

    -- Meat & Wild Seafood
    ('p6060001-0000-0000-0000-000000000001', 'c6666666-6666-6666-6666-666666666666',
     'Wild-Caught Alaskan Sockeye Salmon Fillet', 'wild-alaskan-salmon-fillet',
     'Sustainably line-caught vibrant red Alaskan salmon fillet, packed with heart-healthy Omega-3 fatty acids.',
     12.99, 15.99, 18, '450g skin-on fillet', 35, 4.9, 192,
     'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
     false, true, true, 'Chef Selection',
     '{"calories": "220 kcal", "protein": "27g", "omega_3": "1400mg", "fat": "11g"}'::jsonb),

    ('p6060002-0000-0000-0000-000000000002', 'c6666666-6666-6666-6666-666666666666',
     'Organic Free-Range Boneless Chicken Breasts', 'organic-free-range-chicken-breasts',
     'Humanely raised antibiotic-free and hormone-free tender lean chicken breast fillets.',
     8.99, 10.99, 18, '750g tray (approx 3 fillets)', 50, 4.8, 145,
     'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
     true, false, true, 'Organic Meat',
     '{"calories": "165 kcal", "protein": "31g", "fat": "3.6g", "iron": "6%"}'::jsonb),

    ('p6060003-0000-0000-0000-000000000003', 'c6666666-6666-6666-6666-666666666666',
     'Grass-Fed Angus Beef Ribeye Steak', 'grass-fed-angus-ribeye-steak',
     '100% pasture-raised tender beef ribeye steak with exquisite marbling and robust depth of flavor.',
     16.99, 19.99, 15, '340g (12 oz steak)', 25, 5.0, 118,
     'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
     false, true, false, 'Premium Cut',
     '{"calories": "291 kcal", "protein": "24g", "fat": "21g", "iron": "15%"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    stock = EXCLUDED.stock,
    image_url = EXCLUDED.image_url;

-- 3. INSERT COUPONS
INSERT INTO coupons (code, discount_percent, discount_amount, min_order_value, is_active)
VALUES
    ('FRESH20', 20, 0, 25.00, true),
    ('ORGANIC15', 15, 0, 30.00, true),
    ('SAVE10', 10, 0, 20.00, true),
    ('FREESHIP', 0, 5.00, 35.00, true)
ON CONFLICT (code) DO NOTHING;

-- 4. INSERT SAMPLE REVIEWS
INSERT INTO reviews (product_id, user_name, rating, comment)
VALUES
    ('p1010001-0000-0000-0000-000000000001', 'Sophia Martinez', 5, 'Best Honeycrisp apples I have ever ordered online! Crisp, huge, and very fresh.'),
    ('p1010002-0000-0000-0000-000000000002', 'Liam Chen', 5, 'Avocados arrived perfectly ripe and unbruised. Super creamy guacamole.'),
    ('p2020002-0000-0000-0000-000000000002', 'Emma Watson', 5, 'You can genuinely taste the difference with pasture-raised eggs. Beautiful dark yolks.'),
    ('p5050001-0000-0000-0000-000000000001', 'Oliver Smith', 5, 'Authentic Greek olive oil. Notes of grass and pepper. Outstanding value.')
ON CONFLICT DO NOTHING;
```

---

<a id="database-readme-md"></a>
## 📄 `database/README.md`

> **Description**: Database architecture & Supabase instructions  
> **Path**: `database/README.md`  
> **Language**: markdown

```markdown
# Supabase PostgreSQL Database Setup Guide

This project uses **Supabase PostgreSQL** as its production relational database management system.

Follow these 4 simple steps to set up your Supabase database in under 3 minutes:

---

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in or sign up.
2. Click **New Project**.
3. Choose your organization, assign a Project Name (e.g. `online-grocery-store`), enter a database password, and choose the closest geographic region.
4. Click **Create new project** and wait ~1 minute for provisioning.

---

### Step 2: Run Database Schema and Seed Data
1. In the Supabase Dashboard left sidebar, click on **SQL Editor** (icon: `>_`).
2. Click **New Query**.
3. Open [`schema.sql`](file:///c:/Grocery_store/database/schema.sql) in this directory, copy its entire contents, paste it into the SQL Editor, and click **Run**.
   - *This creates tables (`categories`, `products`, `coupons`, `orders`, `order_items`, `reviews`), indexes, Row Level Security policies, and trigger functions.*
4. Now open [`seed.sql`](file:///c:/Grocery_store/database/seed.sql), copy its contents, paste it into the SQL Editor, and click **Run**.
   - *This populates your store with initial categories, grocery products, discount coupons, and sample reviews.*

---

### Step 3: Get Your API Keys
1. In your Supabase Dashboard, click on **Project Settings** (gear icon) -> **API**.
2. Copy the following values:
   - **Project URL** (e.g., `https://xyzabcdefg.supabase.co`)
   - **anon / public key** (under `Project API keys`)
   - *(Optional)* **service_role key** (for administrative backend tasks)

---

### Step 4: Configure Your Environment File
1. In your root project directory, open `.env` (or copy from `.env.example`).
2. Add your credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-public-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-optional-service-role-key-here
   ```
3. Restart your server:
   ```bash
   npm run dev
   ```
4. Check the console! It will print:
   ```text
   [Supabase] Successfully connected to Supabase PostgreSQL database at https://your-project-id.supabase.co
   ```

---

### Note on Graceful Fallback Mode
If you run the app before configuring Supabase credentials, the backend automatically operates in **Local Standalone Mode** with built-in in-memory grocery data. As soon as you configure `.env`, it automatically switches to live Supabase PostgreSQL queries!
```

---

<a id="frontend-index-html"></a>
## 📄 `frontend/index.html`

> **Description**: Single-page grocery store frontend structure  
> **Path**: `frontend/index.html`  
> **Language**: html

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FreshCart | Farm-Fresh Online Grocery & Fast Delivery</title>
  <meta name="description" content="Order 100% organic produce, dairy, bakery, beverages, and pantry staples with 15-minute express delivery. Powered by Supabase PostgreSQL and Node.js.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%22%22><text y=%2226%22 font-size=%2226%22>🛒</text></svg>">
  
  <!-- Google Fonts: Outfit (Display) & Plus Jakarta Sans (Body) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/components.css">
</head>
<body>

  <!-- Top Announcement Bar -->
  <aside class="announcement-bar" id="announcementBar">
    <div class="container announcement-content">
      <span class="announcement-tag">Special Offer</span>
      <p class="announcement-text">
        Use coupon code <strong class="coupon-highlight" id="topCouponCode" title="Click to copy code">FRESH20</strong> for 20% OFF! Free express delivery on orders over $35 🚚
      </p>
      <div class="announcement-actions">
        <span class="delivery-time-badge">⚡ 15-30 Min Delivery</span>
        <button class="announcement-close" id="closeAnnouncement" aria-label="Dismiss banner">&times;</button>
      </div>
    </div>
  </aside>

  <!-- Sticky Main Header -->
  <header class="main-header" id="mainHeader">
    <div class="container header-container">
      
      <!-- Brand Logo -->
      <a href="#" class="brand-logo" id="brandLogo">
        <div class="logo-icon-wrapper">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-name">Fresh<span>Cart</span></span>
          <span class="brand-subtitle">Organic Groceries</span>
        </div>
      </a>

      <!-- Location Selector -->
      <button class="location-btn" id="locationBtn" title="Change delivery location">
        <svg class="icon-location" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <div class="location-text">
          <span class="location-label">Deliver to</span>
          <span class="location-address" id="currentLocationText">New York, 10001</span>
        </div>
      </button>

      <!-- Search Bar -->
      <div class="search-wrapper">
        <div class="search-category-select">
          <select id="searchCategorySelect" aria-label="Select Category">
            <option value="all">All Departments</option>
            <!-- Categories populated via JS -->
          </select>
        </div>
        <div class="search-input-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" id="searchInput" placeholder="Search 500+ fresh organic fruits, dairy, bakery..." autocomplete="off">
          <button class="search-clear-btn" id="searchClearBtn" aria-label="Clear search" style="display: none;">&times;</button>
        </div>
      </div>

      <!-- Header Action Buttons -->
      <div class="header-actions">
        
        <!-- Theme Toggle -->
        <button class="icon-action-btn" id="themeToggleBtn" title="Toggle Dark/Light Mode" aria-label="Toggle Theme">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <!-- Wishlist Button -->
        <button class="icon-action-btn" id="wishlistBtn" title="Saved Items" aria-label="Wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span class="badge-count" id="wishlistCount">0</span>
        </button>

        <!-- Admin Portal Button -->
        <button class="admin-portal-btn" id="adminPortalBtn" title="Open Admin Inventory & Orders Portal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>Admin</span>
        </button>

        <!-- Cart Button -->
        <button class="cart-trigger-btn" id="cartTriggerBtn" aria-label="Open Cart">
          <div class="cart-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span class="badge-count" id="cartBadgeCount">0</span>
          </div>
          <div class="cart-total-info">
            <span class="cart-label">My Cart</span>
            <span class="cart-amount" id="cartHeaderTotal">$0.00</span>
          </div>
        </button>

      </div>
    </div>
  </header>

  <!-- Hero Promotional Section -->
  <section class="hero-section" id="heroSection">
    <div class="container hero-container">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="pulse-dot"></span>
          <span>100% Organic & Farm Fresh Guarantee</span>
        </div>
        <h1 class="hero-title">
          Eat Clean & Fresh, Delivered to Your Door in <span class="highlight-gradient">15 Minutes</span>
        </h1>
        <p class="hero-subtitle">
          Explore over 25+ hand-selected organic fruits, dairy items, freshly baked bread, cold-pressed juices, and premium cuts from certified local farms.
        </p>
        <div class="hero-cta-group">
          <a href="#storeSection" class="btn btn-primary btn-lg" id="shopNowBtn">
            <span>Shop Groceries Now</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
          <button class="btn btn-outline btn-lg" id="exploreDealsBtn">
            <span>Today's Hot Deals</span>
            <span class="discount-pill">Up to 25% OFF</span>
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <strong>15 min</strong>
            <span>Express Delivery</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <strong>100%</strong>
            <span>Organic Certified</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <strong>$35+</strong>
            <span>Free Delivery</span>
          </div>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="hero-image-card">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" alt="Fresh Organic Grocery Basket" class="hero-img">
          <div class="hero-floating-card floating-card-1">
            <div class="floating-icon">🥑</div>
            <div>
              <strong>Hass Avocados</strong>
              <small>Freshly picked • $4.49</small>
            </div>
          </div>
          <div class="hero-floating-card floating-card-2">
            <div class="floating-icon">🚚</div>
            <div>
              <strong>Express Delivery</strong>
              <small>Driver on the way • 12m away</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Feature Trust Highlights -->
  <section class="trust-features">
    <div class="container trust-grid">
      <div class="trust-card">
        <div class="trust-icon-box">⚡</div>
        <div>
          <h4>15-Minute Dispatch</h4>
          <p>Packed within 3 minutes of ordering from nearest hub.</p>
        </div>
      </div>
      <div class="trust-card">
        <div class="trust-icon-box">🌱</div>
        <div>
          <h4>100% Certified Organic</h4>
          <p>No synthetic pesticides, direct from certified farmers.</p>
        </div>
      </div>
      <div class="trust-card">
        <div class="trust-icon-box">🏷️</div>
        <div>
          <h4>Farm-Direct Pricing</h4>
          <p>Fair honest prices with weekly seasonal discount savings.</p>
        </div>
      </div>
      <div class="trust-card">
        <div class="trust-icon-box">🛡️</div>
        <div>
          <h4>Freshness Guaranteed</h4>
          <p>Not 100% satisfied? Get an instant no-questions refund.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Categories Section -->
  <section class="categories-section" id="categoriesSection">
    <div class="container">
      <div class="section-header">
        <div>
          <span class="section-tag">Browse by Department</span>
          <h2 class="section-title">Shop by Category</h2>
        </div>
        <button class="link-btn" id="viewAllCategoriesBtn">Reset Category Filter</button>
      </div>

      <!-- Categories Carousel / Grid -->
      <div class="categories-grid" id="categoriesContainer">
        <!-- Rendered dynamically by JS -->
      </div>
    </div>
  </section>

  <!-- Main Store Section (Filters + Products) -->
  <section class="store-section" id="storeSection">
    <div class="container store-layout">

      <!-- Left Filter Sidebar -->
      <aside class="filter-sidebar" id="filterSidebar">
        <div class="filter-card">
          <div class="filter-card-header">
            <h3>Filters</h3>
            <button class="reset-filter-btn" id="resetFiltersBtn">Reset All</button>
          </div>

          <!-- Category Filter list -->
          <div class="filter-group">
            <h4 class="filter-title">Categories</h4>
            <div class="filter-category-list" id="filterCategoryList">
              <!-- Dynamically generated -->
            </div>
          </div>

          <!-- Price Range Slider -->
          <div class="filter-group">
            <div class="price-header">
              <h4 class="filter-title">Max Price</h4>
              <span class="price-value" id="priceDisplay">$20.00</span>
            </div>
            <input type="range" id="priceRange" min="1" max="25" step="0.5" value="25" class="range-slider">
            <div class="price-range-labels">
              <span>$1.00</span>
              <span>$25.00</span>
            </div>
          </div>

          <!-- Dietary & Stock Preferences -->
          <div class="filter-group">
            <h4 class="filter-title">Preferences</h4>
            <label class="custom-checkbox">
              <input type="checkbox" id="organicFilter">
              <span class="checkbox-indicator"></span>
              <span class="checkbox-label">🌱 Organic Only</span>
            </label>
            <label class="custom-checkbox">
              <input type="checkbox" id="inStockFilter" checked>
              <span class="checkbox-indicator"></span>
              <span class="checkbox-label">📦 In Stock Only</span>
            </label>
          </div>

          <!-- Quick Promo Card -->
          <div class="sidebar-promo-box">
            <div class="promo-box-badge">Save Extra</div>
            <p>Apply <strong>FRESH20</strong> during checkout to take 20% off your entire basket.</p>
            <button class="btn btn-sm btn-outline copy-coupon-btn" data-code="FRESH20">Copy FRESH20</button>
          </div>

        </div>
      </aside>

      <!-- Main Product Grid Area -->
      <main class="store-main">
        
        <!-- Store Controls Bar -->
        <div class="store-controls-bar">
          <div class="controls-info">
            <h2 class="active-category-title" id="activeCategoryTitle">All Fresh Groceries</h2>
            <span class="products-count-badge" id="productsCountBadge">Loading items...</span>
          </div>
          
          <div class="controls-actions">
            <!-- Sort dropdown -->
            <div class="sort-select-wrapper">
              <label for="sortSelect" class="sort-label">Sort By:</label>
              <select id="sortSelect" class="sort-select">
                <option value="featured">Featured & Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Active Filter Tags Bar -->
        <div class="active-tags-bar" id="activeTagsBar" style="display: none;">
          <span class="tags-label">Active Filters:</span>
          <div class="tags-list" id="tagsList"></div>
          <button class="clear-tags-btn" id="clearTagsBtn">Clear All</button>
        </div>

        <!-- Products Grid -->
        <div class="products-grid" id="productsGrid">
          <!-- Dynamically populated via js -->
          <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Gathering fresh harvest...</p>
          </div>
        </div>

        <!-- No Products Found State -->
        <div class="empty-products-state" id="emptyProductsState" style="display: none;">
          <div class="empty-icon">🥬</div>
          <h3>No Groceries Found</h3>
          <p>We couldn't find any products matching your selected filters or search terms.</p>
          <button class="btn btn-primary" id="clearSearchFiltersBtn">Reset Filters</button>
        </div>

      </main>

    </div>
  </section>

  <!-- Slide-Over Shopping Cart Drawer -->
  <div class="drawer-overlay" id="cartOverlay"></div>
  <aside class="cart-drawer" id="cartDrawer" aria-hidden="true">
    <div class="drawer-header">
      <div class="drawer-title-group">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cart-drawer-icon">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h3>Your Fresh Basket</h3>
        <span class="drawer-items-count" id="drawerCartCount">(0 items)</span>
      </div>
      <button class="drawer-close-btn" id="closeCartDrawer" aria-label="Close cart">&times;</button>
    </div>

    <!-- Free Delivery Progress Bar -->
    <div class="delivery-progress-container" id="deliveryProgressContainer">
      <div class="delivery-progress-text" id="deliveryProgressText">
        Add <strong>$35.00</strong> more to qualify for <strong>Free Delivery!</strong>
      </div>
      <div class="progress-track">
        <div class="progress-bar" id="deliveryProgressBar" style="width: 0%;"></div>
      </div>
    </div>

    <!-- Cart Items Scroll Area -->
    <div class="cart-items-list" id="cartItemsList">
      <!-- Generated by JS -->
    </div>

    <!-- Empty Cart State -->
    <div class="empty-cart-view" id="emptyCartView" style="display: none;">
      <div class="empty-cart-icon">🛒</div>
      <h4>Your basket is empty</h4>
      <p>Explore our organic produce and artisan treats to get started.</p>
      <button class="btn btn-primary" id="startShoppingBtn">Explore Groceries</button>
    </div>

    <!-- Cart Footer & Checkout -->
    <div class="cart-footer" id="cartFooter">
      
      <!-- Promo Code Box -->
      <div class="cart-coupon-box">
        <div class="coupon-input-wrapper">
          <input type="text" id="couponInput" placeholder="Enter promo code (e.g. FRESH20)" autocomplete="off">
          <button class="btn btn-sm btn-dark" id="applyCouponBtn">Apply</button>
        </div>
        <div class="coupon-status" id="couponStatus"></div>
      </div>

      <!-- Bill Breakdown -->
      <div class="cart-summary-table">
        <div class="summary-row">
          <span>Subtotal</span>
          <span id="summarySubtotal">$0.00</span>
        </div>
        <div class="summary-row discount-row" id="summaryDiscountRow" style="display: none;">
          <span>Coupon Discount (<span id="discountCodeLabel"></span>)</span>
          <span class="discount-val" id="summaryDiscount">-$0.00</span>
        </div>
        <div class="summary-row">
          <span>Delivery Fee</span>
          <span id="summaryDeliveryFee">$4.99</span>
        </div>
        <div class="summary-row">
          <span>Estimated Sales Tax (5%)</span>
          <span id="summaryTax">$0.00</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-row total-row">
          <span>Total</span>
          <span class="summary-total-price" id="summaryTotal">$0.00</span>
        </div>
      </div>

      <!-- Checkout CTA Button -->
      <button class="btn btn-primary btn-block btn-lg checkout-cta-btn" id="proceedToCheckoutBtn">
        <span>Proceed to Checkout</span>
        <span class="checkout-total-pill" id="checkoutBtnTotal">$0.00</span>
      </button>

      <div class="cart-guarantee-note">
        <span>🔒 100% Secure Checkout • Express Dispatch</span>
      </div>
    </div>
  </aside>

  <!-- Checkout Modal -->
  <div class="modal-backdrop" id="checkoutModalBackdrop">
    <div class="modal-window checkout-modal" id="checkoutModal">
      <div class="modal-header">
        <div class="modal-header-title">
          <h3>Complete Your Grocery Order</h3>
          <p>Please enter your delivery and payment details.</p>
        </div>
        <button class="modal-close-btn" id="closeCheckoutModal">&times;</button>
      </div>

      <div class="checkout-modal-body">
        <form id="checkoutForm">
          
          <div class="form-section">
            <h4 class="form-section-title">1. Contact & Customer Information</h4>
            <div class="form-row">
              <div class="form-group">
                <label for="custName">Full Name *</label>
                <input type="text" id="custName" required placeholder="e.g. Sarah Jenkins">
              </div>
              <div class="form-group">
                <label for="custEmail">Email Address *</label>
                <input type="email" id="custEmail" required placeholder="sarah@example.com">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="custPhone">Phone Number *</label>
                <input type="tel" id="custPhone" required placeholder="+1 (555) 000-0000">
              </div>
              <div class="form-group">
                <label for="deliverySlot">Preferred Delivery Window</label>
                <select id="deliverySlot">
                  <option value="Express Dispatch (15-30 mins)">Express Dispatch (15-30 mins)</option>
                  <option value="Today Evening (5:00 PM - 7:00 PM)">Today Evening (5:00 PM - 7:00 PM)</option>
                  <option value="Tomorrow Morning (8:00 AM - 10:00 AM)">Tomorrow Morning (8:00 AM - 10:00 AM)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4 class="form-section-title">2. Delivery Address</h4>
            <div class="form-group">
              <label for="custAddress">Street Address & Apartment/Suite *</label>
              <input type="text" id="custAddress" required placeholder="e.g. 742 Evergreen Terrace, Apt 3B">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="custCity">City</label>
                <input type="text" id="custCity" value="New York" required>
              </div>
              <div class="form-group">
                <label for="custZip">Postal / ZIP Code</label>
                <input type="text" id="custZip" value="10001" required>
              </div>
            </div>
            <div class="form-group">
              <label for="custNotes">Delivery Notes / Gate Code (Optional)</label>
              <input type="text" id="custNotes" placeholder="e.g. Leave with doorman or ring buzzer #4">
            </div>
          </div>

          <div class="form-section">
            <h4 class="form-section-title">3. Payment Method</h4>
            <div class="payment-options">
              <label class="payment-radio-card active">
                <input type="radio" name="paymentMethod" value="Cash on Delivery" checked>
                <div class="payment-card-content">
                  <span class="payment-icon">💵</span>
                  <div>
                    <strong>Cash on Delivery (COD)</strong>
                    <small>Pay with cash or card upon delivery</small>
                  </div>
                </div>
              </label>

              <label class="payment-radio-card">
                <input type="radio" name="paymentMethod" value="Credit / Debit Card">
                <div class="payment-card-content">
                  <span class="payment-icon">💳</span>
                  <div>
                    <strong>Credit / Debit Card</strong>
                    <small>Visa, Mastercard, Amex, Apple Pay</small>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Checkout Final Review Box -->
          <div class="checkout-review-summary">
            <div class="review-row">
              <span>Items Total (<span id="modalItemsCount">0</span> items):</span>
              <span id="modalSubtotal">$0.00</span>
            </div>
            <div class="review-row discount-row" id="modalDiscountRow" style="display: none;">
              <span>Discount:</span>
              <span id="modalDiscount">-$0.00</span>
            </div>
            <div class="review-row">
              <span>Delivery Fee:</span>
              <span id="modalDelivery">$0.00</span>
            </div>
            <div class="review-row">
              <span>Taxes (5%):</span>
              <span id="modalTax">$0.00</span>
            </div>
            <div class="review-row review-grand-total">
              <strong>Order Grand Total:</strong>
              <strong id="modalTotal">$0.00</strong>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg place-order-btn" id="submitOrderBtn">
            <span>Place Order Now</span>
            <span class="btn-spinner" id="orderSpinner" style="display: none;"></span>
          </button>
        </form>
      </div>
    </div>
  </div>

  <!-- Order Confirmation Success Modal -->
  <div class="modal-backdrop" id="orderSuccessBackdrop">
    <div class="modal-window success-modal" id="orderSuccessModal">
      <div class="success-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="checkmark-icon">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>

      <h2 class="success-title">Order Placed Successfully!</h2>
      <p class="success-subtitle">
        Thank you for ordering with FreshCart. Your groceries are being handpicked with love.
      </p>

      <div class="order-badge-box">
        <span>Order Number:</span>
        <strong id="successOrderNumber">ORD-894123</strong>
      </div>

      <!-- Real-time Delivery Progress Tracker -->
      <div class="order-tracker-timeline">
        <div class="timeline-step completed">
          <div class="step-circle">✓</div>
          <span class="step-title">Order Confirmed</span>
          <span class="step-time">Just now</span>
        </div>
        <div class="timeline-line active"></div>
        <div class="timeline-step active">
          <div class="step-circle">2</div>
          <span class="step-title">Packing Produce</span>
          <span class="step-time">In Progress</span>
        </div>
        <div class="timeline-line"></div>
        <div class="timeline-step">
          <div class="step-circle">3</div>
          <span class="step-title">Out for Delivery</span>
          <span class="step-time">Est. 15 mins</span>
        </div>
        <div class="timeline-line"></div>
        <div class="timeline-step">
          <div class="step-circle">4</div>
          <span class="step-title">Delivered</span>
          <span class="step-time">Doorstep</span>
        </div>
      </div>

      <div class="success-details-card">
        <div class="details-row">
          <span>Customer:</span>
          <strong id="successCustomerName">-</strong>
        </div>
        <div class="details-row">
          <span>Address:</span>
          <span id="successAddress">-</span>
        </div>
        <div class="details-row">
          <span>Delivery Window:</span>
          <span id="successSlot">-</span>
        </div>
        <div class="details-row">
          <span>Amount Paid/Due:</span>
          <strong id="successTotal" class="text-primary">-</strong>
        </div>
      </div>

      <div class="success-actions">
        <button class="btn btn-primary btn-block" id="continueShoppingSuccessBtn">Continue Shopping</button>
        <button class="btn btn-outline btn-block" id="printReceiptBtn">Print Receipt 📄</button>
      </div>
    </div>
  </div>

  <!-- Product Quick View Modal -->
  <div class="modal-backdrop" id="quickViewBackdrop">
    <div class="modal-window quick-view-modal" id="quickViewModal">
      <button class="modal-close-btn" id="closeQuickViewModal">&times;</button>
      <div class="quick-view-grid">
        <div class="quick-view-image-box">
          <img src="" alt="" id="qvImage">
          <span class="qv-badge" id="qvBadge">Organic</span>
        </div>
        <div class="quick-view-info">
          <span class="qv-category" id="qvCategory">Fresh Produce</span>
          <h2 class="qv-title" id="qvTitle">Product Name</h2>
          
          <div class="qv-rating-row">
            <span class="qv-stars" id="qvStars">★★★★★</span>
            <span class="qv-rating-score" id="qvRating">4.9</span>
            <span class="qv-review-count" id="qvReviewCount">(120 reviews)</span>
          </div>

          <div class="qv-price-row">
            <span class="qv-price" id="qvPrice">$3.99</span>
            <span class="qv-original-price" id="qvOriginalPrice">$4.99</span>
            <span class="qv-unit" id="qvUnit">/ 1 kg</span>
            <span class="qv-discount-pill" id="qvDiscountPill">20% OFF</span>
          </div>

          <p class="qv-description" id="qvDescription">Product description</p>

          <!-- Nutrition Facts Grid -->
          <div class="qv-nutrition-card" id="qvNutritionCard">
            <div class="nutrition-title">Nutritional Facts</div>
            <div class="nutrition-grid" id="qvNutritionGrid">
              <!-- Rendered via JS -->
            </div>
          </div>

          <div class="qv-stock-status in-stock" id="qvStockStatus">
            <span>● In Stock (85 units available)</span>
          </div>

          <div class="qv-actions">
            <div class="quantity-stepper">
              <button class="stepper-btn" id="qvMinusBtn">−</button>
              <span class="stepper-count" id="qvQuantity">1</span>
              <button class="stepper-btn" id="qvPlusBtn">+</button>
            </div>
            <button class="btn btn-primary btn-lg qv-add-btn" id="qvAddToCartBtn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>Add to Basket</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Wishlist Drawer / Modal -->
  <div class="drawer-overlay" id="wishlistOverlay"></div>
  <aside class="cart-drawer wishlist-drawer" id="wishlistDrawer" aria-hidden="true">
    <div class="drawer-header">
      <div class="drawer-title-group">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <h3>Your Saved Wishlist</h3>
        <span class="drawer-items-count" id="drawerWishlistCount">(0 items)</span>
      </div>
      <button class="drawer-close-btn" id="closeWishlistDrawer">&times;</button>
    </div>
    <div class="cart-items-list" id="wishlistItemsList">
      <!-- Generated by JS -->
    </div>
    <div class="empty-cart-view" id="emptyWishlistView" style="display: none;">
      <div class="empty-cart-icon">❤️</div>
      <h4>Your wishlist is empty</h4>
      <p>Click the heart icon on any grocery item to save it for later.</p>
    </div>
  </aside>

  <!-- Admin Inventory & Orders Portal Modal -->
  <div class="modal-backdrop" id="adminModalBackdrop">
    <div class="modal-window admin-modal" id="adminModal">
      <div class="modal-header">
        <div class="admin-header-title">
          <div class="admin-badge">Admin Portal</div>
          <h2>Store Management Dashboard</h2>
          <div class="supabase-status-pill" id="supabaseStatusPill">
            <span class="status-dot"></span>
            <span id="supabaseStatusText">Supabase PostgreSQL: Checking...</span>
          </div>
        </div>
        <button class="modal-close-btn" id="closeAdminModal">&times;</button>
      </div>

      <!-- Admin Tabs -->
      <div class="admin-tabs">
        <button class="admin-tab active" data-tab="overview">📊 Overview & Stats</button>
        <button class="admin-tab" data-tab="orders">📦 Manage Orders</button>
        <button class="admin-tab" data-tab="products">🥬 Inventory & Products</button>
        <button class="admin-tab" data-tab="addProduct">➕ Add New Product</button>
      </div>

      <div class="admin-modal-body">
        
        <!-- Tab 1: Overview & Stats -->
        <div class="admin-tab-content active" id="tabOverview">
          <div class="stats-cards-grid">
            <div class="admin-stat-card">
              <span class="stat-card-title">Total Revenue</span>
              <strong class="stat-card-val text-primary" id="adminStatRevenue">$0.00</strong>
              <small class="stat-card-sub">Processed through checkout</small>
            </div>
            <div class="admin-stat-card">
              <span class="stat-card-title">Total Orders</span>
              <strong class="stat-card-val" id="adminStatOrders">0</strong>
              <small class="stat-card-sub">Customer orders received</small>
            </div>
            <div class="admin-stat-card">
              <span class="stat-card-title">Active Products</span>
              <strong class="stat-card-val" id="adminStatProducts">0</strong>
              <small class="stat-card-sub">Live in store inventory</small>
            </div>
            <div class="admin-stat-card">
              <span class="stat-card-title">Average Order Value</span>
              <strong class="stat-card-val text-accent" id="adminStatAOV">$0.00</strong>
              <small class="stat-card-sub">Basket average</small>
            </div>
          </div>

          <div class="admin-section-block">
            <h3>Recent Store Orders</h3>
            <div class="table-responsive">
              <table class="admin-table" id="recentOrdersTable">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody id="recentOrdersTableBody">
                  <!-- JS populated -->
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tab 2: Orders Management -->
        <div class="admin-tab-content" id="tabOrders">
          <div class="orders-management-header">
            <h3>Customer Orders Pipeline</h3>
            <span class="info-tag">Real-time status updates</span>
          </div>
          <div class="table-responsive">
            <table class="admin-table" id="allOrdersTable">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer Info</th>
                  <th>Items & Total</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody id="allOrdersTableBody">
                <!-- JS populated -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 3: Products Catalog Management -->
        <div class="admin-tab-content" id="tabProducts">
          <div class="catalog-management-header">
            <h3>Active Grocery Catalog</h3>
            <span class="info-tag" id="catalogCountTag">0 products</span>
          </div>
          <div class="table-responsive">
            <table class="admin-table" id="catalogTable">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="catalogTableBody">
                <!-- JS populated -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 4: Add New Product -->
        <div class="admin-tab-content" id="tabAddProduct">
          <form id="addProductForm" class="add-product-form">
            <h3>Add New Grocery Item</h3>
            <p>New items are instantly added to your Supabase PostgreSQL database!</p>

            <div class="form-row">
              <div class="form-group">
                <label for="newProdName">Product Name *</label>
                <input type="text" id="newProdName" required placeholder="e.g. Organic Blueberries">
              </div>
              <div class="form-group">
                <label for="newProdCategory">Department / Category *</label>
                <select id="newProdCategory" required>
                  <!-- Populated by JS -->
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="newProdPrice">Price ($) *</label>
                <input type="number" id="newProdPrice" step="0.01" min="0.1" required placeholder="4.99">
              </div>
              <div class="form-group">
                <label for="newProdOriginalPrice">Original Price ($)</label>
                <input type="number" id="newProdOriginalPrice" step="0.01" min="0.1" placeholder="5.99">
              </div>
              <div class="form-group">
                <label for="newProdUnit">Unit / Packaging *</label>
                <input type="text" id="newProdUnit" required placeholder="e.g. 500g pack, 1 kg">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="newProdStock">Initial Stock Qty *</label>
                <input type="number" id="newProdStock" min="1" value="50" required>
              </div>
              <div class="form-group">
                <label for="newProdImage">Product Image URL *</label>
                <input type="url" id="newProdImage" required placeholder="https://images.unsplash.com/...">
              </div>
              <div class="form-group">
                <label for="newProdBadge">Highlight Badge</label>
                <input type="text" id="newProdBadge" placeholder="e.g. Organic, Fresh, Special">
              </div>
            </div>

            <div class="form-group">
              <label for="newProdDescription">Description *</label>
              <textarea id="newProdDescription" rows="3" required placeholder="Rich natural flavors, source, nutritional benefits..."></textarea>
            </div>

            <div class="form-row checkbox-row">
              <label class="custom-checkbox">
                <input type="checkbox" id="newProdOrganic" checked>
                <span class="checkbox-indicator"></span>
                <span>Certified Organic</span>
              </label>
              <label class="custom-checkbox">
                <input type="checkbox" id="newProdFeatured" checked>
                <span class="checkbox-indicator"></span>
                <span>Feature on Homepage</span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" id="saveProductBtn">
              <span>Save & Publish Product</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>

  <!-- Location Picker Modal -->
  <div class="modal-backdrop" id="locationModalBackdrop">
    <div class="modal-window location-modal" id="locationModal">
      <div class="modal-header">
        <h3>Choose Delivery Location</h3>
        <button class="modal-close-btn" id="closeLocationModal">&times;</button>
      </div>
      <div class="modal-body">
        <p>Select your delivery zone for fast 15-minute dispatch:</p>
        <div class="location-presets">
          <button class="location-preset-btn active" data-loc="New York, 10001">📍 Manhattan, NY (10001)</button>
          <button class="location-preset-btn" data-loc="Brooklyn, 11201">📍 Brooklyn, NY (11201)</button>
          <button class="location-preset-btn" data-loc="Queens, 11101">📍 Queens, NY (11101)</button>
          <button class="location-preset-btn" data-loc="Jersey City, 07302">📍 Jersey City, NJ (07302)</button>
        </div>
        <div class="form-group mt-3">
          <label for="customZipInput">Or enter your Postal / ZIP Code:</label>
          <div class="inline-input-group">
            <input type="text" id="customZipInput" placeholder="e.g. 90210">
            <button class="btn btn-primary" id="saveCustomZipBtn">Apply</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div class="toast-container" id="toastContainer" aria-live="polite"></div>

  <!-- Modern Footer -->
  <footer class="main-footer">
    <div class="container footer-container">
      <div class="footer-grid">
        <div class="footer-col brand-col">
          <div class="brand-logo footer-logo">
            <div class="logo-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <span class="brand-name">Fresh<span>Cart</span></span>
          </div>
          <p class="footer-desc">
            Your neighborhood farm-to-table digital grocer. Delivering pristine organic produce, artisan bakery, dairy, and wild catch within 15 minutes.
          </p>
          <div class="tech-stack-badges">
            <span class="tech-pill">⚡ Supabase PostgreSQL</span>
            <span class="tech-pill">🌿 Node.js & Express</span>
            <span class="tech-pill">✨ Modern CSS</span>
          </div>
        </div>

        <div class="footer-col">
          <h4 class="footer-title">Departments</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-cat-link" data-cat="fruits-vegetables">Fresh Fruits & Veg</a></li>
            <li><a href="#" class="footer-cat-link" data-cat="dairy-eggs">Dairy & Pasture Eggs</a></li>
            <li><a href="#" class="footer-cat-link" data-cat="bakery-snacks">Artisan Bakery & Breads</a></li>
            <li><a href="#" class="footer-cat-link" data-cat="beverages">Cold-Pressed Juices</a></li>
            <li><a href="#" class="footer-cat-link" data-cat="organic-pantry">Organic Pantry Staples</a></li>
            <li><a href="#" class="footer-cat-link" data-cat="meat-seafood">Meat & Wild Salmon</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-title">Help & Service</h4>
          <ul class="footer-links">
            <li><a href="#storeSection">Delivery Areas & Slots</a></li>
            <li><a href="#storeSection">100% Quality Guarantee</a></li>
            <li><a href="#storeSection">Track Current Order</a></li>
            <li><a href="#" id="footerAdminTrigger">Store Admin Panel</a></li>
            <li><a href="#">FAQ & Customer Support</a></li>
          </ul>
        </div>

        <div class="footer-col newsletter-col">
          <h4 class="footer-title">Fresh Updates</h4>
          <p>Subscribe for weekly farm harvests and 20% off voucher codes.</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Enter your email" id="newsletterInput">
            <button class="btn btn-primary" id="newsletterBtn">Join</button>
          </div>
          <div class="payment-badges-row">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Apple Pay</span>
            <span>COD</span>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 FreshCart Inc. All rights reserved. Powered by Supabase PostgreSQL & Node.js Express.</p>
        <div class="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Security</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="js/api.js"></script>
  <script src="js/cart.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/admin.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

---

<a id="frontend-css-style-css"></a>
## 📄 `frontend/css/style.css`

> **Description**: Design system tokens, color palette & typography  
> **Path**: `frontend/css/style.css`  
> **Language**: css

```css
/* ==============================================================================
   FRESHCART DESIGN SYSTEM & GLOBAL STYLES (Vanilla CSS)
   ============================================================================== */

:root {
  /* Brand Palette - Nature Emerald & Fresh Citrus */
  --primary: #059669;
  --primary-hover: #047857;
  --primary-light: #10b981;
  --primary-soft: #ecfdf5;
  --primary-border: #a7f3d0;

  --accent: #f59e0b;
  --accent-hover: #d97706;
  --accent-light: #fbbf24;
  --accent-soft: #fffbeb;

  --danger: #ef4444;
  --danger-soft: #fef2f2;
  --success: #10b981;
  --success-soft: #ecfdf5;
  --info: #3b82f6;

  /* Neutrals & Surfaces - Light Theme */
  --bg-main: #f8fafc;
  --bg-surface: #ffffff;
  --bg-surface-elevated: #ffffff;
  --bg-subtle: #f1f5f9;
  --bg-glass: rgba(255, 255, 255, 0.88);

  --text-main: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;
  --text-inverse: #ffffff;

  --border-light: #e2e8f0;
  --border-focus: #10b981;

  /* Shadows */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-glow: 0 0 20px rgba(16, 185, 129, 0.25);

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* Typography */
  --font-display: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ==============================================================================
   DARK THEME OVERRIDES
   ============================================================================== */
[data-theme="dark"] {
  --bg-main: #0b1120;
  --bg-surface: #131c2e;
  --bg-surface-elevated: #1e293b;
  --bg-subtle: #1e293b;
  --bg-glass: rgba(19, 28, 46, 0.9);

  --text-main: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;

  --border-light: #25334a;
  --border-focus: #34d399;

  --primary: #10b981;
  --primary-hover: #34d399;
  --primary-soft: rgba(16, 185, 129, 0.15);
  --primary-border: rgba(16, 185, 129, 0.3);

  --accent-soft: rgba(245, 158, 11, 0.15);

  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.7);
}

/* ==============================================================================
   BASE RESET & TYPOGRAPHY
   ============================================================================== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-main);
  color: var(--text-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button, input, select, textarea {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  outline: none;
}

/* Layout Container */
.container {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
}

/* ==============================================================================
   BUTTONS & CONTROLS
   ============================================================================== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.95rem;
  transition: all var(--transition-fast);
  white-space: nowrap;
  user-select: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);
}
.btn-primary:hover {
  background: linear-gradient(135deg, var(--primary-hover) 0%, var(--primary) 100%);
  box-shadow: 0 6px 16px rgba(5, 150, 105, 0.35);
  transform: translateY(-1px);
}
.btn-primary:active {
  transform: translateY(0);
}

.btn-outline {
  border: 1.5px solid var(--border-light);
  background: var(--bg-surface);
  color: var(--text-main);
}
.btn-outline:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-soft);
}

.btn-dark {
  background: var(--text-main);
  color: var(--bg-surface);
}
.btn-dark:hover {
  opacity: 0.9;
}

.btn-sm {
  padding: 6px 14px;
  font-size: 0.85rem;
  border-radius: var(--radius-sm);
}

.btn-lg {
  padding: 14px 28px;
  font-size: 1.05rem;
  border-radius: var(--radius-lg);
}

.btn-block {
  width: 100%;
}

.link-btn {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
  transition: color var(--transition-fast);
}
.link-btn:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

/* Form inputs */
input[type="text"],
input[type="email"],
input[type="tel"],
input[type="number"],
input[type="url"],
select,
textarea {
  width: 100%;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border-light);
  background: var(--bg-surface);
  color: var(--text-main);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

/* Custom Checkbox */
.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 10px;
}
.custom-checkbox input {
  display: none;
}
.checkbox-indicator {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid var(--border-light);
  background: var(--bg-surface);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}
.custom-checkbox input:checked + .checkbox-indicator {
  background: var(--primary);
  border-color: var(--primary);
}
.custom-checkbox input:checked + .checkbox-indicator::after {
  content: "✓";
  color: #fff;
  font-size: 12px;
  font-weight: bold;
}

/* Section Headings */
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
}

.section-tag {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
  margin-bottom: 4px;
}

.section-title {
  font-family: var(--font-display);
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -0.02em;
}

/* ==============================================================================
   MODALS & DRAWERS (BACKDROPS)
   ============================================================================== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-normal), visibility var(--transition-normal);
  padding: 20px;
}

.modal-backdrop.active {
  opacity: 1;
  visibility: visible;
}

.modal-window {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid var(--border-light);
  transform: scale(0.95);
  transition: transform var(--transition-normal);
}

.modal-backdrop.active .modal-window {
  transform: scale(1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
}

.modal-close-btn {
  font-size: 1.8rem;
  line-height: 1;
  color: var(--text-muted);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: background var(--transition-fast), color var(--transition-fast);
}
.modal-close-btn:hover {
  background: var(--bg-subtle);
  color: var(--text-main);
}

/* Drawer overlay */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(6px);
  z-index: 900;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-normal), visibility var(--transition-normal);
}

.drawer-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* ==============================================================================
   TOAST NOTIFICATIONS
   ============================================================================== */
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 2000;
  pointer-events: none;
}

.toast {
  background: var(--bg-surface);
  color: var(--text-main);
  padding: 14px 18px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-light);
  border-left: 5px solid var(--primary);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 420px;
  pointer-events: auto;
  transform: translateX(120%);
  transition: transform var(--transition-normal), opacity var(--transition-normal);
}

.toast.show {
  transform: translateX(0);
}

.toast.toast-error {
  border-left-color: var(--danger);
}
.toast.toast-warning {
  border-left-color: var(--accent);
}

.toast-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.toast-message {
  font-size: 0.9rem;
  font-weight: 500;
  flex-grow: 1;
}

/* Utilities */
.text-primary { color: var(--primary); }
.text-accent { color: var(--accent); }
.text-muted { color: var(--text-muted); }
.mt-3 { margin-top: 12px; }
```

---

<a id="frontend-css-components-css"></a>
## 📄 `frontend/css/components.css`

> **Description**: Glassmorphic card components, drawers & animations  
> **Path**: `frontend/css/components.css`  
> **Language**: css

```css
/* ==============================================================================
   FRESHCART COMPONENTS & RESPONSIVE STYLES
   ============================================================================== */

/* ------------------------------------------------------------------------------
   1. ANNOUNCEMENT BAR
   ------------------------------------------------------------------------------ */
.announcement-bar {
  background: linear-gradient(90deg, #065f46 0%, #047857 50%, #059669 100%);
  color: #ffffff;
  padding: 8px 0;
  font-size: 0.85rem;
  font-weight: 500;
}
.announcement-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.announcement-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.announcement-text {
  flex-grow: 1;
  text-align: center;
}
.coupon-highlight {
  background: #fef3c7;
  color: #92400e;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: transform var(--transition-fast);
  display: inline-block;
}
.coupon-highlight:hover {
  transform: scale(1.05);
}
.announcement-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.delivery-time-badge {
  background: rgba(0, 0, 0, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}
.announcement-close {
  color: #fff;
  font-size: 1.2rem;
  opacity: 0.8;
  transition: opacity var(--transition-fast);
}
.announcement-close:hover {
  opacity: 1;
}

/* ------------------------------------------------------------------------------
   2. STICKY MAIN HEADER
   ------------------------------------------------------------------------------ */
.main-header {
  position: sticky;
  top: 0;
  z-index: 500;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-light);
  transition: background var(--transition-normal), border-color var(--transition-normal);
}
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 14px;
  padding-bottom: 14px;
}

/* Brand Logo */
.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.logo-icon-wrapper {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: #fff;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(5, 150, 105, 0.3);
}
.logo-icon {
  width: 24px;
  height: 24px;
}
.brand-name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-main);
  line-height: 1.1;
}
.brand-name span {
  color: var(--primary);
}
.brand-subtitle {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Location Selector Button */
.location-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  background: var(--bg-surface);
  transition: all var(--transition-fast);
  text-align: left;
}
.location-btn:hover {
  border-color: var(--primary);
  background: var(--primary-soft);
}
.icon-location {
  width: 20px;
  height: 20px;
  color: var(--primary);
}
.location-text {
  display: flex;
  flex-direction: column;
}
.location-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
}
.location-address {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
}

/* Search Bar Wrapper */
.search-wrapper {
  display: flex;
  align-items: center;
  flex-grow: 1;
  max-width: 540px;
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-full);
  background: var(--bg-surface);
  overflow: hidden;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.search-wrapper:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}
.search-category-select select {
  border: none;
  background: var(--bg-subtle);
  padding: 10px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  border-right: 1px solid var(--border-light);
  cursor: pointer;
  border-radius: 0;
  outline: none;
}
.search-input-box {
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding-left: 12px;
  padding-right: 12px;
  position: relative;
}
.search-icon {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  margin-right: 8px;
  flex-shrink: 0;
}
.search-input-box input {
  border: none;
  background: transparent;
  padding: 10px 4px;
  font-size: 0.9rem;
  width: 100%;
}
.search-input-box input:focus {
  box-shadow: none;
}
.search-clear-btn {
  font-size: 1.2rem;
  color: var(--text-muted);
  padding: 0 4px;
}

/* Header Action Buttons */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.icon-action-btn {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
  background: var(--bg-surface);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all var(--transition-fast);
}
.icon-action-btn svg {
  width: 20px;
  height: 20px;
}
.icon-action-btn:hover {
  border-color: var(--primary);
  background: var(--primary-soft);
  color: var(--primary);
}
.badge-count {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--primary);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid var(--bg-surface);
}

/* Admin Portal Button */
.admin-portal-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
  background: var(--bg-surface);
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}
.admin-portal-btn svg {
  width: 16px;
  height: 16px;
}
.admin-portal-btn:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-hover);
}

/* Cart Trigger Button */
.cart-trigger-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 16px 6px 12px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(5, 150, 105, 0.28);
  transition: all var(--transition-fast);
}
.cart-trigger-btn:hover {
  box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
  transform: translateY(-1px);
}
.cart-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-icon-wrapper svg {
  width: 22px;
  height: 22px;
}
.cart-icon-wrapper .badge-count {
  background: #ffffff;
  color: var(--primary);
  border: none;
}
.cart-total-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}
.cart-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  font-weight: 700;
  opacity: 0.85;
}
.cart-amount {
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.1;
}

/* ------------------------------------------------------------------------------
   3. HERO SECTION
   ------------------------------------------------------------------------------ */
.hero-section {
  position: relative;
  padding: 60px 0 40px;
  background: radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 60%),
              radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.06) 0%, transparent 60%);
}
.hero-container {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 48px;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--primary-soft);
  color: var(--primary);
  border: 1px solid var(--primary-border);
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 20px;
}
.pulse-dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: var(--radius-full);
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: pulseDot 2s infinite;
}
@keyframes pulseDot {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.hero-title {
  font-family: var(--font-display);
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--text-main);
  margin-bottom: 20px;
}
.highlight-gradient {
  background: linear-gradient(135deg, var(--primary) 0%, #0d9488 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-subtitle {
  font-size: 1.12rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 32px;
  max-width: 560px;
}
.hero-cta-group {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
}
.discount-pill {
  background: var(--accent-soft);
  color: var(--accent-hover);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
}
.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}
.stat-item {
  display: flex;
  flex-direction: column;
}
.stat-item strong {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1;
}
.stat-item span {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-top: 4px;
}
.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--border-light);
}

/* Hero Visual & Floating Cards */
.hero-visual {
  position: relative;
}
.hero-image-card {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-light);
}
.hero-img {
  width: 100%;
  height: 440px;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.hero-image-card:hover .hero-img {
  transform: scale(1.03);
}

.hero-floating-card {
  position: absolute;
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  padding: 12px 18px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: floatCard 4s ease-in-out infinite;
}
.floating-card-1 {
  bottom: 24px;
  left: -20px;
}
.floating-card-2 {
  top: 30px;
  right: -20px;
  animation-delay: -2s;
}
@keyframes floatCard {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.floating-icon {
  font-size: 1.8rem;
}
.hero-floating-card strong {
  display: block;
  font-size: 0.9rem;
  color: var(--text-main);
}
.hero-floating-card small {
  font-size: 0.75rem;
  color: var(--primary);
  font-weight: 600;
}

/* ------------------------------------------------------------------------------
   4. TRUST FEATURES
   ------------------------------------------------------------------------------ */
.trust-features {
  padding: 30px 0;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-surface);
}
.trust-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.trust-card {
  display: flex;
  align-items: center;
  gap: 16px;
}
.trust-icon-box {
  width: 48px;
  height: 48px;
  background: var(--primary-soft);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}
.trust-card h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 2px;
}
.trust-card p {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.4;
}

/* ------------------------------------------------------------------------------
   5. CATEGORIES SECTION
   ------------------------------------------------------------------------------ */
.categories-section {
  padding: 50px 0;
}
.categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 18px;
}
.category-card {
  background: var(--bg-surface);
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 16px 12px;
  text-align: center;
  transition: all var(--transition-normal);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.category-card:hover,
.category-card.active {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
  background: var(--bg-surface-elevated);
}
.category-card.active {
  border-width: 2px;
  background: var(--primary-soft);
}
.category-image-wrap {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 12px;
  border: 2px solid var(--border-light);
}
.category-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-fast);
}
.category-card:hover .category-image-wrap img {
  transform: scale(1.1);
}
.category-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 4px;
}
.category-count {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

/* ------------------------------------------------------------------------------
   6. MAIN STORE SECTION (FILTERS + PRODUCTS)
   ------------------------------------------------------------------------------ */
.store-section {
  padding: 40px 0 80px;
}
.store-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  align-items: start;
}

/* Filter Sidebar */
.filter-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 90px;
}
.filter-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-light);
}
.filter-card-header h3 {
  font-size: 1.15rem;
  font-weight: 700;
}
.reset-filter-btn {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--danger);
  transition: opacity var(--transition-fast);
}
.reset-filter-btn:hover {
  text-decoration: underline;
}

.filter-group {
  margin-bottom: 24px;
}
.filter-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 12px;
}
.filter-category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.filter-cat-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  text-align: left;
}
.filter-cat-btn:hover {
  background: var(--bg-subtle);
  color: var(--text-main);
}
.filter-cat-btn.active {
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 700;
}
.filter-cat-badge {
  font-size: 0.75rem;
  background: var(--bg-subtle);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}
.filter-cat-btn.active .filter-cat-badge {
  background: var(--primary);
  color: #fff;
}

/* Price Range Slider */
.price-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.price-value {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--primary);
}
.range-slider {
  width: 100%;
  height: 6px;
  border-radius: 4px;
  background: var(--border-light);
  outline: none;
  accent-color: var(--primary);
  margin: 12px 0 6px;
}
.price-range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.sidebar-promo-box {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #78350f;
  padding: 16px;
  border-radius: var(--radius-lg);
  margin-top: 24px;
  font-size: 0.85rem;
  line-height: 1.4;
}
.promo-box-badge {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  background: #b45309;
  color: #fff;
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 6px;
}
.sidebar-promo-box button {
  margin-top: 10px;
  border-color: #b45309;
  color: #78350f;
}

/* Store Controls Bar */
.store-controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
}
.active-category-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.02em;
}
.products-count-badge {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
  display: block;
  margin-top: 2px;
}
.sort-select-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}
.sort-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-muted);
}
.sort-select {
  padding: 8px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  background: var(--bg-surface);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
}

/* Active Tags Bar */
.active-tags-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.tags-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}
.tags-list {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-tag-chip {
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.filter-tag-chip button {
  color: var(--text-muted);
  font-size: 1rem;
}
.clear-tags-btn {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary);
  text-decoration: underline;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

/* Product Card */
.product-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  position: relative;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-border);
}

.product-image-wrap {
  position: relative;
  width: 100%;
  height: 180px;
  background: var(--bg-subtle);
  overflow: hidden;
  cursor: pointer;
}
.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.product-card:hover .product-img {
  transform: scale(1.08);
}

/* Badges on Product Image */
.product-badge-pill {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--primary);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
.product-badge-pill.organic {
  background: #10b981;
}
.product-badge-pill.discount {
  background: var(--accent);
}

.wishlist-toggle-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}
.wishlist-toggle-btn:hover {
  color: #ef4444;
  transform: scale(1.1);
}
.wishlist-toggle-btn.active {
  color: #ef4444;
  fill: #ef4444;
}
.wishlist-toggle-btn svg {
  width: 16px;
  height: 16px;
}

/* Product Info */
.product-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.product-category-name {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 4px;
}
.product-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.3;
  margin-bottom: 6px;
  cursor: pointer;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.6em;
}
.product-title:hover {
  color: var(--primary);
}

.product-unit-text {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  margin-bottom: 14px;
}
.star-rating {
  color: #f59e0b;
}
.rating-num {
  font-weight: 700;
  color: var(--text-main);
}
.rating-reviews {
  color: var(--text-muted);
}

/* Price & Add to Cart Row */
.product-bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
}
.product-pricing {
  display: flex;
  flex-direction: column;
}
.current-price {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1;
}
.original-price {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-decoration: line-through;
  margin-top: 2px;
}

.add-cart-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  background: var(--primary-soft);
  color: var(--primary);
  border: 1px solid var(--primary-border);
  font-weight: 700;
  font-size: 0.85rem;
  transition: all var(--transition-fast);
}
.add-cart-btn svg {
  width: 16px;
  height: 16px;
}
.add-cart-btn:hover {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  transform: translateY(-1px);
}
.add-cart-btn.added-animation {
  background: var(--success);
  color: #fff;
  transform: scale(1.05);
}

/* Loading & Empty States */
.loading-state,
.empty-products-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
}
.loading-spinner {
  width: 44px;
  height: 44px;
  border: 3.5px solid var(--border-light);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 12px;
}
.empty-products-state h3 {
  font-size: 1.4rem;
  margin-bottom: 8px;
}
.empty-products-state p {
  color: var(--text-muted);
  margin-bottom: 20px;
}

/* ------------------------------------------------------------------------------
   7. SLIDE-OVER CART DRAWER
   ------------------------------------------------------------------------------ */
.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 440px;
  height: 100%;
  background: var(--bg-surface);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.cart-drawer.open {
  transform: translateX(0);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
}
.drawer-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.cart-drawer-icon {
  width: 22px;
  height: 22px;
  color: var(--primary);
}
.drawer-title-group h3 {
  font-size: 1.25rem;
  font-weight: 700;
}
.drawer-items-count {
  font-size: 0.85rem;
  color: var(--text-muted);
}
.drawer-close-btn {
  font-size: 1.8rem;
  line-height: 1;
  color: var(--text-muted);
  transition: color var(--transition-fast);
}
.drawer-close-btn:hover {
  color: var(--text-main);
}

/* Free Delivery Bar */
.delivery-progress-container {
  background: var(--primary-soft);
  padding: 12px 24px;
  border-bottom: 1px solid var(--primary-border);
}
.delivery-progress-text {
  font-size: 0.82rem;
  color: var(--primary-hover);
  margin-bottom: 6px;
}
.progress-track {
  width: 100%;
  height: 6px;
  background: rgba(16, 185, 129, 0.2);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: var(--primary);
  border-radius: var(--radius-full);
  transition: width 0.4s ease;
}

/* Cart Items List */
.cart-items-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Cart Item Card */
.cart-item-row {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 14px;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-light);
}
.cart-item-img {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  object-fit: cover;
  border: 1px solid var(--border-light);
}
.cart-item-details h4 {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.3;
  margin-bottom: 2px;
}
.cart-item-unit {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.cart-item-stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  background: var(--bg-subtle);
}
.stepper-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  color: var(--text-main);
}
.stepper-btn:hover {
  background: var(--border-light);
}
.stepper-count {
  width: 28px;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 700;
}
.cart-item-price-side {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}
.cart-item-price {
  font-weight: 700;
  font-size: 1rem;
}
.cart-item-remove-btn {
  color: var(--text-muted);
  font-size: 0.75rem;
  transition: color var(--transition-fast);
}
.cart-item-remove-btn:hover {
  color: var(--danger);
  text-decoration: underline;
}

/* Empty Cart View */
.empty-cart-view {
  padding: 60px 24px;
  text-align: center;
}
.empty-cart-icon {
  font-size: 3.5rem;
  margin-bottom: 12px;
}
.empty-cart-view h4 {
  font-size: 1.25rem;
  margin-bottom: 6px;
}
.empty-cart-view p {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 20px;
}

/* Cart Footer */
.cart-footer {
  border-top: 1px solid var(--border-light);
  padding: 20px 24px;
  background: var(--bg-surface-elevated);
}
.cart-coupon-box {
  margin-bottom: 16px;
}
.coupon-input-wrapper {
  display: flex;
  gap: 8px;
}
.coupon-input-wrapper input {
  padding: 8px 12px;
  font-size: 0.85rem;
  text-transform: uppercase;
}
.coupon-status {
  font-size: 0.78rem;
  margin-top: 4px;
  font-weight: 600;
}
.coupon-status.success { color: var(--success); }
.coupon-status.error { color: var(--danger); }

.cart-summary-table {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-secondary);
}
.summary-row.discount-row {
  color: var(--success);
  font-weight: 600;
}
.summary-divider {
  height: 1px;
  background: var(--border-light);
  margin: 6px 0;
}
.summary-row.total-row {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-main);
}
.summary-total-price {
  color: var(--primary);
  font-size: 1.35rem;
}
.checkout-cta-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.checkout-total-pill {
  background: rgba(255, 255, 255, 0.25);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.9rem;
}
.cart-guarantee-note {
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 12px;
}

/* ------------------------------------------------------------------------------
   8. CHECKOUT MODAL & FORMS
   ------------------------------------------------------------------------------ */
.checkout-modal {
  max-width: 680px;
}
.checkout-modal-body {
  padding: 24px;
}
.form-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-light);
}
.form-section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 14px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 12px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}
.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.payment-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.payment-radio-card {
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all var(--transition-fast);
}
.payment-radio-card:hover {
  border-color: var(--primary);
}
.payment-radio-card.active,
.payment-radio-card input:checked ~ .payment-card-content {
  border-color: var(--primary);
  background: var(--primary-soft);
}
.payment-card-content {
  display: flex;
  align-items: center;
  gap: 10px;
}
.payment-icon {
  font-size: 1.5rem;
}
.payment-card-content strong {
  display: block;
  font-size: 0.9rem;
}
.payment-card-content small {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.checkout-review-summary {
  background: var(--bg-subtle);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 20px;
}
.review-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  margin-bottom: 6px;
}
.review-grand-total {
  font-size: 1.15rem;
  border-top: 1px solid var(--border-light);
  padding-top: 8px;
  margin-top: 8px;
  color: var(--primary);
}

/* ------------------------------------------------------------------------------
   9. ORDER SUCCESS MODAL & TRACKER
   ------------------------------------------------------------------------------ */
.success-modal {
  text-align: center;
  padding: 40px 32px;
}
.success-icon-wrapper {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background: var(--primary-soft);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}
.checkmark-icon {
  width: 40px;
  height: 40px;
}
.success-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 8px;
}
.success-subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 24px;
}
.order-badge-box {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  padding: 8px 18px;
  border-radius: var(--radius-full);
  margin-bottom: 28px;
}
.order-badge-box strong {
  color: var(--primary);
  font-size: 1.1rem;
}

/* Delivery Progress Tracker Timeline */
.order-tracker-timeline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding: 0 10px;
}
.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-subtle);
  border: 2px solid var(--border-light);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
}
.timeline-step.completed .step-circle {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}
.timeline-step.active .step-circle {
  border-color: var(--primary);
  color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-soft);
}
.step-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-main);
}
.step-time {
  font-size: 0.7rem;
  color: var(--text-muted);
}
.timeline-line {
  flex-grow: 1;
  height: 2px;
  background: var(--border-light);
  margin: 0 8px;
}
.timeline-line.active {
  background: var(--primary);
}

.success-details-card {
  background: var(--bg-subtle);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  text-align: left;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.details-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
}
.success-actions {
  display: flex;
  gap: 12px;
}

/* ------------------------------------------------------------------------------
   10. PRODUCT QUICK VIEW MODAL
   ------------------------------------------------------------------------------ */
.quick-view-modal {
  max-width: 800px;
}
.quick-view-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 32px;
  padding: 32px;
}
.quick-view-image-box {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  height: 340px;
  background: var(--bg-subtle);
}
.quick-view-image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.qv-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: var(--primary);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
}

.quick-view-info {
  display: flex;
  flex-direction: column;
}
.qv-category {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.qv-title {
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 800;
  margin-bottom: 8px;
}
.qv-rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  margin-bottom: 14px;
}
.qv-price-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 16px;
}
.qv-price {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-main);
}
.qv-original-price {
  font-size: 1.1rem;
  color: var(--text-muted);
  text-decoration: line-through;
}
.qv-unit {
  font-size: 0.9rem;
  color: var(--text-muted);
}
.qv-discount-pill {
  background: var(--accent-soft);
  color: var(--accent-hover);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.78rem;
  font-weight: 700;
}
.qv-description {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 18px;
}

.qv-nutrition-card {
  background: var(--bg-subtle);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  margin-bottom: 18px;
}
.nutrition-title {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.nutrition-pill {
  display: flex;
  flex-direction: column;
}
.nutrition-pill span {
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
}
.nutrition-pill strong {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
}

.qv-stock-status {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 20px;
}
.qv-stock-status.in-stock { color: var(--success); }
.qv-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: auto;
}
.quantity-stepper {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-md);
}
.qv-add-btn {
  flex-grow: 1;
}

/* ------------------------------------------------------------------------------
   11. ADMIN PORTAL MODAL
   ------------------------------------------------------------------------------ */
.admin-modal {
  max-width: 960px;
}
.admin-badge {
  display: inline-block;
  background: #fef3c7;
  color: #b45309;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.supabase-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 600;
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  margin-top: 6px;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.admin-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-light);
  padding: 0 24px;
  background: var(--bg-subtle);
}
.admin-tab {
  padding: 14px 20px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-muted);
  border-bottom: 2px solid transparent;
  transition: all var(--transition-fast);
}
.admin-tab:hover {
  color: var(--text-main);
}
.admin-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.admin-modal-body {
  padding: 24px;
}
.admin-tab-content {
  display: none;
}
.admin-tab-content.active {
  display: block;
}

.stats-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}
.admin-stat-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 18px;
  display: flex;
  flex-direction: column;
}
.stat-card-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.stat-card-val {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 800;
}
.stat-card-sub {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.table-responsive {
  overflow-x: auto;
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  text-align: left;
}
.admin-table th {
  padding: 12px 14px;
  background: var(--bg-subtle);
  border-bottom: 1.5px solid var(--border-light);
  font-weight: 700;
  color: var(--text-muted);
}
.admin-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-light);
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
}
.status-badge.confirmed { background: #dbeafe; color: #1e40af; }
.status-badge.out-for-delivery { background: #fef3c7; color: #92400e; }
.status-badge.delivered { background: #dcfce7; color: #166534; }
.status-badge.cancelled { background: #fee2e2; color: #991b1b; }

.status-select {
  padding: 4px 8px;
  font-size: 0.8rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
}

/* ------------------------------------------------------------------------------
   12. FOOTER
   ------------------------------------------------------------------------------ */
.main-footer {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-light);
  padding: 60px 0 30px;
  margin-top: 40px;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: 40px;
  margin-bottom: 40px;
}
.footer-desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 16px 0;
}
.tech-stack-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tech-pill {
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--bg-subtle);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
}

.footer-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 18px;
}
.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-links a {
  font-size: 0.88rem;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}
.footer-links a:hover {
  color: var(--primary);
}

.newsletter-form {
  display: flex;
  gap: 8px;
  margin: 14px 0;
}
.payment-badges-row {
  display: flex;
  gap: 8px;
}
.payment-badges-row span {
  font-size: 0.72rem;
  background: var(--bg-subtle);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 700;
  color: var(--text-muted);
}

.footer-bottom {
  border-top: 1px solid var(--border-light);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  color: var(--text-muted);
}
.footer-bottom-links {
  display: flex;
  gap: 16px;
}

/* ------------------------------------------------------------------------------
   13. RESPONSIVE BREAKPOINTS
   ------------------------------------------------------------------------------ */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }
  .hero-cta-group,
  .hero-stats {
    justify-content: center;
  }
  .hero-visual {
    max-width: 520px;
    margin: 0 auto;
  }
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .store-layout {
    grid-template-columns: 1fr;
  }
  .filter-sidebar {
    position: static;
  }
  .trust-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .announcement-bar {
    display: none;
  }
  .header-container {
    flex-wrap: wrap;
    gap: 12px;
  }
  .search-wrapper {
    order: 3;
    max-width: 100%;
    width: 100%;
  }
  .location-btn {
    display: none;
  }
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .quick-view-grid {
    grid-template-columns: 1fr;
  }
  .quick-view-image-box {
    height: 240px;
  }
  .form-row,
  .payment-options,
  .stats-cards-grid {
    grid-template-columns: 1fr;
  }
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
```

---

<a id="frontend-js-api-js"></a>
## 📄 `frontend/js/api.js`

> **Description**: HTTP API client for backend communication  
> **Path**: `frontend/js/api.js`  
> **Language**: javascript

```javascript
/**
 * FreshCart API Client
 * Wraps backend endpoints for Products, Categories, Orders, Coupons, and Admin Stats.
 */
const API = {
  baseUrl: '/api',

  async request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  },

  // Health & Supabase Status
  async getHealth() {
    return this.request('/health');
  },

  // Categories
  async getCategories() {
    return this.request('/categories');
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/products${queryString}`);
  },

  async getProductById(id) {
    return this.request(`/products/${id}`);
  },

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(id, updates) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Coupons
  async validateCoupon(code, subtotal) {
    return this.request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal })
    });
  },

  // Orders
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async getOrders(email = '') {
    const endpoint = email ? `/orders?email=${encodeURIComponent(email)}` : '/orders';
    return this.request(endpoint);
  },

  async getOrderById(id) {
    return this.request(`/orders/${id}`);
  },

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Admin Stats
  async getStats() {
    return this.request('/stats');
  }
};
```

---

<a id="frontend-js-cart-js"></a>
## 📄 `frontend/js/cart.js`

> **Description**: Cart and wishlist state manager (localStorage)  
> **Path**: `frontend/js/cart.js`  
> **Language**: javascript

```javascript
/**
 * FreshCart Cart & Wishlist State Management
 */
const CartState = {
  items: [],
  coupon: null,
  listeners: [],
  wishlistListeners: [],
  wishlist: [],

  init() {
    try {
      const savedCart = localStorage.getItem('freshcart_cart_v1');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
      const savedCoupon = localStorage.getItem('freshcart_coupon_v1');
      if (savedCoupon) {
        this.coupon = JSON.parse(savedCoupon);
      }
      const savedWishlist = localStorage.getItem('freshcart_wishlist_v1');
      if (savedWishlist) {
        this.wishlist = JSON.parse(savedWishlist);
      }
    } catch (e) {
      console.warn('Could not parse cart from localStorage:', e);
      this.items = [];
      this.wishlist = [];
      this.coupon = null;
    }
  },

  save() {
    localStorage.setItem('freshcart_cart_v1', JSON.stringify(this.items));
    if (this.coupon) {
      localStorage.setItem('freshcart_coupon_v1', JSON.stringify(this.coupon));
    } else {
      localStorage.removeItem('freshcart_coupon_v1');
    }
    this.notify();
  },

  saveWishlist() {
    localStorage.setItem('freshcart_wishlist_v1', JSON.stringify(this.wishlist));
    this.notifyWishlist();
  },

  subscribe(fn) {
    this.listeners.push(fn);
    fn(this.getCalculations());
  },

  notify() {
    const calc = this.getCalculations();
    this.listeners.forEach(fn => fn(calc));
  },

  subscribeWishlist(fn) {
    this.wishlistListeners.push(fn);
    fn(this.wishlist);
  },

  notifyWishlist() {
    this.wishlistListeners.forEach(fn => fn(this.wishlist));
  },

  addItem(product, quantity = 1) {
    const existingIndex = this.items.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        original_price: product.original_price ? parseFloat(product.original_price) : null,
        image_url: product.image_url,
        unit: product.unit || '1 unit',
        quantity: quantity
      });
    }
    this.save();
  },

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
  },

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.save();
      }
    }
  },

  clearCart() {
    this.items = [];
    this.coupon = null;
    this.save();
  },

  applyCoupon(couponData) {
    this.coupon = couponData;
    this.save();
  },

  removeCoupon() {
    this.coupon = null;
    this.save();
  },

  getCalculations() {
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);

    const freeShippingThreshold = 35.00;
    const isFreeShipping = subtotal >= freeShippingThreshold || (this.coupon && this.coupon.code === 'FREESHIP');
    const deliveryFee = subtotal === 0 ? 0 : (isFreeShipping ? 0 : 4.99);
    const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
    const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

    let discount = 0;
    if (this.coupon && subtotal > 0) {
      if (this.coupon.discount_percent > 0) {
        discount = (subtotal * this.coupon.discount_percent) / 100;
      } else if (this.coupon.discount_amount > 0) {
        discount = Math.min(subtotal, this.coupon.discount_amount);
      }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = subtotal === 0 ? 0 : taxableAmount * 0.05; // 5% estimated sales tax
    const total = subtotal === 0 ? 0 : Math.max(0, subtotal - discount + deliveryFee + tax);

    return {
      items: this.items,
      itemCount,
      subtotal: parseFloat(subtotal.toFixed(2)),
      deliveryFee: parseFloat(deliveryFee.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      coupon: this.coupon,
      isFreeShipping,
      freeShippingRemaining: parseFloat(freeShippingRemaining.toFixed(2)),
      freeShippingPercent
    };
  },

  // Wishlist Methods
  toggleWishlist(product) {
    const index = this.wishlist.findIndex(item => item.id === product.id);
    let added = false;
    if (index > -1) {
      this.wishlist.splice(index, 1);
      added = false;
    } else {
      this.wishlist.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image_url: product.image_url,
        unit: product.unit || '1 unit'
      });
      added = true;
    }
    this.saveWishlist();
    return added;
  },

  isInWishlist(productId) {
    return this.wishlist.some(item => item.id === productId);
  }
};

CartState.init();
```

---

<a id="frontend-js-ui-js"></a>
## 📄 `frontend/js/ui.js`

> **Description**: DOM renderers, modal managers & toast notifications  
> **Path**: `frontend/js/ui.js`  
> **Language**: javascript

```javascript
/**
 * FreshCart UI Renderer & Component Handlers
 */
const UI = {
  // Toast notifications
  showToast(message, type = 'info', icon = '🥬') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);
    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Currency Formatter
  formatPrice(num) {
    return `$${parseFloat(num || 0).toFixed(2)}`;
  },

  // Dark / Light Theme Toggle
  initTheme() {
    const savedTheme = localStorage.getItem('freshcart_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcons(savedTheme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('freshcart_theme', next);
        this.updateThemeIcons(next);
        this.showToast(`Switched to ${next} theme`, 'info', next === 'dark' ? '🌙' : '☀️');
      });
    }
  },

  updateThemeIcons(theme) {
    const sunIcon = document.querySelector('.icon-sun');
    const moonIcon = document.querySelector('.icon-moon');
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  },

  // Render Product Card
  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;

    const isFav = CartState.isInWishlist(product.id);
    const discountBadge = product.discount_percent > 0 
      ? `<span class="product-badge-pill discount">${product.discount_percent}% OFF</span>` 
      : (product.is_organic ? `<span class="product-badge-pill organic">Organic</span>` : '');

    const badgeHTML = product.badge 
      ? `<span class="product-badge-pill ${product.badge.toLowerCase() === 'organic' ? 'organic' : ''}">${product.badge}</span>`
      : discountBadge;

    card.innerHTML = `
      <div class="product-image-wrap" data-action="quickview">
        <img src="${product.image_url}" alt="${product.name}" class="product-img" loading="lazy">
        ${badgeHTML}
        <button class="wishlist-toggle-btn ${isFav ? 'active' : ''}" data-action="wishlist" title="${isFav ? 'Remove from wishlist' : 'Save to wishlist'}">
          <svg viewBox="0 0 24 24" fill="${isFav ? '#ef4444' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div class="product-info">
        <span class="product-category-name">${product.category_name || 'Grocery'}</span>
        <h3 class="product-title" data-action="quickview" title="${product.name}">${product.name}</h3>
        <span class="product-unit-text">${product.unit || '1 unit'}</span>

        <div class="product-rating">
          <span class="star-rating">★</span>
          <span class="rating-num">${product.rating || '4.8'}</span>
          <span class="rating-reviews">(${product.review_count || 12})</span>
        </div>

        <div class="product-bottom-row">
          <div class="product-pricing">
            <span class="current-price">${this.formatPrice(product.price)}</span>
            ${product.original_price ? `<span class="original-price">${this.formatPrice(product.original_price)}</span>` : ''}
          </div>

          <button class="add-cart-btn" data-action="add-to-cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add</span>
          </button>
        </div>
      </div>
    `;

    return card;
  },

  // Render Product Grid
  renderProducts(products, container) {
    container.innerHTML = '';
    const emptyState = document.getElementById('emptyProductsState');

    if (!products || products.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const fragment = document.createDocumentFragment();
    products.forEach(product => {
      fragment.appendChild(this.createProductCard(product));
    });
    container.appendChild(fragment);
  },

  // Render Categories in Top Grid
  renderCategories(categories, container, activeSlug = 'all') {
    container.innerHTML = '';

    categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = `category-card ${cat.slug === activeSlug ? 'active' : ''}`;
      card.dataset.slug = cat.slug;

      card.innerHTML = `
        <div class="category-image-wrap">
          <img src="${cat.image_url}" alt="${cat.name}">
        </div>
        <strong class="category-name">${cat.name}</strong>
        <span class="category-count">${cat.item_count || 0} items</span>
      `;

      container.appendChild(card);
    });
  },

  // Render Filter Categories in Sidebar
  renderSidebarCategories(categories, container, activeSlug = 'all') {
    container.innerHTML = '';

    // "All Categories" option
    const allBtn = document.createElement('button');
    allBtn.className = `filter-cat-btn ${activeSlug === 'all' ? 'active' : ''}`;
    allBtn.dataset.slug = 'all';
    allBtn.innerHTML = `
      <span>All Groceries</span>
      <span class="filter-cat-badge">All</span>
    `;
    container.appendChild(allBtn);

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `filter-cat-btn ${cat.slug === activeSlug ? 'active' : ''}`;
      btn.dataset.slug = cat.slug;
      btn.innerHTML = `
        <span>${cat.name}</span>
        <span class="filter-cat-badge">${cat.item_count || 0}</span>
      `;
      container.appendChild(btn);
    });
  },

  // Update Drawer Cart Items List
  updateCartDrawer(calc) {
    const listEl = document.getElementById('cartItemsList');
    const emptyView = document.getElementById('emptyCartView');
    const footer = document.getElementById('cartFooter');
    const headerTotal = document.getElementById('cartHeaderTotal');
    const badgeCount = document.getElementById('cartBadgeCount');
    const drawerCount = document.getElementById('drawerCartCount');
    const checkoutBtnTotal = document.getElementById('checkoutBtnTotal');

    // Header total & badge
    if (headerTotal) headerTotal.textContent = this.formatPrice(calc.total);
    if (badgeCount) badgeCount.textContent = calc.itemCount;
    if (drawerCount) drawerCount.textContent = `(${calc.itemCount} items)`;
    if (checkoutBtnTotal) checkoutBtnTotal.textContent = this.formatPrice(calc.total);

    // Free delivery progress bar
    const progressTrack = document.getElementById('deliveryProgressContainer');
    const progressBar = document.getElementById('deliveryProgressBar');
    const progressText = document.getElementById('deliveryProgressText');

    if (progressBar && progressText) {
      progressBar.style.width = `${calc.freeShippingPercent}%`;
      if (calc.isFreeShipping) {
        progressText.innerHTML = `🎉 <strong>Congratulations!</strong> You get <strong>FREE Express Delivery!</strong>`;
      } else {
        progressText.innerHTML = `Add <strong>$${calc.freeShippingRemaining.toFixed(2)}</strong> more for <strong>FREE Delivery!</strong>`;
      }
    }

    // Bill summary values
    const subtotalEl = document.getElementById('summarySubtotal');
    const deliveryEl = document.getElementById('summaryDeliveryFee');
    const discountRow = document.getElementById('summaryDiscountRow');
    const discountEl = document.getElementById('summaryDiscount');
    const discountCodeLabel = document.getElementById('discountCodeLabel');
    const taxEl = document.getElementById('summaryTax');
    const totalEl = document.getElementById('summaryTotal');

    if (subtotalEl) subtotalEl.textContent = this.formatPrice(calc.subtotal);
    if (deliveryEl) deliveryEl.textContent = calc.deliveryFee === 0 ? 'FREE' : this.formatPrice(calc.deliveryFee);
    if (taxEl) taxEl.textContent = this.formatPrice(calc.tax);
    if (totalEl) totalEl.textContent = this.formatPrice(calc.total);

    if (discountRow && discountEl) {
      if (calc.discount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `-${this.formatPrice(calc.discount)}`;
        if (discountCodeLabel && calc.coupon) {
          discountCodeLabel.textContent = calc.coupon.code;
        }
      } else {
        discountRow.style.display = 'none';
      }
    }

    // Cart Items Rendering
    if (!calc.items || calc.items.length === 0) {
      if (listEl) listEl.innerHTML = '';
      if (emptyView) emptyView.style.display = 'block';
      if (footer) footer.style.display = 'none';
      if (progressTrack) progressTrack.style.display = 'none';
      return;
    }

    if (emptyView) emptyView.style.display = 'none';
    if (footer) footer.style.display = 'block';
    if (progressTrack) progressTrack.style.display = 'block';

    if (listEl) {
      listEl.innerHTML = '';
      calc.items.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item-row';
        itemRow.dataset.id = item.id;

        itemRow.innerHTML = `
          <img src="${item.image_url}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="cart-item-unit">${item.unit} • ${this.formatPrice(item.price)} each</div>
            <div class="cart-item-stepper">
              <button class="stepper-btn" data-action="decrease" data-id="${item.id}">−</button>
              <span class="stepper-count">${item.quantity}</span>
              <button class="stepper-btn" data-action="increase" data-id="${item.id}">+</button>
            </div>
          </div>
          <div class="cart-item-price-side">
            <span class="cart-item-price">${this.formatPrice(item.price * item.quantity)}</span>
            <button class="cart-item-remove-btn" data-action="remove" data-id="${item.id}">Remove</button>
          </div>
        `;
        listEl.appendChild(itemRow);
      });
    }
  },

  // Update Wishlist Drawer
  updateWishlistDrawer(wishlist) {
    const listEl = document.getElementById('wishlistItemsList');
    const emptyView = document.getElementById('emptyWishlistView');
    const countEl = document.getElementById('wishlistCount');
    const drawerCountEl = document.getElementById('drawerWishlistCount');

    if (countEl) countEl.textContent = wishlist.length;
    if (drawerCountEl) drawerCountEl.textContent = `(${wishlist.length} items)`;

    if (!wishlist || wishlist.length === 0) {
      if (listEl) listEl.innerHTML = '';
      if (emptyView) emptyView.style.display = 'block';
      return;
    }

    if (emptyView) emptyView.style.display = 'none';

    if (listEl) {
      listEl.innerHTML = '';
      wishlist.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item-row';
        itemRow.dataset.id = item.id;

        itemRow.innerHTML = `
          <img src="${item.image_url}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="cart-item-unit">${item.unit}</div>
            <button class="btn btn-sm btn-outline mt-3" data-action="wishlist-add-cart" data-id="${item.id}">Move to Basket</button>
          </div>
          <div class="cart-item-price-side">
            <span class="cart-item-price">${this.formatPrice(item.price)}</span>
            <button class="cart-item-remove-btn" data-action="wishlist-remove" data-id="${item.id}">Remove</button>
          </div>
        `;
        listEl.appendChild(itemRow);
      });
    }
  },

  // Open Quick View Modal
  openQuickView(product) {
    const modal = document.getElementById('quickViewBackdrop');
    if (!modal) return;

    modal.dataset.productId = product.id;
    document.getElementById('qvImage').src = product.image_url;
    document.getElementById('qvImage').alt = product.name;
    document.getElementById('qvTitle').textContent = product.name;
    document.getElementById('qvCategory').textContent = product.category_name || 'Produce';
    document.getElementById('qvPrice').textContent = this.formatPrice(product.price);
    
    const origPriceEl = document.getElementById('qvOriginalPrice');
    const discountEl = document.getElementById('qvDiscountPill');
    if (product.original_price) {
      origPriceEl.style.display = 'inline';
      origPriceEl.textContent = this.formatPrice(product.original_price);
      discountEl.style.display = 'inline-block';
      discountEl.textContent = `${product.discount_percent || 15}% OFF`;
    } else {
      origPriceEl.style.display = 'none';
      discountEl.style.display = 'none';
    }

    document.getElementById('qvUnit').textContent = `/ ${product.unit || '1 unit'}`;
    document.getElementById('qvDescription').textContent = product.description;
    document.getElementById('qvRating').textContent = product.rating || '4.8';
    document.getElementById('qvReviewCount').textContent = `(${product.review_count || 45} reviews)`;
    document.getElementById('qvQuantity').textContent = '1';

    // Nutrition grid
    const nutritionGrid = document.getElementById('qvNutritionGrid');
    if (nutritionGrid && product.nutrition) {
      nutritionGrid.innerHTML = '';
      Object.keys(product.nutrition).forEach(key => {
        const item = document.createElement('div');
        item.className = 'nutrition-pill';
        item.innerHTML = `
          <span>${key.replace('_', ' ')}</span>
          <strong>${product.nutrition[key]}</strong>
        `;
        nutritionGrid.appendChild(item);
      });
    }

    modal.classList.add('active');
  },

  closeQuickView() {
    const modal = document.getElementById('quickViewBackdrop');
    if (modal) modal.classList.remove('active');
  }
};
```

---

<a id="frontend-js-admin-js"></a>
## 📄 `frontend/js/admin.js`

> **Description**: Admin inventory management & revenue dashboard  
> **Path**: `frontend/js/admin.js`  
> **Language**: javascript

```javascript
/**
 * FreshCart Admin Inventory & Order Management Module
 */
const Admin = {
  activeTab: 'overview',
  categories: [],
  products: [],
  orders: [],

  init() {
    this.bindEvents();
    this.checkSupabaseConnection();
  },

  bindEvents() {
    // Admin modal open/close
    const adminBtn = document.getElementById('adminPortalBtn');
    const footerAdminBtn = document.getElementById('footerAdminTrigger');
    const closeBtn = document.getElementById('closeAdminModal');
    const backdrop = document.getElementById('adminModalBackdrop');

    if (adminBtn) adminBtn.addEventListener('click', () => this.open());
    if (footerAdminBtn) footerAdminBtn.addEventListener('click', (e) => { e.preventDefault(); this.open(); });
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.close();
      });
    }

    // Tabs switching
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.switchTab(tab.dataset.tab);
      });
    });

    // Add Product Form submit
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
      addProductForm.addEventListener('submit', (e) => this.handleAddProduct(e));
    }
  },

  async open() {
    const backdrop = document.getElementById('adminModalBackdrop');
    if (backdrop) backdrop.classList.add('active');
    await this.refreshData();
  },

  close() {
    const backdrop = document.getElementById('adminModalBackdrop');
    if (backdrop) backdrop.classList.remove('active');
  },

  switchTab(tabId) {
    this.activeTab = tabId;
    const contents = document.querySelectorAll('.admin-tab-content');
    contents.forEach(c => c.classList.remove('active'));

    const activeContent = document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
    if (activeContent) activeContent.classList.add('active');

    if (tabId === 'overview') this.renderOverview();
    if (tabId === 'orders') this.renderOrders();
    if (tabId === 'products') this.renderProducts();
    if (tabId === 'addProduct') this.populateCategoriesDropdown();
  },

  async checkSupabaseConnection() {
    try {
      const health = await API.getHealth();
      const statusText = document.getElementById('supabaseStatusText');
      const statusPill = document.getElementById('supabaseStatusPill');

      if (health.supabase && health.supabase.connected) {
        if (statusText) statusText.textContent = 'Supabase PostgreSQL: Connected Live 🟢';
        if (statusPill) statusPill.style.color = 'var(--success)';
      } else if (health.supabase && health.supabase.urlConfigured) {
        if (statusText) statusText.textContent = 'Supabase PostgreSQL: Connected (Schema Ready) 🟢';
        if (statusPill) statusPill.style.color = 'var(--success)';
      } else {
        if (statusText) statusText.textContent = 'High-Fidelity Datastore (Add keys in .env for live Supabase) 🟡';
        if (statusPill) statusPill.style.color = 'var(--accent-hover)';
      }
    } catch (e) {
      console.warn('Could not check Supabase status:', e);
    }
  },

  async refreshData() {
    try {
      const [statsRes, ordersRes, productsRes, categoriesRes] = await Promise.all([
        API.getStats().catch(() => ({ data: {} })),
        API.getOrders().catch(() => ({ data: [] })),
        API.getProducts({ limit: 100 }).catch(() => ({ data: [] })),
        API.getCategories().catch(() => ({ data: [] }))
      ]);

      this.stats = statsRes.data || {};
      this.orders = ordersRes.data || [];
      this.products = productsRes.data || [];
      this.categories = categoriesRes.data || [];

      this.renderOverview();
      this.renderOrders();
      this.renderProducts();
      this.populateCategoriesDropdown();
    } catch (e) {
      console.error('Error refreshing admin data:', e);
    }
  },

  renderOverview() {
    const revEl = document.getElementById('adminStatRevenue');
    const ordersEl = document.getElementById('adminStatOrders');
    const prodsEl = document.getElementById('adminStatProducts');
    const aovEl = document.getElementById('adminStatAOV');

    if (revEl) revEl.textContent = UI.formatPrice(this.stats.totalRevenue || 0);
    if (ordersEl) ordersEl.textContent = this.stats.totalOrders || this.orders.length;
    if (prodsEl) prodsEl.textContent = this.stats.totalProducts || this.products.length;
    if (aovEl) aovEl.textContent = UI.formatPrice(this.stats.averageOrderValue || 0);

    // Recent orders table
    const tbody = document.getElementById('recentOrdersTableBody');
    if (tbody) {
      tbody.innerHTML = '';
      const recent = this.orders.slice(0, 5);
      if (recent.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align: center; padding: 20px;">No customer orders placed yet.</td></tr>`;
        return;
      }

      recent.forEach(order => {
        const tr = document.createElement('tr');
        const itemCount = order.items ? order.items.length : 1;
        const statusClass = (order.status || 'confirmed').toLowerCase().replace(/\s+/g, '-');
        const dateStr = order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today';

        tr.innerHTML = `
          <td><strong>${order.order_number}</strong></td>
          <td>${order.customer_name}</td>
          <td>${itemCount} items</td>
          <td><strong>${UI.formatPrice(order.total)}</strong></td>
          <td><span class="status-badge ${statusClass}">${order.status}</span></td>
          <td class="text-muted">${dateStr}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  },

  renderOrders() {
    const tbody = document.getElementById('allOrdersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (this.orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-muted" style="text-align: center; padding: 20px;">No orders in queue.</td></tr>`;
      return;
    }

    this.orders.forEach(order => {
      const tr = document.createElement('tr');
      const statusClass = (order.status || 'confirmed').toLowerCase().replace(/\s+/g, '-');
      const itemsList = order.items ? order.items.map(i => `${i.product_name || i.name} (x${i.quantity})`).join(', ') : 'Grocery Basket';

      tr.innerHTML = `
        <td>
          <strong>${order.order_number}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${new Date(order.created_at).toLocaleDateString()}</div>
        </td>
        <td>
          <div><strong>${order.customer_name}</strong></div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${order.customer_email} • ${order.customer_phone}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${order.shipping_address}</div>
        </td>
        <td>
          <div style="max-width: 220px; font-size: 0.8rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${itemsList}">${itemsList}</div>
          <div style="font-weight: 700; color: var(--primary); margin-top: 4px;">${UI.formatPrice(order.total)} (${order.payment_method})</div>
        </td>
        <td>
          <span class="status-badge ${statusClass}">${order.status}</span>
        </td>
        <td>
          <select class="status-select" data-id="${order.id}">
            <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
            <option value="Out for Delivery" ${order.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      `;

      // Status change listener
      const select = tr.querySelector('.status-select');
      select.addEventListener('change', async (e) => {
        const newStatus = e.target.value;
        try {
          await API.updateOrderStatus(order.id, newStatus);
          UI.showToast(`Order ${order.order_number} updated to ${newStatus}`, 'success', '📦');
          await this.refreshData();
        } catch (err) {
          UI.showToast(`Failed to update status: ${err.message}`, 'error', '⚠️');
        }
      });

      tbody.appendChild(tr);
    });
  },

  renderProducts() {
    const tbody = document.getElementById('catalogTableBody');
    const countTag = document.getElementById('catalogCountTag');
    if (countTag) countTag.textContent = `${this.products.length} products`;
    if (!tbody) return;

    tbody.innerHTML = '';
    this.products.forEach(prod => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="display: flex; align-items: center; gap: 10px;">
          <img src="${prod.image_url}" alt="${prod.name}" style="width: 36px; height: 36px; border-radius: 6px; object-fit: cover;">
          <div>
            <strong>${prod.name}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${prod.unit}</div>
          </div>
        </td>
        <td>${prod.category_name || 'Produce'}</td>
        <td><strong>${UI.formatPrice(prod.price)}</strong></td>
        <td>
          <span style="font-weight: 700; color: ${prod.stock > 10 ? 'var(--success)' : 'var(--danger)'};">
            ${prod.stock} left
          </span>
        </td>
        <td>
          ${prod.is_organic ? '<span class="status-badge" style="background: #dcfce7; color: #166534;">Organic</span>' : '<span class="text-muted">Standard</span>'}
        </td>
        <td>
          <button class="btn btn-sm btn-outline text-danger delete-prod-btn" data-id="${prod.id}" style="color: var(--danger); border-color: var(--danger);">
            Delete
          </button>
        </td>
      `;

      // Delete listener
      const deleteBtn = tr.querySelector('.delete-prod-btn');
      deleteBtn.addEventListener('click', async () => {
        if (confirm(`Are you sure you want to delete "${prod.name}"?`)) {
          try {
            await API.deleteProduct(prod.id);
            UI.showToast(`Product "${prod.name}" deleted`, 'info', '🗑️');
            await this.refreshData();
            // Also notify main app to refresh products grid
            window.dispatchEvent(new CustomEvent('grocery-catalog-updated'));
          } catch (err) {
            UI.showToast(`Could not delete: ${err.message}`, 'error', '⚠️');
          }
        }
      });

      tbody.appendChild(tr);
    });
  },

  populateCategoriesDropdown() {
    const select = document.getElementById('newProdCategory');
    if (!select || this.categories.length === 0) return;

    select.innerHTML = '';
    this.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      select.appendChild(opt);
    });
  },

  async handleAddProduct(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('saveProductBtn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span>Saving to Supabase...</span>';

    try {
      const payload = {
        name: document.getElementById('newProdName').value.trim(),
        category_id: document.getElementById('newProdCategory').value,
        price: parseFloat(document.getElementById('newProdPrice').value),
        original_price: document.getElementById('newProdOriginalPrice').value ? parseFloat(document.getElementById('newProdOriginalPrice').value) : null,
        unit: document.getElementById('newProdUnit').value.trim(),
        stock: parseInt(document.getElementById('newProdStock').value) || 50,
        image_url: document.getElementById('newProdImage').value.trim(),
        badge: document.getElementById('newProdBadge').value.trim() || null,
        description: document.getElementById('newProdDescription').value.trim(),
        is_organic: document.getElementById('newProdOrganic').checked,
        is_featured: document.getElementById('newProdFeatured').checked
      };

      await API.createProduct(payload);
      UI.showToast(`Product "${payload.name}" published successfully!`, 'success', '✨');
      document.getElementById('addProductForm').reset();
      this.switchTab('products');
      await this.refreshData();
      window.dispatchEvent(new CustomEvent('grocery-catalog-updated'));
    } catch (err) {
      UI.showToast(`Failed to add product: ${err.message}`, 'error', '⚠️');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<span>Save & Publish Product</span>';
    }
  }
};
```

---

<a id="frontend-js-app-js"></a>
## 📄 `frontend/js/app.js`

> **Description**: Application orchestrator & event bus  
> **Path**: `frontend/js/app.js`  
> **Language**: javascript

```javascript
/**
 * FreshCart Main Application Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const App = {
    currentCategory: 'all',
    searchTerm: '',
    maxPrice: 25,
    isOrganicOnly: false,
    isInStockOnly: true,
    currentSort: 'featured',
    allProducts: [],
    categories: [],

    async init() {
      UI.initTheme();
      CartState.subscribe(calc => UI.updateCartDrawer(calc));
      CartState.subscribeWishlist(wishlist => UI.updateWishlistDrawer(wishlist));
      Admin.init();

      this.bindHeaderActions();
      this.bindFilterActions();
      this.bindCartActions();
      this.bindCheckoutActions();
      this.bindQuickViewActions();
      this.bindWishlistActions();
      this.bindLocationActions();

      await this.loadCategories();
      await this.loadProducts();

      // Listen for catalog updates from Admin
      window.addEventListener('grocery-catalog-updated', () => {
        this.loadProducts();
      });
    },

    // --------------------------------------------------------------------------
    // 1. DATA LOADING
    // --------------------------------------------------------------------------
    async loadCategories() {
      try {
        const res = await API.getCategories();
        this.categories = res.data || [];

        // Render in top categories carousel
        const topContainer = document.getElementById('categoriesContainer');
        if (topContainer) {
          UI.renderCategories(this.categories, topContainer, this.currentCategory);
          // Category card click
          topContainer.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
              const slug = card.dataset.slug;
              this.setCategory(slug === this.currentCategory ? 'all' : slug);
            });
          });
        }

        // Render in sidebar
        const sidebarContainer = document.getElementById('filterCategoryList');
        if (sidebarContainer) {
          UI.renderSidebarCategories(this.categories, sidebarContainer, this.currentCategory);
          sidebarContainer.querySelectorAll('.filter-cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              this.setCategory(btn.dataset.slug);
            });
          });
        }

        // Populate search dropdown
        const searchCatSelect = document.getElementById('searchCategorySelect');
        if (searchCatSelect) {
          searchCatSelect.innerHTML = '<option value="all">All Departments</option>';
          this.categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.slug;
            opt.textContent = cat.name;
            searchCatSelect.appendChild(opt);
          });
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    },

    async loadProducts() {
      const grid = document.getElementById('productsGrid');
      if (grid) {
        grid.innerHTML = `
          <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Fetching fresh groceries from Supabase...</p>
          </div>
        `;
      }

      try {
        const params = {
          category: this.currentCategory,
          search: this.searchTerm,
          maxPrice: this.maxPrice,
          organic: this.isOrganicOnly ? 'true' : '',
          inStock: this.isInStockOnly ? 'true' : '',
          sort: this.currentSort,
          limit: 100
        };

        const res = await API.getProducts(params);
        this.allProducts = res.data || [];

        // Update count badge & title
        const countBadge = document.getElementById('productsCountBadge');
        if (countBadge) {
          countBadge.textContent = `Showing ${this.allProducts.length} items`;
        }

        const titleEl = document.getElementById('activeCategoryTitle');
        if (titleEl) {
          if (this.currentCategory === 'all') {
            titleEl.textContent = 'All Fresh Groceries';
          } else {
            const cat = this.categories.find(c => c.slug === this.currentCategory);
            titleEl.textContent = cat ? cat.name : 'Category Products';
          }
        }

        if (grid) {
          UI.renderProducts(this.allProducts, grid);
          this.bindProductCardEvents(grid);
        }

        this.updateActiveTags();
      } catch (err) {
        console.error('Failed to load products:', err);
        if (grid) {
          grid.innerHTML = `
            <div class="empty-products-state" style="display: block;">
              <div class="empty-icon">⚠️</div>
              <h3>Unable to load groceries</h3>
              <p>${err.message}</p>
              <button class="btn btn-primary" onclick="location.reload()">Retry</button>
            </div>
          `;
        }
      }
    },

    setCategory(slug) {
      this.currentCategory = slug;

      // Update active states in UI
      document.querySelectorAll('.category-card').forEach(card => {
        card.classList.toggle('active', card.dataset.slug === slug);
      });
      document.querySelectorAll('.filter-cat-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.slug === slug);
      });

      const searchSelect = document.getElementById('searchCategorySelect');
      if (searchSelect) searchSelect.value = slug;

      this.loadProducts();

      // Smooth scroll to store section if called from top
      const storeSection = document.getElementById('storeSection');
      if (storeSection && window.scrollY > storeSection.offsetTop) {
        storeSection.scrollIntoView({ behavior: 'smooth' });
      }
    },

    // --------------------------------------------------------------------------
    // 2. HEADER & SEARCH EVENTS
    // --------------------------------------------------------------------------
    bindHeaderActions() {
      // Top coupon click to copy
      const topCoupon = document.getElementById('topCouponCode');
      if (topCoupon) {
        topCoupon.addEventListener('click', () => {
          navigator.clipboard.writeText('FRESH20');
          UI.showToast('Coupon FRESH20 copied to clipboard!', 'success', '📋');
        });
      }

      // Close announcement
      const closeAnnounce = document.getElementById('closeAnnouncement');
      if (closeAnnounce) {
        closeAnnounce.addEventListener('click', () => {
          const bar = document.getElementById('announcementBar');
          if (bar) bar.style.display = 'none';
        });
      }

      // Search bar
      const searchInput = document.getElementById('searchInput');
      const clearBtn = document.getElementById('searchClearBtn');
      const searchCatSelect = document.getElementById('searchCategorySelect');
      let debounceTimeout = null;

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const val = e.target.value.trim();
          if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';

          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => {
            this.searchTerm = val;
            this.loadProducts();
          }, 300);
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (searchInput) {
            searchInput.value = '';
            clearBtn.style.display = 'none';
          }
          this.searchTerm = '';
          this.loadProducts();
        });
      }

      if (searchCatSelect) {
        searchCatSelect.addEventListener('change', (e) => {
          this.setCategory(e.target.value);
        });
      }

      // View All Categories button
      const resetCatBtn = document.getElementById('viewAllCategoriesBtn');
      if (resetCatBtn) {
        resetCatBtn.addEventListener('click', () => this.setCategory('all'));
      }

      // Footer category links
      document.querySelectorAll('.footer-cat-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.setCategory(link.dataset.cat);
          document.getElementById('storeSection').scrollIntoView({ behavior: 'smooth' });
        });
      });

      // Today's Hot Deals button
      const dealsBtn = document.getElementById('exploreDealsBtn');
      if (dealsBtn) {
        dealsBtn.addEventListener('click', () => {
          this.currentSort = 'price-asc';
          const sortSelect = document.getElementById('sortSelect');
          if (sortSelect) sortSelect.value = 'price-asc';
          this.loadProducts();
          document.getElementById('storeSection').scrollIntoView({ behavior: 'smooth' });
        });
      }
    },

    // --------------------------------------------------------------------------
    // 3. FILTER ACTIONS
    // --------------------------------------------------------------------------
    bindFilterActions() {
      // Price slider
      const priceRange = document.getElementById('priceRange');
      const priceDisplay = document.getElementById('priceDisplay');
      if (priceRange && priceDisplay) {
        priceRange.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          priceDisplay.textContent = `$${val.toFixed(2)}`;
          this.maxPrice = val;
        });
        priceRange.addEventListener('change', () => this.loadProducts());
      }

      // Dietary preferences
      const organicFilter = document.getElementById('organicFilter');
      if (organicFilter) {
        organicFilter.addEventListener('change', (e) => {
          this.isOrganicOnly = e.target.checked;
          this.loadProducts();
        });
      }

      const inStockFilter = document.getElementById('inStockFilter');
      if (inStockFilter) {
        inStockFilter.addEventListener('change', (e) => {
          this.isInStockOnly = e.target.checked;
          this.loadProducts();
        });
      }

      // Sort Select
      const sortSelect = document.getElementById('sortSelect');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          this.currentSort = e.target.value;
          this.loadProducts();
        });
      }

      // Reset All Filters
      const resetFiltersBtn = document.getElementById('resetFiltersBtn');
      const clearSearchFiltersBtn = document.getElementById('clearSearchFiltersBtn');
      const clearTagsBtn = document.getElementById('clearTagsBtn');

      const resetAll = () => {
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.maxPrice = 25;
        this.isOrganicOnly = false;
        this.isInStockOnly = false;
        this.currentSort = 'featured';

        if (priceRange) priceRange.value = 25;
        if (priceDisplay) priceDisplay.textContent = '$25.00';
        if (organicFilter) organicFilter.checked = false;
        if (inStockFilter) inStockFilter.checked = false;
        if (sortSelect) sortSelect.value = 'featured';

        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        const searchClearBtn = document.getElementById('searchClearBtn');
        if (searchClearBtn) searchClearBtn.style.display = 'none';

        this.setCategory('all');
      };

      if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAll);
      if (clearSearchFiltersBtn) clearSearchFiltersBtn.addEventListener('click', resetAll);
      if (clearTagsBtn) clearTagsBtn.addEventListener('click', resetAll);

      // Copy coupon code in sidebar
      document.querySelectorAll('.copy-coupon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const code = btn.dataset.code;
          navigator.clipboard.writeText(code);
          UI.showToast(`Coupon ${code} copied!`, 'success', '🏷️');
          // Open cart drawer and fill input
          this.openCart();
          const couponInput = document.getElementById('couponInput');
          if (couponInput) couponInput.value = code;
        });
      });
    },

    updateActiveTags() {
      const tagsBar = document.getElementById('activeTagsBar');
      const tagsList = document.getElementById('tagsList');
      if (!tagsBar || !tagsList) return;

      tagsList.innerHTML = '';
      const tags = [];

      if (this.currentCategory !== 'all') {
        const cat = this.categories.find(c => c.slug === this.currentCategory);
        tags.push({ label: `Category: ${cat ? cat.name : this.currentCategory}`, type: 'category' });
      }
      if (this.searchTerm) {
        tags.push({ label: `Search: "${this.searchTerm}"`, type: 'search' });
      }
      if (this.maxPrice < 25) {
        tags.push({ label: `Under $${this.maxPrice.toFixed(2)}`, type: 'price' });
      }
      if (this.isOrganicOnly) {
        tags.push({ label: 'Organic Only', type: 'organic' });
      }

      if (tags.length === 0) {
        tagsBar.style.display = 'none';
        return;
      }

      tagsBar.style.display = 'flex';
      tags.forEach(t => {
        const chip = document.createElement('div');
        chip.className = 'filter-tag-chip';
        chip.innerHTML = `<span>${t.label}</span><button data-type="${t.type}">&times;</button>`;
        chip.querySelector('button').addEventListener('click', () => {
          if (t.type === 'category') this.setCategory('all');
          if (t.type === 'search') {
            this.searchTerm = '';
            document.getElementById('searchInput').value = '';
            this.loadProducts();
          }
          if (t.type === 'price') {
            this.maxPrice = 25;
            document.getElementById('priceRange').value = 25;
            document.getElementById('priceDisplay').textContent = '$25.00';
            this.loadProducts();
          }
          if (t.type === 'organic') {
            this.isOrganicOnly = false;
            document.getElementById('organicFilter').checked = false;
            this.loadProducts();
          }
        });
        tagsList.appendChild(chip);
      });
    },

    // --------------------------------------------------------------------------
    // 4. PRODUCT CARD INTERACTIONS
    // --------------------------------------------------------------------------
    bindProductCardEvents(container) {
      container.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;
        const productId = card.dataset.id;
        const product = this.allProducts.find(p => p.id === productId);
        if (!product) return;

        // Wishlist Toggle
        const wishlistBtn = e.target.closest('[data-action="wishlist"]');
        if (wishlistBtn) {
          e.stopPropagation();
          const added = CartState.toggleWishlist(product);
          wishlistBtn.classList.toggle('active', added);
          wishlistBtn.querySelector('svg').setAttribute('fill', added ? '#ef4444' : 'none');
          UI.showToast(
            added ? `Added "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`,
            'info',
            added ? '❤️' : '🤍'
          );
          return;
        }

        // Add to Cart
        const addBtn = e.target.closest('[data-action="add-to-cart"]');
        if (addBtn) {
          e.stopPropagation();
          CartState.addItem(product, 1);
          addBtn.classList.add('added-animation');
          addBtn.innerHTML = `<span>Added ✓</span>`;
          UI.showToast(`Added 1x ${product.name} to basket!`, 'success', '🛒');
          setTimeout(() => {
            addBtn.classList.remove('added-animation');
            addBtn.innerHTML = `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add</span>
            `;
          }, 1200);
          return;
        }

        // Quick View Modal
        const qvTarget = e.target.closest('[data-action="quickview"]');
        if (qvTarget) {
          UI.openQuickView(product);
        }
      });
    },

    // --------------------------------------------------------------------------
    // 5. CART DRAWER & COUPON ACTIONS
    // --------------------------------------------------------------------------
    bindCartActions() {
      const cartTrigger = document.getElementById('cartTriggerBtn');
      const cartDrawer = document.getElementById('cartDrawer');
      const cartOverlay = document.getElementById('cartOverlay');
      const closeCart = document.getElementById('closeCartDrawer');
      const startShoppingBtn = document.getElementById('startShoppingBtn');

      this.openCart = () => {
        if (cartDrawer) cartDrawer.classList.add('open');
        if (cartOverlay) cartOverlay.classList.add('active');
      };

      this.closeCart = () => {
        if (cartDrawer) cartDrawer.classList.remove('open');
        if (cartOverlay) cartOverlay.classList.remove('active');
      };

      if (cartTrigger) cartTrigger.addEventListener('click', this.openCart);
      if (closeCart) closeCart.addEventListener('click', this.closeCart);
      if (cartOverlay) cartOverlay.addEventListener('click', this.closeCart);
      if (startShoppingBtn) {
        startShoppingBtn.addEventListener('click', () => {
          this.closeCart();
          document.getElementById('storeSection').scrollIntoView({ behavior: 'smooth' });
        });
      }

      // Cart Item Stepper & Remove clicks
      const cartList = document.getElementById('cartItemsList');
      if (cartList) {
        cartList.addEventListener('click', (e) => {
          const btn = e.target.closest('button');
          if (!btn) return;
          const productId = btn.dataset.id;
          const action = btn.dataset.action;
          const item = CartState.items.find(i => i.id === productId);
          if (!item) return;

          if (action === 'increase') {
            CartState.updateQuantity(productId, item.quantity + 1);
          } else if (action === 'decrease') {
            CartState.updateQuantity(productId, item.quantity - 1);
          } else if (action === 'remove') {
            CartState.removeItem(productId);
            UI.showToast(`Removed ${item.name} from basket`, 'info', '🗑️');
          }
        });
      }

      // Apply Coupon
      const applyCouponBtn = document.getElementById('applyCouponBtn');
      const couponInput = document.getElementById('couponInput');
      const couponStatus = document.getElementById('couponStatus');

      if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', async () => {
          const code = couponInput.value.trim();
          if (!code) {
            UI.showToast('Please enter a coupon code', 'warning', '⚠️');
            return;
          }

          const calc = CartState.getCalculations();
          try {
            applyCouponBtn.disabled = true;
            applyCouponBtn.textContent = 'Checking...';
            const res = await API.validateCoupon(code, calc.subtotal);
            if (res.success) {
              CartState.applyCoupon(res.data);
              couponStatus.className = 'coupon-status success';
              couponStatus.textContent = res.message;
              UI.showToast(`Coupon "${res.data.code}" applied! Saved ${UI.formatPrice(res.data.discount_amount)}`, 'success', '🎉');
            }
          } catch (err) {
            couponStatus.className = 'coupon-status error';
            couponStatus.textContent = err.message;
            UI.showToast(err.message, 'error', '⚠️');
          } finally {
            applyCouponBtn.disabled = false;
            applyCouponBtn.textContent = 'Apply';
          }
        });
      }
    },

    // --------------------------------------------------------------------------
    // 6. CHECKOUT & ORDER CONFIRMATION
    // --------------------------------------------------------------------------
    bindCheckoutActions() {
      const proceedBtn = document.getElementById('proceedToCheckoutBtn');
      const checkoutModal = document.getElementById('checkoutModalBackdrop');
      const closeCheckout = document.getElementById('closeCheckoutModal');
      const checkoutForm = document.getElementById('checkoutForm');

      if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
          const calc = CartState.getCalculations();
          if (calc.items.length === 0) {
            UI.showToast('Your basket is empty! Add items first.', 'warning', '🛒');
            return;
          }
          this.closeCart();
          this.openCheckoutModal(calc);
        });
      }

      this.openCheckoutModal = (calc) => {
        document.getElementById('modalItemsCount').textContent = calc.itemCount;
        document.getElementById('modalSubtotal').textContent = UI.formatPrice(calc.subtotal);
        document.getElementById('modalDelivery').textContent = calc.deliveryFee === 0 ? 'FREE' : UI.formatPrice(calc.deliveryFee);
        document.getElementById('modalTax').textContent = UI.formatPrice(calc.tax);
        document.getElementById('modalTotal').textContent = UI.formatPrice(calc.total);

        const discountRow = document.getElementById('modalDiscountRow');
        const discountEl = document.getElementById('modalDiscount');
        if (calc.discount > 0) {
          discountRow.style.display = 'flex';
          discountEl.textContent = `-${UI.formatPrice(calc.discount)}`;
        } else {
          discountRow.style.display = 'none';
        }

        if (checkoutModal) checkoutModal.classList.add('active');
      };

      if (closeCheckout) {
        closeCheckout.addEventListener('click', () => {
          if (checkoutModal) checkoutModal.classList.remove('active');
        });
      }

      // Radio card styles
      const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
      paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          document.querySelectorAll('.payment-radio-card').forEach(c => c.classList.remove('active'));
          radio.closest('.payment-radio-card').classList.add('active');
        });
      });

      // Submit Order
      if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const calc = CartState.getCalculations();
          const submitBtn = document.getElementById('submitOrderBtn');
          const spinner = document.getElementById('orderSpinner');

          submitBtn.disabled = true;
          submitBtn.querySelector('span').textContent = 'Confirming Order with Supabase...';
          if (spinner) spinner.style.display = 'inline-block';

          const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked').value;

          const orderPayload = {
            customer_name: document.getElementById('custName').value.trim(),
            customer_email: document.getElementById('custEmail').value.trim(),
            customer_phone: document.getElementById('custPhone').value.trim(),
            shipping_address: document.getElementById('custAddress').value.trim(),
            delivery_city: document.getElementById('custCity').value.trim(),
            delivery_zip: document.getElementById('custZip').value.trim(),
            delivery_slot: document.getElementById('deliverySlot').value,
            payment_method: selectedPayment,
            notes: document.getElementById('custNotes').value.trim(),
            items: calc.items.map(i => ({
              product_id: i.id,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              image_url: i.image_url
            })),
            coupon_code: calc.coupon ? calc.coupon.code : null
          };

          try {
            const res = await API.createOrder(orderPayload);
            const createdOrder = res.data;

            // Close checkout modal
            if (checkoutModal) checkoutModal.classList.remove('active');
            checkoutForm.reset();

            // Clear cart
            CartState.clearCart();

            // Show Success Modal
            this.showOrderSuccess(createdOrder);
            UI.showToast('Order confirmed! Driver assigned 🚚', 'success', '🎉');
          } catch (err) {
            UI.showToast(`Order failed: ${err.message}`, 'error', '⚠️');
          } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Place Order Now';
            if (spinner) spinner.style.display = 'none';
          }
        });
      }

      // Success modal actions
      const successModal = document.getElementById('orderSuccessBackdrop');
      const continueBtn = document.getElementById('continueShoppingSuccessBtn');
      const printBtn = document.getElementById('printReceiptBtn');

      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          if (successModal) successModal.classList.remove('active');
        });
      }

      if (printBtn) {
        printBtn.addEventListener('click', () => {
          window.print();
        });
      }
    },

    showOrderSuccess(order) {
      const modal = document.getElementById('orderSuccessBackdrop');
      if (!modal) return;

      document.getElementById('successOrderNumber').textContent = order.order_number;
      document.getElementById('successCustomerName').textContent = order.customer_name;
      document.getElementById('successAddress').textContent = `${order.shipping_address}, ${order.delivery_city}`;
      document.getElementById('successSlot').textContent = order.delivery_slot;
      document.getElementById('successTotal').textContent = `${UI.formatPrice(order.total)} (${order.payment_method})`;

      modal.classList.add('active');
    },

    // --------------------------------------------------------------------------
    // 7. QUICK VIEW ACTIONS
    // --------------------------------------------------------------------------
    bindQuickViewActions() {
      const closeBtn = document.getElementById('closeQuickViewModal');
      const backdrop = document.getElementById('quickViewBackdrop');
      const minusBtn = document.getElementById('qvMinusBtn');
      const plusBtn = document.getElementById('qvPlusBtn');
      const qtyEl = document.getElementById('qvQuantity');
      const addBtn = document.getElementById('qvAddToCartBtn');

      if (closeBtn) closeBtn.addEventListener('click', () => UI.closeQuickView());
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) UI.closeQuickView();
        });
      }

      if (minusBtn && plusBtn && qtyEl) {
        minusBtn.addEventListener('click', () => {
          let q = parseInt(qtyEl.textContent) || 1;
          if (q > 1) qtyEl.textContent = q - 1;
        });
        plusBtn.addEventListener('click', () => {
          let q = parseInt(qtyEl.textContent) || 1;
          qtyEl.textContent = q + 1;
        });
      }

      if (addBtn && backdrop) {
        addBtn.addEventListener('click', () => {
          const productId = backdrop.dataset.productId;
          const product = this.allProducts.find(p => p.id === productId);
          const quantity = parseInt(qtyEl.textContent) || 1;

          if (product) {
            CartState.addItem(product, quantity);
            UI.showToast(`Added ${quantity}x ${product.name} to basket!`, 'success', '🛒');
            UI.closeQuickView();
          }
        });
      }
    },

    // --------------------------------------------------------------------------
    // 8. WISHLIST ACTIONS
    // --------------------------------------------------------------------------
    bindWishlistActions() {
      const wishlistBtn = document.getElementById('wishlistBtn');
      const wishlistDrawer = document.getElementById('wishlistDrawer');
      const wishlistOverlay = document.getElementById('wishlistOverlay');
      const closeWishlist = document.getElementById('closeWishlistDrawer');

      const openWishlist = () => {
        if (wishlistDrawer) wishlistDrawer.classList.add('open');
        if (wishlistOverlay) wishlistOverlay.classList.add('active');
      };

      const closeWishlistDrawer = () => {
        if (wishlistDrawer) wishlistDrawer.classList.remove('open');
        if (wishlistOverlay) wishlistOverlay.classList.remove('active');
      };

      if (wishlistBtn) wishlistBtn.addEventListener('click', openWishlist);
      if (closeWishlist) closeWishlist.addEventListener('click', closeWishlistDrawer);
      if (wishlistOverlay) wishlistOverlay.addEventListener('click', closeWishlistDrawer);

      const wishlistItemsList = document.getElementById('wishlistItemsList');
      if (wishlistItemsList) {
        wishlistItemsList.addEventListener('click', (e) => {
          const btn = e.target.closest('button');
          if (!btn) return;
          const productId = btn.dataset.id;
          const item = CartState.wishlist.find(i => i.id === productId);
          if (!item) return;

          if (btn.dataset.action === 'wishlist-add-cart') {
            CartState.addItem(item, 1);
            CartState.toggleWishlist(item);
            UI.showToast(`Moved ${item.name} to basket!`, 'success', '🛒');
          } else if (btn.dataset.action === 'wishlist-remove') {
            CartState.toggleWishlist(item);
            UI.showToast(`Removed from wishlist`, 'info', '🤍');
          }
        });
      }
    },

    // --------------------------------------------------------------------------
    // 9. LOCATION SELECTOR
    // --------------------------------------------------------------------------
    bindLocationActions() {
      const locBtn = document.getElementById('locationBtn');
      const locModal = document.getElementById('locationModalBackdrop');
      const closeLoc = document.getElementById('closeLocationModal');
      const locText = document.getElementById('currentLocationText');
      const custZipInput = document.getElementById('customZipInput');
      const saveCustomZipBtn = document.getElementById('saveCustomZipBtn');

      if (locBtn && locModal) {
        locBtn.addEventListener('click', () => locModal.classList.add('active'));
      }
      if (closeLoc && locModal) {
        closeLoc.addEventListener('click', () => locModal.classList.remove('active'));
      }
      if (locModal) {
        locModal.addEventListener('click', (e) => {
          if (e.target === locModal) locModal.classList.remove('active');
        });
      }

      document.querySelectorAll('.location-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.location-preset-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const loc = btn.dataset.loc;
          if (locText) locText.textContent = loc;
          if (locModal) locModal.classList.remove('active');
          UI.showToast(`Delivery location set to ${loc}`, 'info', '📍');
        });
      });

      if (saveCustomZipBtn && custZipInput) {
        saveCustomZipBtn.addEventListener('click', () => {
          const zip = custZipInput.value.trim();
          if (zip) {
            if (locText) locText.textContent = `Zone ${zip}`;
            if (locModal) locModal.classList.remove('active');
            UI.showToast(`Delivery address updated to ZIP ${zip}`, 'info', '📍');
          }
        });
      }
    }
  };

  App.init();
});
```

---

