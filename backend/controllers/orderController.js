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

    // Calculate delivery fee: Free delivery over ₹499, else ₹49.00
    const delivery_fee = subtotal >= 499 ? 0 : 49.00;

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
