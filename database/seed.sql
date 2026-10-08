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
