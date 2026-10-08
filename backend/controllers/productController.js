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
