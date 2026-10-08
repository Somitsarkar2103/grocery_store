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

        if (!error && data) {
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
