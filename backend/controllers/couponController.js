const { getSupabase, fallbackDb } = require('../config/supabase');

// GET /api/coupons
const getCoupons = async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('coupons').select('*').order('created_at', { ascending: false });
        if (!showAll) {
          query = query.eq('is_active', true);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return res.json({ success: true, data });
        }
      } catch (err) {
        console.warn('[Coupons] Supabase query failed:', err.message);
      }
    }

    const coupons = showAll ? fallbackDb.coupons : fallbackDb.coupons.filter(c => c.is_active);
    res.json({
      success: true,
      data: coupons
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

// POST /api/coupons (Admin only)
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discount_percent = 0,
      discount_amount = 0,
      min_order_value = 299.00,
      is_active = true
    } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, error: 'Coupon code is required' });
    }

    const normalizedCode = code.trim().toUpperCase();
    const parsedMinOrder = min_order_value !== undefined && min_order_value !== null ? parseFloat(min_order_value) : 299.00;

    const newCoupon = {
      id: `cpn-${Date.now()}`,
      code: normalizedCode,
      discount_percent: parseInt(discount_percent) || 0,
      discount_amount: parseFloat(discount_amount) || 0,
      min_order_value: isNaN(parsedMinOrder) ? 299.00 : parsedMinOrder,
      is_active: Boolean(is_active),
      created_at: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('coupons').insert([newCoupon]).select().single();
        if (!error && data) {
          return res.status(201).json({ success: true, message: `Offer "${normalizedCode}" created successfully`, data });
        }
      } catch (e) {
        console.warn('[Create Coupon] Supabase failed, storing in fallback:', e.message);
      }
    }

    // Check duplicate in fallback
    const exists = fallbackDb.coupons.some(c => c.code.toUpperCase() === normalizedCode);
    if (exists) {
      return res.status(409).json({ success: false, error: `Coupon code "${normalizedCode}" already exists` });
    }

    fallbackDb.coupons.unshift(newCoupon);
    res.status(201).json({
      success: true,
      message: `Offer "${normalizedCode}" created successfully`,
      data: newCoupon
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/coupons/:id (Admin only)
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount_percent, discount_amount, min_order_value, is_active } = req.body;

    const updates = {};
    if (code) updates.code = code.trim().toUpperCase();
    if (discount_percent !== undefined) updates.discount_percent = parseInt(discount_percent);
    if (discount_amount !== undefined) updates.discount_amount = parseFloat(discount_amount);
    if (min_order_value !== undefined) updates.min_order_value = parseFloat(min_order_value);
    if (is_active !== undefined) updates.is_active = Boolean(is_active);

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .update(updates)
          .or(`id.eq.${id},code.ilike.${id}`)
          .select()
          .single();
        if (!error && data) {
          return res.json({ success: true, message: 'Offer updated successfully', data });
        }
      } catch (e) {}
    }

    const index = fallbackDb.coupons.findIndex(c => c.id === id || c.code.toUpperCase() === id.toUpperCase());
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Offer not found' });
    }

    fallbackDb.coupons[index] = { ...fallbackDb.coupons[index], ...updates };
    res.json({
      success: true,
      message: 'Offer updated successfully',
      data: fallbackDb.coupons[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/coupons/:id (Admin only)
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('coupons').delete().or(`id.eq.${id},code.ilike.${id}`);
        if (!error) {
          return res.json({ success: true, message: 'Offer deleted successfully' });
        }
      } catch (e) {}
    }

    const prevLen = fallbackDb.coupons.length;
    fallbackDb.coupons = fallbackDb.coupons.filter(c => c.id !== id && c.code.toUpperCase() !== id.toUpperCase());
    if (fallbackDb.coupons.length === prevLen) {
      return res.status(404).json({ success: false, error: 'Offer not found' });
    }

    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PATCH /api/coupons/:id/toggle (Admin only)
const toggleCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const index = fallbackDb.coupons.findIndex(c => c.id === id || c.code.toUpperCase() === id.toUpperCase());
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Offer not found' });
    }

    const newStatus = !fallbackDb.coupons[index].is_active;
    fallbackDb.coupons[index].is_active = newStatus;

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('coupons').update({ is_active: newStatus }).or(`id.eq.${id},code.ilike.${id}`);
      } catch (e) {}
    }

    res.json({
      success: true,
      message: `Offer ${newStatus ? 'enabled' : 'disabled'} successfully`,
      data: fallbackDb.coupons[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon
};
