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
