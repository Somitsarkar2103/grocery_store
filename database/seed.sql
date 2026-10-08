-- ==============================================================================
-- SUPABASE POSTGRESQL SEED DATA FOR ONLINE GROCERY STORE (INDIAN RUPEES ₹)
-- ==============================================================================
-- Run this script in the Supabase SQL Editor after running schema.sql
-- ==============================================================================

-- 1. INSERT CATEGORIES
INSERT INTO categories (id, name, slug, icon, image_url, description, item_count)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Fresh Produce', 'fruits-vegetables', 'apple', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80', 'Crisp farm-fresh organic vegetables, leafy greens and juicy seasonal fruits.', 6),
    ('c2222222-2222-2222-2222-222222222222', 'Dairy & Eggs', 'dairy-eggs', 'milk', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', 'Grass-fed fresh milk, artisan cheeses, yogurts, and pasture-raised eggs.', 4),
    ('c3333333-3333-3333-3333-333333333333', 'Bakery & Artisan Bread', 'bakery-snacks', 'croissant', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 'Freshly baked sourdough, whole wheat baguettes, muffins, and flaky pastries.', 4),
    ('c4444444-4444-4444-4444-444444444444', 'Beverages & Juices', 'beverages', 'cup-soda', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80', 'Cold-pressed natural juices, kombucha, specialty herbal teas, and roasts.', 3),
    ('c5555555-5555-5555-5555-555555555555', 'Pantry & Organic Staples', 'organic-pantry', 'wheat', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 'Cold-pressed extra virgin olive oils, Himalayan pink salt, quinoa, grains & pulses.', 4),
    ('c6666666-6666-6666-6666-666666666666', 'Meat & Wild Seafood', 'meat-seafood', 'fish', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', 'Sustainably raised meats, organic poultry cuts, and fresh wild-caught salmon fillets.', 3)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    image_url = EXCLUDED.image_url,
    item_count = EXCLUDED.item_count;

-- 2. INSERT PRODUCTS (PRICES IN INR ₹)
INSERT INTO products (id, category_id, name, slug, description, price, original_price, discount_percent, unit, stock, rating, review_count, image_url, is_organic, is_featured, is_popular, badge, nutrition)
VALUES
    -- Produce
    ('p1010001-0000-0000-0000-000000000001', 'c1111111-1111-1111-1111-111111111111', 
     'Organic Honeycrisp Apples', 'organic-honeycrisp-apples', 
     'Extra juicy, hand-picked crisp Honeycrisp apples from local organic orchards. Perfect for snacking, fruit salads, and baking.',
     120.00, 150.00, 20, '1 kg (approx 4-5 pcs)', 85, 4.9, 142,
     'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Organic',
     '{"calories": "52 kcal", "protein": "0.3g", "carbs": "14g", "fiber": "2.4g"}'::jsonb),

    ('p1010002-0000-0000-0000-000000000002', 'c1111111-1111-1111-1111-111111111111',
     'Fresh Hass Avocados (Ripe & Ready)', 'fresh-hass-avocados',
     'Creamy and rich Hass avocados, perfect for freshly smashed guacamole, toast, or keto bowls.',
     180.00, 240.00, 25, '3 pack (approx 450g)', 60, 4.8, 98,
     'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Best Seller',
     '{"calories": "160 kcal", "healthy_fats": "15g", "carbs": "9g", "fiber": "7g"}'::jsonb),

    ('p1010003-0000-0000-0000-000000000003', 'c1111111-1111-1111-1111-111111111111',
     'Organic Baby Spinach Leaves', 'organic-baby-spinach',
     'Tender, pre-washed triple-rinsed organic baby spinach leaves packed with iron and essential nutrients.',
     40.00, 50.00, 20, '250g clamshell', 110, 4.7, 76,
     'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
     true, false, true, 'Fresh Today',
     '{"calories": "23 kcal", "iron": "2.7mg", "protein": "2.9g", "vitamin_a": "188%"}'::jsonb),

    ('p1010004-0000-0000-0000-000000000004', 'c1111111-1111-1111-1111-111111111111',
     'Sweet Cavendish Bananas', 'sweet-cavendish-bananas',
     'Naturally ripened high-potassium bananas with vibrant yellow peels and smooth, sweet texture.',
     50.00, 65.00, 23, '1 bunch (approx 1.2 kg)', 150, 4.9, 210,
     'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
     false, false, true, 'Value Pack',
     '{"calories": "89 kcal", "potassium": "358mg", "carbs": "23g", "sugar": "12g"}'::jsonb),

    ('p1010005-0000-0000-0000-000000000005', 'c1111111-1111-1111-1111-111111111111',
     'Cherry Vine Tomatoes', 'cherry-vine-tomatoes',
     'Sweet and aromatic cherry tomatoes on the vine, delivering burst-in-mouth sweetness for salads.',
     60.00, 75.00, 20, '400g pack', 75, 4.8, 64,
     'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
     true, false, false, 'Organic',
     '{"calories": "18 kcal", "vitamin_c": "22%", "carbs": "3.9g", "fiber": "1.2g"}'::jsonb),

    ('p1010006-0000-0000-0000-000000000006', 'c1111111-1111-1111-1111-111111111111',
     'Crisp Fresh Broccoli Crowns', 'crisp-fresh-broccoli-crowns',
     'Farm-fresh deep green broccoli florets with dense crowns, rich in antioxidants and Vitamin K.',
     70.00, 85.00, 18, '500g', 90, 4.6, 52,
     'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80',
     true, false, false, 'Farm Direct',
     '{"calories": "34 kcal", "protein": "2.8g", "fiber": "2.6g", "vitamin_c": "148%"}'::jsonb),

    -- Dairy & Eggs
    ('p2020001-0000-0000-0000-000000000001', 'c2222222-2222-2222-2222-222222222222',
     'Organic Whole Grass-Fed Milk', 'organic-whole-grass-fed-milk',
     'Pure unhomogenized grass-fed whole milk from family-owned pasture farms. Rich in Omega-3 and calcium.',
     60.00, 70.00, 14, '1 Liter', 45, 4.9, 185,
     'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Top Pick',
     '{"calories": "150 kcal", "calcium": "300mg", "protein": "8g", "fat": "8g"}'::jsonb),

    ('p2020002-0000-0000-0000-000000000002', 'c2222222-2222-2222-2222-222222222222',
     'Pasture-Raised Grade A Large Eggs', 'pasture-raised-large-eggs',
     'Certified humane pasture-raised eggs with vibrant deep orange yolks and superior rich flavor.',
     95.00, 110.00, 14, '12 pcs carton', 80, 5.0, 312,
     'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Best Seller',
     '{"calories": "70 kcal", "protein": "6g", "choline": "147mg", "fat": "5g"}'::jsonb),

    ('p2020003-0000-0000-0000-000000000003', 'c2222222-2222-2222-2222-222222222222',
     'Artisan Greek Yogurt (Plain 5% Fat)', 'artisan-greek-yogurt-plain',
     'Thick, velvety authentic strained Greek yogurt with 18g of gut-friendly natural active protein per cup.',
     120.00, 140.00, 14, '400g tub', 55, 4.8, 92,
     'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
     true, false, true, 'Healthy Choice',
     '{"calories": "170 kcal", "protein": "18g", "probiotics": "6 Live Strains"}'::jsonb),

    ('p2020004-0000-0000-0000-000000000004', 'c2222222-2222-2222-2222-222222222222',
     'Aged Sharp Cheddar Cheese Block', 'aged-sharp-cheddar-block',
     'Aged naturally for 18 months in caves for bold savory depth and smooth crumbly bite.',
     190.00, 230.00, 17, '200g block', 40, 4.9, 88,
     'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=600&q=80',
     false, false, false, 'Artisan',
     '{"calories": "110 kcal", "protein": "7g", "fat": "9g", "calcium": "20%"}'::jsonb),

    -- Bakery & Bread
    ('p3030001-0000-0000-0000-000000000001', 'c3333333-3333-3333-3333-333333333333',
     'Artisan Sourdough Boule', 'artisan-sourdough-boule',
     'Slowly fermented for 36 hours with wild sourdough starter, baked in a hearth oven with blistered crust.',
     110.00, 130.00, 15, '400g loaf', 35, 4.9, 115,
     'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Fresh Baked',
     '{"calories": "140 kcal", "carbs": "28g", "protein": "5g", "fermented": "Yes"}'::jsonb),

    ('p3030002-0000-0000-0000-000000000002', 'c3333333-3333-3333-3333-333333333333',
     'French Butter Croissants (4-Pack)', 'french-butter-croissants-4pack',
     'Flaky, golden-layered French all-butter croissants that melt in your mouth when toasted.',
     140.00, 165.00, 15, '4 pcs pack (320g)', 30, 4.8, 79,
     'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
     false, true, false, 'Bakery Special',
     '{"calories": "260 kcal", "fat": "14g", "carbs": "29g", "protein": "5g"}'::jsonb),

    ('p3030003-0000-0000-0000-000000000003', 'c3333333-3333-3333-3333-333333333333',
     'Organic Whole Grain Seeded Loaf', 'organic-whole-grain-seeded-loaf',
     'Wholesome bread loaf packed with flaxseeds, chia seeds, sunflower seeds, and rolled oats for prolonged energy.',
     45.00, 55.00, 18, '400g loaf', 50, 4.7, 63,
     'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
     true, false, false, 'High Fiber',
     '{"calories": "110 kcal", "fiber": "5g", "protein": "5g", "sugar": "1g"}'::jsonb),

    ('p3030004-0000-0000-0000-000000000004', 'c3333333-3333-3333-3333-333333333333',
     'Wholesome Digestive Biscuits', 'wholesome-digestive-biscuits',
     'Crispy, fibre-rich baked whole wheat digestive biscuits. Perfect evening tea companion with zero trans fat.',
     30.00, 35.00, 14, '200g pack', 120, 4.8, 85,
     'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
     false, true, true, 'Daily Essential',
     '{"calories": "70 kcal per biscuit", "fiber": "1.2g", "sugar": "2.5g", "whole_wheat": "65%"}'::jsonb),

    -- Beverages
    ('p4040001-0000-0000-0000-000000000001', 'c4444444-4444-4444-4444-444444444444',
     'Cold-Pressed 100% Valencia Orange Juice', 'cold-pressed-orange-juice',
     'Freshly squeezed pure sweet Valencia oranges with light natural pulp. No added sugars.',
     130.00, 160.00, 19, '1 Liter Bottle', 65, 4.9, 134,
     'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80',
     true, true, true, '100% Pure',
     '{"calories": "110 kcal", "vitamin_c": "200%", "carbs": "26g", "sugar": "22g natural"}'::jsonb),

    ('p4040002-0000-0000-0000-000000000002', 'c4444444-4444-4444-4444-444444444444',
     'Organic Raw Ginger-Lemon Kombucha', 'organic-ginger-lemon-kombucha',
     'Sparkling fermented black tea with zesty ginger root and tart lemon. Packed with living digestive probiotics.',
     120.00, 145.00, 17, '350ml', 80, 4.8, 97,
     'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
     true, false, true, 'Probiotic',
     '{"calories": "40 kcal", "probiotics": "2 Billion CFU", "sugar": "8g"}'::jsonb),

    ('p4040003-0000-0000-0000-000000000003', 'c4444444-4444-4444-4444-444444444444',
     'Cold Brew Specialty Single Origin Coffee', 'cold-brew-single-origin-coffee',
     'Steeped for 20 hours with organic beans for a smooth, chocolatey, low-acidity brew.',
     150.00, 180.00, 17, '500ml', 50, 4.9, 108,
     'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
     true, false, false, 'Artisan Roast',
     '{"calories": "5 kcal", "caffeine": "180mg", "sugar": "0g"}'::jsonb),

    -- Pantry
    ('p5050001-0000-0000-0000-000000000001', 'c5555555-5555-5555-5555-555555555555',
     'Extra Virgin Cold-Pressed Olive Oil', 'extra-virgin-olive-oil-greek',
     'First cold press olives. Under 0.2% acidity with spicy peppery finish.',
     550.00, 680.00, 19, '500ml glass bottle', 45, 5.0, 240,
     'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Award Winner',
     '{"calories": "120 kcal per tbsp", "polyphenols": "High", "fats": "14g"}'::jsonb),

    ('p5050002-0000-0000-0000-000000000002', 'c5555555-5555-5555-5555-555555555555',
     'Organic Royal Tri-Color Quinoa', 'organic-royal-tri-color-quinoa',
     'Pre-washed blend of white, red, and black quinoa grains. High complete plant protein.',
     280.00, 340.00, 18, '1 kg pouch', 70, 4.8, 85,
     'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
     true, false, false, 'Superfood',
     '{"calories": "170 kcal", "protein": "6g", "fiber": "3g", "iron": "15%"}'::jsonb),

    ('p5050003-0000-0000-0000-000000000003', 'c5555555-5555-5555-5555-555555555555',
     'Raw Organic Wildflower Forest Honey', 'raw-wildflower-forest-honey',
     'Unfiltered, unpasteurized amber honey harvested sustainably from pristine mountain apiaries.',
     240.00, 300.00, 20, '500g jar', 60, 4.9, 163,
     'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Raw & Pure',
     '{"calories": "60 kcal per tbsp", "enzymes": "Active", "sugar": "16g natural"}'::jsonb),

    ('p5050004-0000-0000-0000-000000000004', 'c5555555-5555-5555-5555-555555555555',
     'Premium Royal Basmati Rice', 'premium-royal-basmati-rice',
     'Aged aromatic long-grain basmati rice harvested from the Himalayan foothills. Naturally fluffy and non-sticky.',
     80.00, 95.00, 16, '1 kg pack', 100, 4.9, 160,
     'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
     true, true, true, 'Kitchen Staple',
     '{"calories": "130 kcal per 100g", "carbs": "28g", "protein": "2.7g", "fat": "0.3g"}'::jsonb),

    -- Meat & Wild Seafood
    ('p6060001-0000-0000-0000-000000000001', 'c6666666-6666-6666-6666-666666666666',
     'Wild-Caught Alaskan Sockeye Salmon Fillet', 'wild-alaskan-salmon-fillet',
     'Sustainably line-caught vibrant red salmon fillet, packed with heart-healthy Omega-3 fatty acids.',
     650.00, 780.00, 17, '450g skin-on fillet', 35, 4.9, 192,
     'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
     false, true, true, 'Chef Selection',
     '{"calories": "220 kcal", "protein": "27g", "omega_3": "1400mg", "fat": "11g"}'::jsonb),

    ('p6060002-0000-0000-0000-000000000002', 'c6666666-6666-6666-6666-666666666666',
     'Organic Free-Range Boneless Chicken Breasts', 'organic-free-range-chicken-breasts',
     'Humanely raised antibiotic-free and hormone-free tender lean chicken breast fillets.',
     180.00, 220.00, 18, '500g tray', 50, 4.8, 145,
     'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
     true, false, true, 'Organic Meat',
     '{"calories": "165 kcal", "protein": "31g", "fat": "3.6g", "iron": "6%"}'::jsonb),

    ('p6060003-0000-0000-0000-000000000003', 'c6666666-6666-6666-6666-666666666666',
     'Grass-Fed Angus Beef Ribeye Steak', 'grass-fed-angus-ribeye-steak',
     '100% pasture-raised tender beef ribeye steak with exquisite marbling and robust depth of flavor.',
     450.00, 520.00, 13, '340g cut', 25, 5.0, 118,
     'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
     false, true, false, 'Premium Cut',
     '{"calories": "291 kcal", "protein": "24g", "fat": "21g", "iron": "15%"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    stock = EXCLUDED.stock,
    image_url = EXCLUDED.image_url;

-- 3. INSERT COUPONS (IN INR ₹)
INSERT INTO coupons (code, discount_percent, discount_amount, min_order_value, is_active)
VALUES
    ('FRESH20', 20, 0, 399.00, true),
    ('ORGANIC15', 15, 0, 499.00, true),
    ('SAVE10', 10, 0, 299.00, true),
    ('FREESHIP', 0, 49.00, 499.00, true)
ON CONFLICT (code) DO NOTHING;

-- 4. INSERT SAMPLE REVIEWS
INSERT INTO reviews (product_id, user_name, rating, comment)
VALUES
    ('p1010001-0000-0000-0000-000000000001', 'Aarav Sharma', 5, 'Best Honeycrisp apples I have ever ordered online! Crisp, huge, and very fresh.'),
    ('p1010002-0000-0000-0000-000000000002', 'Priya Patel', 5, 'Avocados arrived perfectly ripe and unbruised. Super creamy texture.'),
    ('p2020002-0000-0000-0000-000000000002', 'Rohan Mehta', 5, 'You can genuinely taste the difference with pasture-raised eggs. Beautiful dark yolks.'),
    ('p5050001-0000-0000-0000-000000000001', 'Ananya Iyer', 5, 'Authentic cold pressed olive oil. Notes of grass and pepper. Outstanding value.'),
    ('p5050004-0000-0000-0000-000000000004', 'Vikram Singh', 5, 'The Basmati rice grains are super long and fragrant. Highly recommended!')
ON CONFLICT DO NOTHING;
