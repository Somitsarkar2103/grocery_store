const { verifyTokenString } = require('../utils/authHelper');
const { getSupabase, fallbackDb } = require('../config/supabase');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyTokenString(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session token. Please log in again.'
      });
    }

    let user = null;
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, phone, role, created_at')
          .eq('id', decoded.userId)
          .maybeSingle();

        if (!error && data) {
          user = data;
        }
      } catch (err) {
        // Fall through to fallback store
      }
    }

    if (!user && fallbackDb.users) {
      user = fallbackDb.users.find(u => u.id === decoded.userId);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User account not found.'
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'user'
    };

    next();
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Authentication processing error' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Administrator privileges required.'
    });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyTokenString(token);
      if (decoded && decoded.userId) {
        let user = null;
        const supabase = getSupabase();
        if (supabase) {
          try {
            const { data, error } = await supabase
              .from('users')
              .select('id, name, email, phone, role, created_at')
              .eq('id', decoded.userId)
              .maybeSingle();
            if (!error && data) user = data;
          } catch (e) {}
        }
        if (!user && fallbackDb.users) {
          user = fallbackDb.users.find(u => u.id === decoded.userId);
        }
        if (user) {
          req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role || 'user'
          };
        }
      }
    }
  } catch (e) {}
  next();
};

module.exports = {
  authenticateUser,
  requireAdmin,
  optionalAuth
};
