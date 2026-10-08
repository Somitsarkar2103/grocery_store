/**
 * FreshCart Enterprise Admin Management System
 * Handles: Metrics Dashboard, Product Management, Order Pipeline, User Management, Offers & Coupons
 */
const AdminDashboard = {
  activeSection: 'dashboard',
  stats: {},
  products: [],
  orders: [],
  users: [],
  offers: [],
  categories: [],
  _initialized: false,

  init() {
    if (this._initialized) return;
    this._initialized = true;

    // 1. Role-Based Access Control Guard for Admin page
    const isAdminRoute = window.location.pathname.includes('/admin') || window.location.pathname.endsWith('admin.html');
    if (isAdminRoute) {
      if (typeof Auth !== 'undefined') {
        const allowed = Auth.requireAdminGuard();
        if (!allowed) return;

        // Populate sidebar admin user info
        const user = Auth.getUser();
        if (user) {
          const nameEl = document.getElementById('sidebarUserName');
          const avatarEl = document.getElementById('sidebarAvatar');
          if (nameEl) nameEl.textContent = user.name || 'Admin';
          if (avatarEl) {
            avatarEl.textContent = (user.name || 'AD').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
          }
        }
      }

      this.bindEvents();
      this.checkDatabaseConnection();
      this.refreshAllData();
    } else {
      // Store pages: only bind admin navigation triggers if present
      this.bindStoreAdminTriggers();
    }
  },

  bindStoreAdminTriggers() {
    const adminPortalBtn = document.getElementById('adminPortalBtn');
    if (adminPortalBtn && !adminPortalBtn._bound) {
      adminPortalBtn._bound = true;
      adminPortalBtn.addEventListener('click', () => {
        if (typeof Auth !== 'undefined' && Auth.isAdmin()) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/admin-login';
        }
      });
    }

    const footerAdminTrigger = document.getElementById('footerAdminTrigger');
    if (footerAdminTrigger && !footerAdminTrigger._bound) {
      footerAdminTrigger._bound = true;
      footerAdminTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof Auth !== 'undefined' && Auth.isAdmin()) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/admin-login';
        }
      });
    }
  },

  bindEvents() {
    // Sidebar Navigation Switching
    const navButtons = document.querySelectorAll('.admin-nav-item button');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.switchSection(btn.dataset.section);
      });
    });

    // Refresh button
    const refreshBtn = document.getElementById('refreshDashboardBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', () => this.refreshAllData(true));

    // Sidebar Logout
    const logoutBtn = document.getElementById('sidebarLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out of Admin Dashboard?')) {
          if (typeof Auth !== 'undefined') Auth.logout('/admin-login');
        }
      });
    }

    // Modal Events - Product
    const openAddProductBtn = document.getElementById('openAddProductModalBtn');
    const closeProductBtn = document.getElementById('closeProductModalBtn');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    const productModal = document.getElementById('productFormModalBackdrop');
    const productForm = document.getElementById('productEditForm');

    if (openAddProductBtn) openAddProductBtn.addEventListener('click', () => this.openProductModal());
    if (closeProductBtn) closeProductBtn.addEventListener('click', () => this.closeProductModal());
    if (cancelProductBtn) cancelProductBtn.addEventListener('click', () => this.closeProductModal());
    if (productForm) productForm.addEventListener('submit', (e) => this.handleSaveProduct(e));

    // Modal Events - Offer
    const openAddOfferBtn = document.getElementById('openAddOfferModalBtn');
    const closeOfferBtn = document.getElementById('closeOfferModalBtn');
    const cancelOfferBtn = document.getElementById('cancelOfferBtn');
    const offerModal = document.getElementById('offerFormModalBackdrop');
    const offerForm = document.getElementById('offerForm');

    if (openAddOfferBtn) openAddOfferBtn.addEventListener('click', () => this.openOfferModal());
    if (closeOfferBtn) closeOfferBtn.addEventListener('click', () => this.closeOfferModal());
    if (cancelOfferBtn) cancelOfferBtn.addEventListener('click', () => this.closeOfferModal());
    if (offerForm) offerForm.addEventListener('submit', (e) => this.handleSaveOffer(e));

    // Handle Admin Portal button in index.html if on store page
    const adminPortalBtn = document.getElementById('adminPortalBtn');
    if (adminPortalBtn) {
      adminPortalBtn.addEventListener('click', () => {
        if (typeof Auth !== 'undefined' && Auth.isAdmin()) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/admin-login';
        }
      });
    }
  },

  switchSection(sectionId) {
    this.activeSection = sectionId;
    const panels = document.querySelectorAll('.admin-panel');
    panels.forEach(p => p.classList.remove('active'));

    const targetPanel = document.getElementById(`panel${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`);
    if (targetPanel) targetPanel.classList.add('active');

    // Update Top Header
    const titleEl = document.getElementById('currentSectionTitle');
    const descEl = document.getElementById('currentSectionDesc');

    const meta = {
      dashboard: {
        title: 'Store Operations Dashboard',
        desc: 'Real-time metrics, active catalog stats and fulfillment pipeline'
      },
      products: {
        title: 'Product Catalog & Inventory',
        desc: 'Edit prices, stock levels, categories, images and availability status'
      },
      orders: {
        title: 'Customer Orders Fulfillment',
        desc: 'Track order items, view customer shipping details & update statuses'
      },
      users: {
        title: 'Registered User Management',
        desc: 'Inspect registered customer accounts, order history and manage roles'
      },
      offers: {
        title: 'Promotional Offers & Discounts',
        desc: 'Configure coupons, set discount values and minimum order threshold (₹299)'
      }
    };

    if (meta[sectionId] && titleEl && descEl) {
      titleEl.textContent = meta[sectionId].title;
      descEl.textContent = meta[sectionId].desc;
    }

    // Refresh active section data if needed
    if (sectionId === 'products') this.renderProductsTable();
    if (sectionId === 'orders') this.renderOrdersTable();
    if (sectionId === 'users') this.renderUsersTable();
    if (sectionId === 'offers') this.renderOffersTable();
  },

  async checkDatabaseConnection() {
    try {
      const health = await API.getHealth();
      const statusText = document.getElementById('adminDbStatusText');
      const statusPill = document.getElementById('adminDbStatusPill');

      if (health.supabase && health.supabase.connected) {
        if (statusText) statusText.textContent = 'PostgreSQL: Live 🟢';
        if (statusPill) statusPill.style.color = 'var(--success)';
      } else if (health.supabase && health.supabase.urlConfigured) {
        if (statusText) statusText.textContent = 'PostgreSQL: Schema Ready 🟢';
        if (statusPill) statusPill.style.color = 'var(--success)';
      } else {
        if (statusText) statusText.textContent = 'High-Fidelity Storage 🟡';
        if (statusPill) statusPill.style.color = 'var(--accent-hover)';
      }
    } catch (e) {
      console.warn('Could not verify DB health:', e);
    }
  },

  async refreshAllData(showToastNotification = false) {
    try {
      const [statsRes, prodsRes, ordersRes, usersRes, offersRes, catsRes] = await Promise.all([
        API.getStats().catch(() => ({ data: {} })),
        API.getProducts({ limit: 150 }).catch(() => ({ data: [] })),
        API.getOrders().catch(() => ({ data: [] })),
        API.getUsers().catch(() => ({ data: [] })),
        API.getCoupons(true).catch(() => ({ data: [] })),
        API.getCategories().catch(() => ({ data: [] }))
      ]);

      this.stats = statsRes.data || {};
      this.products = prodsRes.data || [];
      this.orders = ordersRes.data || [];
      this.users = usersRes.data || [];
      this.offers = offersRes.data || [];
      this.categories = catsRes.data || [];

      this.renderMetricsCards();
      this.renderDashboardRecentOrders();
      this.renderProductsTable();
      this.renderOrdersTable();
      this.renderUsersTable();
      this.renderOffersTable();
      this.populateCategorySelects();

      if (showToastNotification && typeof UI !== 'undefined') {
        UI.showToast('Dashboard data refreshed successfully!', 'success', '🔄');
      }
    } catch (err) {
      console.error('Error refreshing admin dashboard:', err);
    }
  },

  // --------------------------------------------------------------------------
  // 1. DASHBOARD METRICS
  // --------------------------------------------------------------------------
  renderMetricsCards() {
    const prodCountEl = document.getElementById('metricTotalProducts');
    const userCountEl = document.getElementById('metricTotalUsers');
    const orderCountEl = document.getElementById('metricTotalOrders');
    const revCountEl = document.getElementById('metricTotalRevenue');
    const pendingCountEl = document.getElementById('metricPendingOrders');
    const lowStockCountEl = document.getElementById('metricLowStock');

    const totalRevenue = this.stats.totalRevenue !== undefined ? this.stats.totalRevenue : 
      this.orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

    const totalOrders = this.stats.totalOrders !== undefined ? this.stats.totalOrders : this.orders.length;
    const totalProducts = this.stats.totalProducts !== undefined ? this.stats.totalProducts : this.products.length;
    const totalUsers = this.stats.totalUsers !== undefined ? this.stats.totalUsers : this.users.length;

    const pendingOrders = this.stats.pendingOrders !== undefined ? this.stats.pendingOrders : 
      this.orders.filter(o => ['Order Confirmed', 'Confirmed', 'Pending', 'Preparing', 'Packed'].includes(o.status)).length;

    const lowStock = this.stats.lowStockProducts !== undefined ? this.stats.lowStockProducts : 
      this.products.filter(p => (p.stock || 0) <= 10).length;

    if (prodCountEl) prodCountEl.textContent = totalProducts;
    if (userCountEl) userCountEl.textContent = totalUsers;
    if (orderCountEl) orderCountEl.textContent = totalOrders;
    if (revCountEl) revCountEl.textContent = `₹${parseFloat(totalRevenue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    if (pendingCountEl) pendingCountEl.textContent = pendingOrders;
    if (lowStockCountEl) lowStockCountEl.textContent = lowStock;
  },

  renderDashboardRecentOrders() {
    const tbody = document.getElementById('dashRecentOrdersBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const recent = this.orders.slice(0, 6);
    if (recent.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align: center; padding: 24px;">No customer orders placed yet.</td></tr>`;
      return;
    }

    recent.forEach(order => {
      const tr = document.createElement('tr');
      const itemsText = order.items ? `${order.items.length} items (${order.items.map(i => i.product_name || i.name).slice(0, 2).join(', ')}${order.items.length > 2 ? '...' : ''})` : 'Grocery Basket';
      const statusClass = (order.status || 'Order Confirmed').toLowerCase().replace(/\s+/g, '-');

      tr.innerHTML = `
        <td><strong>${order.order_number}</strong></td>
        <td>
          <strong>${order.customer_name}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${order.customer_email || ''}</div>
        </td>
        <td>
          <div style="max-width: 200px; font-size: 0.82rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
            ${order.shipping_address || 'Delivery Address'}
          </div>
        </td>
        <td><span style="font-size: 0.85rem;">${itemsText}</span></td>
        <td><strong style="color: var(--primary);">₹${parseFloat(order.total).toFixed(2)}</strong></td>
        <td><span class="status-badge ${statusClass}">${order.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  },

  // --------------------------------------------------------------------------
  // 2. PRODUCT MANAGEMENT
  // --------------------------------------------------------------------------
  renderProductsTable() {
    const tbody = document.getElementById('adminProductsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (this.products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-muted" style="text-align: center; padding: 24px;">No products in database.</td></tr>`;
      return;
    }

    this.products.forEach(p => {
      const tr = document.createElement('tr');
      const isAvailable = (p.stock > 0) && (p.is_available !== false);

      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${p.image_url}" alt="${p.name}" class="table-prod-img" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80'">
            <div>
              <strong>${p.name}</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${p.unit || '1 unit'}</div>
            </div>
          </div>
        </td>
        <td>${p.category_name || 'Produce'}</td>
        <td><strong>₹${parseFloat(p.price).toFixed(2)}</strong></td>
        <td>
          ${p.original_price ? `<span style="text-decoration: line-through; color: var(--text-muted);">₹${parseFloat(p.original_price).toFixed(2)}</span>` : '<span class="text-muted">-</span>'}
        </td>
        <td>
          <span style="font-weight: 700; color: ${p.stock <= 10 ? 'var(--danger)' : 'var(--success)'};">
            ${p.stock} units
          </span>
        </td>
        <td>
          ${isAvailable 
            ? '<span class="status-badge confirmed">In Stock</span>' 
            : '<span class="status-badge cancelled">Unavailable</span>'}
        </td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm btn-outline edit-prod-btn" data-id="${p.id}">Edit</button>
            <button class="btn btn-sm btn-outline toggle-avail-btn" data-id="${p.id}" title="${isAvailable ? 'Mark unavailable' : 'Mark available'}">
              ${isAvailable ? 'Set OOS' : 'Restock'}
            </button>
            <button class="btn btn-sm btn-outline delete-prod-btn" data-id="${p.id}" style="color: var(--danger); border-color: var(--danger);">Delete</button>
          </div>
        </td>
      `;

      // Edit Product
      tr.querySelector('.edit-prod-btn').addEventListener('click', () => this.openProductModal(p));

      // Toggle Availability
      tr.querySelector('.toggle-avail-btn').addEventListener('click', async () => {
        const newStock = isAvailable ? 0 : 50;
        try {
          await API.updateProduct(p.id, { stock: newStock, is_available: !isAvailable });
          if (typeof UI !== 'undefined') UI.showToast(`Updated "${p.name}" availability`, 'info', '📦');
          await this.refreshAllData();
        } catch (err) {
          alert('Failed to update availability: ' + err.message);
        }
      });

      // Delete Product
      tr.querySelector('.delete-prod-btn').addEventListener('click', async () => {
        if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
          try {
            await API.deleteProduct(p.id);
            if (typeof UI !== 'undefined') UI.showToast(`Product "${p.name}" deleted`, 'info', '🗑️');
            await this.refreshAllData();
          } catch (err) {
            alert('Failed to delete product: ' + err.message);
          }
        }
      });

      tbody.appendChild(tr);
    });
  },

  openProductModal(product = null) {
    const modal = document.getElementById('productFormModalBackdrop');
    const form = document.getElementById('productEditForm');
    const title = document.getElementById('productModalTitle');
    if (!modal || !form) return;

    form.reset();
    this.populateCategorySelects();

    if (product) {
      title.textContent = `Edit Product: ${product.name}`;
      document.getElementById('editProductId').value = product.id;
      document.getElementById('prodFormName').value = product.name;
      document.getElementById('prodFormCategory').value = product.category_id || '';
      document.getElementById('prodFormPrice').value = product.price;
      document.getElementById('prodFormOriginalPrice').value = product.original_price || '';
      document.getElementById('prodFormUnit').value = product.unit || '1 kg';
      document.getElementById('prodFormStock').value = product.stock || 50;
      document.getElementById('prodFormImage').value = product.image_url;
      document.getElementById('prodFormBadge').value = product.badge || '';
      document.getElementById('prodFormDescription').value = product.description || '';
      document.getElementById('prodFormOrganic').checked = Boolean(product.is_organic);
      document.getElementById('prodFormFeatured').checked = Boolean(product.is_featured);
      document.getElementById('prodFormAvailable').value = product.stock > 0 ? 'true' : 'false';
    } else {
      title.textContent = 'Add New Product';
      document.getElementById('editProductId').value = '';
      document.getElementById('prodFormStock').value = 50;
    }

    modal.style.display = 'flex';
  },

  closeProductModal() {
    const modal = document.getElementById('productFormModalBackdrop');
    if (modal) modal.style.display = 'none';
  },

  async handleSaveProduct(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('saveProductBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    const id = document.getElementById('editProductId').value;
    const catSelect = document.getElementById('prodFormCategory');
    const selectedCat = this.categories.find(c => c.id === catSelect.value);

    const price = parseFloat(document.getElementById('prodFormPrice').value);
    const origPriceVal = document.getElementById('prodFormOriginalPrice').value;
    const origPrice = origPriceVal ? parseFloat(origPriceVal) : null;
    const stock = parseInt(document.getElementById('prodFormStock').value) || 0;
    const isAvail = document.getElementById('prodFormAvailable').value === 'true';

    const payload = {
      name: document.getElementById('prodFormName').value.trim(),
      category_id: catSelect.value,
      category_name: selectedCat ? selectedCat.name : 'Produce',
      category_slug: selectedCat ? selectedCat.slug : 'produce',
      price: price,
      original_price: origPrice,
      discount_percent: origPrice && origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0,
      unit: document.getElementById('prodFormUnit').value.trim(),
      stock: isAvail ? Math.max(1, stock) : 0,
      image_url: document.getElementById('prodFormImage').value.trim(),
      badge: document.getElementById('prodFormBadge').value.trim() || null,
      description: document.getElementById('prodFormDescription').value.trim(),
      is_organic: document.getElementById('prodFormOrganic').checked,
      is_featured: document.getElementById('prodFormFeatured').checked,
      is_available: isAvail
    };

    try {
      if (id) {
        await API.updateProduct(id, payload);
        if (typeof UI !== 'undefined') UI.showToast(`Product "${payload.name}" updated!`, 'success', '✨');
      } else {
        await API.createProduct(payload);
        if (typeof UI !== 'undefined') UI.showToast(`Product "${payload.name}" created!`, 'success', '✨');
      }
      this.closeProductModal();
      await this.refreshAllData();
    } catch (err) {
      alert('Error saving product: ' + err.message);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Product';
    }
  },

  populateCategorySelects() {
    const sel = document.getElementById('prodFormCategory');
    if (!sel || this.categories.length === 0) return;

    sel.innerHTML = '';
    this.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      sel.appendChild(opt);
    });
  },

  // --------------------------------------------------------------------------
  // 3. ORDER MANAGEMENT
  // --------------------------------------------------------------------------
  renderOrdersTable() {
    const tbody = document.getElementById('adminAllOrdersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (this.orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align: center; padding: 24px;">No customer orders placed yet.</td></tr>`;
      return;
    }

    const statuses = ['Order Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];

    this.orders.forEach(order => {
      const tr = document.createElement('tr');
      const itemsList = order.items 
        ? order.items.map(i => `<span style="font-size: 0.8rem; display: block;">• ${i.product_name || i.name} (x${i.quantity}) - ₹${parseFloat(i.total_price || (i.price * i.quantity)).toFixed(2)}</span>`).join('')
        : '<em>Grocery Basket</em>';

      const dateStr = order.created_at ? new Date(order.created_at).toLocaleString() : 'Recent';

      tr.innerHTML = `
        <td>
          <strong>${order.order_number}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${dateStr}</div>
        </td>
        <td>
          <strong>${order.customer_name}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${order.customer_email || ''} • ${order.customer_phone || ''}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); max-width: 220px;">${order.shipping_address || ''}</div>
        </td>
        <td>
          <span style="font-size: 0.82rem; font-weight: 600;">${order.delivery_slot || 'Standard (30-45m)'}</span>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${order.payment_method || 'Cash on Delivery'}</div>
        </td>
        <td>
          <div style="max-height: 80px; overflow-y: auto;">
            ${itemsList}
          </div>
        </td>
        <td>
          <strong style="color: var(--primary); font-size: 1rem;">₹${parseFloat(order.total).toFixed(2)}</strong>
        </td>
        <td>
          <select class="status-select-input" data-id="${order.id || order.order_number}">
            ${statuses.map(s => `<option value="${s}" ${order.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </td>
      `;

      // Status change listener
      const select = tr.querySelector('.status-select-input');
      select.addEventListener('change', async (e) => {
        const newStatus = e.target.value;
        try {
          await API.updateOrderStatus(order.id || order.order_number, newStatus);
          if (typeof UI !== 'undefined') UI.showToast(`Order ${order.order_number} updated to "${newStatus}"`, 'success', '📦');
          await this.refreshAllData();
        } catch (err) {
          alert('Could not update status: ' + err.message);
        }
      });

      tbody.appendChild(tr);
    });
  },

  // --------------------------------------------------------------------------
  // 4. USER MANAGEMENT
  // --------------------------------------------------------------------------
  renderUsersTable() {
    const tbody = document.getElementById('adminUsersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (this.users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-muted" style="text-align: center; padding: 24px;">No users found.</td></tr>`;
      return;
    }

    this.users.forEach(u => {
      const tr = document.createElement('tr');
      const isAdm = u.role === 'admin';

      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${isAdm ? '#10b981' : '#3b82f6'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem;">
              ${(u.name || 'U').charAt(0).toUpperCase()}
            </div>
            <strong>${u.name}</strong>
          </div>
        </td>
        <td>${u.email}</td>
        <td>${u.phone || '<span class="text-muted">-</span>'}</td>
        <td><strong>${u.orders_count || 0} orders</strong></td>
        <td><strong>₹${parseFloat(u.total_spend || 0).toFixed(2)}</strong></td>
        <td>
          <span class="status-badge ${isAdm ? 'confirmed' : 'preparing'}" style="${isAdm ? 'background: #dcfce7; color: #166534;' : ''}">
            ${isAdm ? 'Administrator' : 'Customer'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline toggle-role-btn" data-id="${u.id}" data-role="${u.role}">
            ${isAdm ? 'Demote to Customer' : 'Promote to Admin'}
          </button>
        </td>
      `;

      // Role toggle listener
      tr.querySelector('.toggle-role-btn').addEventListener('click', async () => {
        const nextRole = isAdm ? 'user' : 'admin';
        if (confirm(`Change role for "${u.name}" to ${nextRole.toUpperCase()}?`)) {
          try {
            await API.updateUserRole(u.id, nextRole);
            if (typeof UI !== 'undefined') UI.showToast(`Updated user role to ${nextRole}`, 'success', '👤');
            await this.refreshAllData();
          } catch (err) {
            alert('Error updating role: ' + err.message);
          }
        }
      });

      tbody.appendChild(tr);
    });
  },

  // --------------------------------------------------------------------------
  // 5. OFFERS MANAGEMENT
  // --------------------------------------------------------------------------
  renderOffersTable() {
    const tbody = document.getElementById('adminOffersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (this.offers.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-muted" style="text-align: center; padding: 24px;">No coupons or offers registered.</td></tr>`;
      return;
    }

    this.offers.forEach(o => {
      const tr = document.createElement('tr');
      const discountText = o.discount_percent > 0 ? `${o.discount_percent}% OFF` : `₹${parseFloat(o.discount_amount).toFixed(2)} Flat`;
      const minVal = o.min_order_value ? `₹${parseFloat(o.min_order_value).toFixed(2)}` : '₹0.00';

      tr.innerHTML = `
        <td>
          <strong style="letter-spacing: 1px; color: var(--primary);">${o.code}</strong>
        </td>
        <td><strong>${discountText}</strong></td>
        <td>${minVal}</td>
        <td>
          ${o.is_active 
            ? '<span class="status-badge confirmed">Active 🟢</span>' 
            : '<span class="status-badge cancelled">Disabled 🔴</span>'}
        </td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm btn-outline toggle-offer-btn" data-id="${o.id || o.code}">
              ${o.is_active ? 'Disable' : 'Enable'}
            </button>
            <button class="btn btn-sm btn-outline edit-offer-btn" data-id="${o.id || o.code}">Edit</button>
            <button class="btn btn-sm btn-outline delete-offer-btn" data-id="${o.id || o.code}" style="color: var(--danger); border-color: var(--danger);">Delete</button>
          </div>
        </td>
      `;

      // Toggle state
      tr.querySelector('.toggle-offer-btn').addEventListener('click', async () => {
        try {
          await API.toggleCoupon(o.id || o.code);
          if (typeof UI !== 'undefined') UI.showToast(`Offer ${o.code} toggled`, 'info', '🏷️');
          await this.refreshAllData();
        } catch (err) {
          alert('Error toggling offer: ' + err.message);
        }
      });

      // Edit offer
      tr.querySelector('.edit-offer-btn').addEventListener('click', () => this.openOfferModal(o));

      // Delete offer
      tr.querySelector('.delete-offer-btn').addEventListener('click', async () => {
        if (confirm(`Are you sure you want to delete coupon code "${o.code}"?`)) {
          try {
            await API.deleteCoupon(o.id || o.code);
            if (typeof UI !== 'undefined') UI.showToast(`Coupon "${o.code}" deleted`, 'info', '🗑️');
            await this.refreshAllData();
          } catch (err) {
            alert('Error deleting offer: ' + err.message);
          }
        }
      });

      tbody.appendChild(tr);
    });
  },

  openOfferModal(offer = null) {
    const modal = document.getElementById('offerFormModalBackdrop');
    const form = document.getElementById('offerForm');
    const title = document.getElementById('offerModalTitle');
    if (!modal || !form) return;

    form.reset();

    if (offer) {
      title.textContent = `Edit Offer: ${offer.code}`;
      document.getElementById('editOfferId').value = offer.id || offer.code;
      document.getElementById('offerFormCode').value = offer.code;
      document.getElementById('offerFormPercent').value = offer.discount_percent || 0;
      document.getElementById('offerFormAmount').value = offer.discount_amount || 0;
      // Default minimum is ₹299
      document.getElementById('offerFormMinVal').value = offer.min_order_value !== undefined ? offer.min_order_value : 299;
      document.getElementById('offerFormActive').checked = Boolean(offer.is_active);
    } else {
      title.textContent = 'Create Promotional Offer';
      document.getElementById('editOfferId').value = '';
      document.getElementById('offerFormPercent').value = 15;
      document.getElementById('offerFormAmount').value = 0;
      // Default minimum is ₹299
      document.getElementById('offerFormMinVal').value = 299;
      document.getElementById('offerFormActive').checked = true;
    }

    modal.style.display = 'flex';
  },

  closeOfferModal() {
    const modal = document.getElementById('offerFormModalBackdrop');
    if (modal) modal.style.display = 'none';
  },

  async handleSaveOffer(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('saveOfferBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    const id = document.getElementById('editOfferId').value;
    const code = document.getElementById('offerFormCode').value.trim().toUpperCase();
    const percent = parseInt(document.getElementById('offerFormPercent').value) || 0;
    const amount = parseFloat(document.getElementById('offerFormAmount').value) || 0;
    // Explicitly guarantee default minimum value of ₹299
    const minValInput = document.getElementById('offerFormMinVal').value;
    const minVal = minValInput !== '' ? parseFloat(minValInput) : 299.00;
    const active = document.getElementById('offerFormActive').checked;

    const payload = {
      code,
      discount_percent: percent,
      discount_amount: amount,
      min_order_value: minVal,
      is_active: active
    };

    try {
      if (id) {
        await API.updateCoupon(id, payload);
        if (typeof UI !== 'undefined') UI.showToast(`Offer "${code}" updated successfully!`, 'success', '🏷️');
      } else {
        await API.createCoupon(payload);
        if (typeof UI !== 'undefined') UI.showToast(`Offer "${code}" created successfully!`, 'success', '🏷️');
      }
      this.closeOfferModal();
      await this.refreshAllData();
    } catch (err) {
      alert('Error saving offer: ' + err.message);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Offer';
    }
  }
};

const Admin = AdminDashboard;

if (typeof window !== 'undefined') {
  window.Admin = AdminDashboard;
  window.AdminDashboard = AdminDashboard;
}

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', () => {
  AdminDashboard.init();
});

