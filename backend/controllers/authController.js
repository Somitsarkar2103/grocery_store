const { getSupabase, fallbackDb } = require('../config/supabase');
const { hashPassword, verifyPassword, generateToken } = require('../utils/authHelper');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Valid email address is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const supabase = getSupabase();
    let existingUser = null;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email')
          .ilike('email', normalizedEmail)
          .maybeSingle();
        if (!error && data) existingUser = data;
      } catch (e) {}
    }

    if (!existingUser && fallbackDb.users) {
      existingUser = fallbackDb.users.find(u => u.email.toLowerCase() === normalizedEmail);
    }

    if (existingUser) {
      return res.status(409).json({ success: false, error: 'An account with this email address already exists' });
    }

    const { hash, salt } = hashPassword(password);
    const userId = `usr-${Date.now()}`;
    const newUser = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      phone: (phone || '').trim(),
      role: 'user', // Default customer role
      password_hash: hash,
      salt: salt,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .insert([newUser])
          .select('id, name, email, phone, role, created_at')
          .single();
        if (!error && data) {
          const token = generateToken({ userId: data.id, email: data.email, role: data.role });
          return res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: data
          });
        }
      } catch (e) {
        console.warn('[Register] Supabase insert failed, saving to fallback:', e.message);
      }
    }

    fallbackDb.users.unshift(newUser);
    const token = generateToken({ userId: newUser.id, email: newUser.email, role: newUser.role });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        created_at: newUser.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const supabase = getSupabase();
    let user = null;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .ilike('email', normalizedEmail)
          .maybeSingle();
        if (!error && data) user = data;
      } catch (e) {}
    }

    if (!user && fallbackDb.users) {
      user = fallbackDb.users.find(u => u.email.toLowerCase() === normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role || 'user' });

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || 'user',
        created_at: user.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/auth/admin-login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Admin username/email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const supabase = getSupabase();
    let user = null;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .ilike('email', normalizedEmail)
          .maybeSingle();
        if (!error && data) user = data;
      } catch (e) {}
    }

    if (!user && fallbackDb.users) {
      user = fallbackDb.users.find(u => u.email.toLowerCase() === normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid administrator credentials' });
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid administrator credentials' });
    }

    // STRICT ROLE CHECK
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied: This account does not possess administrator privileges. Please use User Login.'
      });
    }

    const token = generateToken({ userId: user.id, email: user.email, role: 'admin' });

    res.json({
      success: true,
      message: 'Admin authentication verified',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'admin',
        created_at: user.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

// GET /api/auth/users (Admin only)
const getUsers = async (req, res) => {
  try {
    const supabase = getSupabase();
    let usersList = [];
    let ordersList = fallbackDb.orders || [];

    if (supabase) {
      try {
        const [usersRes, ordersRes] = await Promise.all([
          supabase.from('users').select('id, name, email, phone, role, created_at').order('created_at', { ascending: false }),
          supabase.from('orders').select('customer_email, total')
        ]);
        if (!usersRes.error && usersRes.data) {
          usersList = usersRes.data;
        }
        if (!ordersRes.error && ordersRes.data) {
          ordersList = ordersRes.data;
        }
      } catch (e) {}
    }

    if (usersList.length === 0 && fallbackDb.users) {
      usersList = fallbackDb.users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role || 'user',
        created_at: u.created_at
      }));
    }

    // Aggregate orders stats per user
    const usersWithStats = usersList.map(u => {
      const userOrders = ordersList.filter(o => o.customer_email && o.customer_email.toLowerCase() === u.email.toLowerCase());
      const totalSpend = userOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
      return {
        ...u,
        orders_count: userOrders.length,
        total_spend: parseFloat(totalSpend.toFixed(2))
      };
    });

    res.json({
      success: true,
      data: usersWithStats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PATCH /api/auth/users/:id/role (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Role must be either "user" or "admin"' });
    }

    // Safety: ensure we don't demote the requesting admin if they are the only admin
    if (req.user.id === id && role !== 'admin') {
      const allAdmins = (fallbackDb.users || []).filter(u => u.role === 'admin');
      if (allAdmins.length <= 1) {
        return res.status(400).json({ success: false, error: 'Cannot remove administrative access from the only active administrator' });
      }
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .update({ role })
          .eq('id', id)
          .select('id, name, email, phone, role, created_at')
          .single();
        if (!error && data) {
          return res.json({ success: true, message: `User role updated to ${role}`, data });
        }
      } catch (e) {}
    }

    const userIndex = (fallbackDb.users || []).findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    fallbackDb.users[userIndex].role = role;
    const updated = {
      id: fallbackDb.users[userIndex].id,
      name: fallbackDb.users[userIndex].name,
      email: fallbackDb.users[userIndex].email,
      phone: fallbackDb.users[userIndex].phone,
      role: fallbackDb.users[userIndex].role,
      created_at: fallbackDb.users[userIndex].created_at
    };

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  getMe,
  getUsers,
  updateUserRole
};
