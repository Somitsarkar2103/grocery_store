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
