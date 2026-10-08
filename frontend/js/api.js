/**
 * FreshCart API Client
 * Wraps backend endpoints for Products, Categories, Orders, Coupons, Auth, and Admin Stats.
 */
const API = {
  baseUrl: '/api',

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
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
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
