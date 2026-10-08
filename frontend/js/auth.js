/**
 * FreshCart Authentication & Role-Based Access Control State
 */
const Auth = {
  TOKEN_KEY: 'freshcart_auth_token',
  USER_KEY: 'freshcart_user',

  token: null,
  user: null,

  init() {
    try {
      this.token = localStorage.getItem(this.TOKEN_KEY) || null;
      const userStr = localStorage.getItem(this.USER_KEY);
      this.user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.warn('Error reading auth state from localStorage:', e);
      this.token = null;
      this.user = null;
    }
  },

  getToken() {
    return this.token || localStorage.getItem(this.TOKEN_KEY) || null;
  },

  getUser() {
    if (!this.user) {
      const userStr = localStorage.getItem(this.USER_KEY);
      if (userStr) {
        try { this.user = JSON.parse(userStr); } catch (e) {}
      }
    }
    return this.user;
  },

  setSession(user, token) {
    this.user = user;
    this.token = token;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, token);
  },

  clearSession() {
    this.user = null;
    this.token = null;
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  },

  isAuthenticated() {
    return Boolean(this.getToken() && this.getUser());
  },

  isAdmin() {
    const user = this.getUser();
    return Boolean(this.isAuthenticated() && user && user.role === 'admin');
  },

  isCustomer() {
    const user = this.getUser();
    return Boolean(this.isAuthenticated() && user && user.role === 'user');
  },

  async login(email, password) {
    const res = await API.login(email, password);
    if (res.success && res.token && res.user) {
      this.setSession(res.user, res.token);
      return res.user;
    }
    throw new Error(res.error || 'Login failed');
  },

  async adminLogin(email, password) {
    const res = await API.adminLogin(email, password);
    if (res.success && res.token && res.user) {
      if (res.user.role !== 'admin') {
        throw new Error('Access denied: You do not have administrator privileges.');
      }
      this.setSession(res.user, res.token);
      return res.user;
    }
    throw new Error(res.error || 'Admin login failed');
  },

  async register(userData) {
    const res = await API.register(userData);
    if (res.success && res.token && res.user) {
      this.setSession(res.user, res.token);
      return res.user;
    }
    throw new Error(res.error || 'Registration failed');
  },

  logout(redirectPath = '/') {
    this.clearSession();
    window.location.href = redirectPath;
  },

  /**
   * Route guard for Admin pages (/admin, admin.html)
   */
  requireAdminGuard() {
    if (!this.isAuthenticated()) {
      sessionStorage.setItem('freshcart_admin_redirect', window.location.pathname);
      window.location.href = '/admin-login';
      return false;
    }

    if (!this.isAdmin()) {
      alert('Access Denied: You are signed in as a customer and do not have administrator permissions.');
      window.location.href = '/user-login';
      return false;
    }

    return true;
  },

  /**
   * Renders the authentication navigation block in header
   */
  renderHeader(containerId = 'headerAuthContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = this.getUser();

    if (this.isAuthenticated() && user) {
      const isAdm = user.role === 'admin';
      const initials = (user.name || 'User')
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      container.innerHTML = `
        <div class="user-auth-menu" id="userAuthMenu">
          <button class="user-profile-trigger-btn" id="userProfileTrigger" title="Account (${user.role})">
            <span class="user-avatar-circle ${isAdm ? 'admin-avatar' : ''}">${initials}</span>
            <span class="user-display-name">${user.name.split(' ')[0]}</span>
            <span class="user-role-badge ${isAdm ? 'badge-admin' : 'badge-user'}">${isAdm ? 'Admin' : 'Customer'}</span>
            <svg class="chevron-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="user-dropdown-card" id="userDropdownCard" style="display: none;">
            <div class="dropdown-user-header">
              <div class="dropdown-avatar">${initials}</div>
              <div class="dropdown-info">
                <strong>${user.name}</strong>
                <span>${user.email}</span>
                <span class="dropdown-role-pill ${isAdm ? 'pill-admin' : 'pill-user'}">${isAdm ? 'Administrator' : 'Verified Customer'}</span>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <ul class="dropdown-menu-list">
              ${!isAdm ? `
                <li><button class="dropdown-item-btn" id="headerMyOrdersBtn">📦 My Order History</button></li>
                <li><button class="dropdown-item-btn" id="headerProfileBtn">👤 Customer Profile</button></li>
              ` : `
                <li><a href="/admin" class="dropdown-item-btn">🛠️ Admin Dashboard</a></li>
              `}
              <div class="dropdown-divider"></div>
              <li><button class="dropdown-item-btn text-danger" id="headerLogoutBtn">🚪 Log Out</button></li>
            </ul>
          </div>
        </div>
      `;

      // Toggle dropdown
      const trigger = document.getElementById('userProfileTrigger');
      const dropdown = document.getElementById('userDropdownCard');
      if (trigger && dropdown) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', () => {
          dropdown.style.display = 'none';
        });
      }

      // Logout handler
      const logoutBtn = document.getElementById('headerLogoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          Auth.logout(isAdm ? '/admin-login' : '/');
        });
      }

      // Customer Orders trigger
      const myOrdersBtn = document.getElementById('headerMyOrdersBtn');
      if (myOrdersBtn) {
        myOrdersBtn.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('open-customer-orders-modal'));
        });
      }

      // Customer Profile trigger
      const profileBtn = document.getElementById('headerProfileBtn');
      if (profileBtn) {
        profileBtn.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('open-customer-profile-modal'));
        });
      }

    } else {
      // Unauthenticated state
      container.innerHTML = `
        <div class="header-auth-buttons">
          <a href="/user-login" class="btn btn-sm btn-outline auth-btn user-login-link" title="Customer Login">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Sign In</span>
          </a>
        </div>
      `;
    }
  }
};

Auth.init();
