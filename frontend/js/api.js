/**
 * FreshCart API Client
 * Wraps backend endpoints for Products, Categories, Orders, Coupons, Auth, and Admin Stats.
 */
const API = {
  baseUrl: (function() {
    if (typeof window !== 'undefined') {
      if (window.__API_BASE_URL__) return window.__API_BASE_URL__;
      try {
        const stored = localStorage.getItem('freshcart_api_url');
        if (stored) return stored;
      } catch (e) {}
      // If frontend is accessed from a different origin/port (e.g. Vite :5173, LiveServer :5500, or file://)
      if (window.location) {
        if (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '5000')) {
          return 'http://localhost:5000/api';
        }
      }
    }
    return '/api';
  })(),

  getToken() {
    try {
      return localStorage.getItem('freshcart_auth_token') || null;
    } catch (e) {
      return null;
    }
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error(`Invalid response from server (${response.status} ${response.statusText})`);
      }

      if (!response.ok) {
        throw new Error((data && data.error) || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  },

  // Health & Supabase Status
  async getHealth() {
    return this.request('/health');
  },

  // Authentication
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async adminLogin(email, password) {
    return this.request('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async getMe() {
    return this.request('/auth/me');
  },

  async getUsers() {
    return this.request('/auth/users');
  },

  async updateUserRole(id, role) {
    return this.request(`/auth/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
  },

  // Categories
  async getCategories() {
    return this.request('/categories');
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/products${queryString}`);
  },

  async getProductById(id) {
    return this.request(`/products/${id}`);
  },

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(id, updates) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Coupons / Offers
  async getCoupons(showAll = false) {
    return this.request(showAll ? '/coupons?all=true' : '/coupons');
  },

  async validateCoupon(code, subtotal) {
    return this.request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal })
    });
  },

  async createCoupon(couponData) {
    return this.request('/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData)
    });
  },

  async updateCoupon(id, updates) {
    return this.request(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteCoupon(id) {
    return this.request(`/coupons/${id}`, {
      method: 'DELETE'
    });
  },

  async toggleCoupon(id) {
    return this.request(`/coupons/${id}/toggle`, {
      method: 'PATCH'
    });
  },

  // Orders
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async getOrders(email = '') {
    const endpoint = email ? `/orders?email=${encodeURIComponent(email)}` : '/orders';
    return this.request(endpoint);
  },

  async getOrderById(id) {
    return this.request(`/orders/${id}`);
  },

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Admin Stats
  async getStats() {
    return this.request('/stats');
  }
};

if (typeof window !== 'undefined') {
  window.API = API;
}

