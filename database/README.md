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
