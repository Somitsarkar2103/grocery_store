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
        error: `Coupon "${normalizedCode}" requires a minimum order of ₹${coupon.min_order_value.toFixed(2)} (Current subtotal: ₹${orderSubtotal.toFixed(2)})`
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
