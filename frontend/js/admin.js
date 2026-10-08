/**
 * FreshCart Admin Inventory & Order Management Module
 */
const Admin = {
  activeTab: 'overview',
  categories: [],
  products: [],
  orders: [],

  init() {
    this.bindEvents();
    this.checkSupabaseConnection();
  },

  bindEvents() {
    // Admin modal open/close
    const adminBtn = document.getElementById('adminPortalBtn');
    const footerAdminBtn = document.getElementById('footerAdminTrigger');
    const closeBtn = document.getElementById('closeAdminModal');
    const backdrop = document.getElementById('adminModalBackdrop');

    if (adminBtn) adminBtn.addEventListener('click', () => this.open());
    if (footerAdminBtn) footerAdminBtn.addEventListener('click', (e) => { e.preventDefault(); this.open(); });
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.close();
      });
    }

    // Tabs switching
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.switchTab(tab.dataset.tab);
      });
    });

    // Add Product Form submit
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
      addProductForm.addEventListener('submit', (e) => this.handleAddProduct(e));
    }
  },

  async open() {
    const backdrop = document.getElementById('adminModalBackdrop');
    if (backdrop) backdrop.classList.add('active');
    await this.refreshData();
  },

  close() {
    const backdrop = document.getElementById('adminModalBackdrop');
    if (backdrop) backdrop.classList.remove('active');
  },

  switchTab(tabId) {
    this.activeTab = tabId;
    const contents = document.querySelectorAll('.admin-tab-content');
    contents.forEach(c => c.classList.remove('active'));

    const activeContent = document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
    if (activeContent) activeContent.classList.add('active');

    if (tabId === 'overview') this.renderOverview();
    if (tabId === 'orders') this.renderOrders();
    if (tabId === 'products') this.renderProducts();
    if (tabId === 'addProduct') this.populateCategoriesDropdown();
  },

  async checkSupabaseConnection() {
    try {
      const health = await API.getHealth();
      const statusText = document.getElementById('supabaseStatusText');
      const statusPill = document.getElementById('supabaseStatusPill');

      if (health.supabase && health.supabase.connected) {
        if (statusText) statusText.textContent = 'Supabase PostgreSQL: Connected Live 🟢';
        if (statusPill) statusPill.style.color = 'var(--success)';
      } else if (health.supabase && health.supabase.urlConfigured) {
        if (statusText) statusText.textContent = 'Supabase PostgreSQL: Connected (Schema Ready) 🟢';
        if (statusPill) statusPill.style.color = 'var(--success)';
      } else {
        if (statusText) statusText.textContent = 'High-Fidelity Datastore (Add keys in .env for live Supabase) 🟡';
        if (statusPill) statusPill.style.color = 'var(--accent-hover)';
      }
    } catch (e) {
      console.warn('Could not check Supabase status:', e);
    }
  },

  async refreshData() {
    try {
      const [statsRes, ordersRes, productsRes, categoriesRes] = await Promise.all([
        API.getStats().catch(() => ({ data: {} })),
        API.getOrders().catch(() => ({ data: [] })),
        API.getProducts({ limit: 100 }).catch(() => ({ data: [] })),
        API.getCategories().catch(() => ({ data: [] }))
      ]);

      this.stats = statsRes.data || {};
      this.orders = ordersRes.data || [];
      this.products = productsRes.data || [];
      this.categories = categoriesRes.data || [];

      this.renderOverview();
      this.renderOrders();
      this.renderProducts();
      this.populateCategoriesDropdown();
    } catch (e) {
      console.error('Error refreshing admin data:', e);
    }
  },

  renderOverview() {
    const revEl = document.getElementById('adminStatRevenue');
    const ordersEl = document.getElementById('adminStatOrders');
    const prodsEl = document.getElementById('adminStatProducts');
    const aovEl = document.getElementById('adminStatAOV');

    if (revEl) revEl.textContent = UI.formatPrice(this.stats.totalRevenue || 0);
    if (ordersEl) ordersEl.textContent = this.stats.totalOrders || this.orders.length;
    if (prodsEl) prodsEl.textContent = this.stats.totalProducts || this.products.length;
    if (aovEl) aovEl.textContent = UI.formatPrice(this.stats.averageOrderValue || 0);

    // Recent orders table
    const tbody = document.getElementById('recentOrdersTableBody');
    if (tbody) {
      tbody.innerHTML = '';
      const recent = this.orders.slice(0, 5);
      if (recent.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align: center; padding: 20px;">No customer orders placed yet.</td></tr>`;
        return;
      }

      recent.forEach(order => {
        const tr = document.createElement('tr');
        const itemCount = order.items ? order.items.length : 1;
        const statusClass = (order.status || 'confirmed').toLowerCase().replace(/\s+/g, '-');
        const dateStr = order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today';

        tr.innerHTML = `
          <td><strong>${order.order_number}</strong></td>
          <td>${order.customer_name}</td>
          <td>${itemCount} items</td>
          <td><strong>${UI.formatPrice(order.total)}</strong></td>
          <td><span class="status-badge ${statusClass}">${order.status}</span></td>
          <td class="text-muted">${dateStr}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  },

  renderOrders() {
    const tbody = document.getElementById('allOrdersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (this.orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-muted" style="text-align: center; padding: 20px;">No orders in queue.</td></tr>`;
      return;
    }

    this.orders.forEach(order => {
      const tr = document.createElement('tr');
      const statusClass = (order.status || 'confirmed').toLowerCase().replace(/\s+/g, '-');
      const itemsList = order.items ? order.items.map(i => `${i.product_name || i.name} (x${i.quantity})`).join(', ') : 'Grocery Basket';

      tr.innerHTML = `
        <td>
          <strong>${order.order_number}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${new Date(order.created_at).toLocaleDateString()}</div>
        </td>
        <td>
          <div><strong>${order.customer_name}</strong></div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${order.customer_email} • ${order.customer_phone}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${order.shipping_address}</div>
        </td>
        <td>
          <div style="max-width: 220px; font-size: 0.8rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${itemsList}">${itemsList}</div>
          <div style="font-weight: 700; color: var(--primary); margin-top: 4px;">${UI.formatPrice(order.total)} (${order.payment_method})</div>
        </td>
        <td>
          <span class="status-badge ${statusClass}">${order.status}</span>
        </td>
        <td>
          <select class="status-select" data-id="${order.id}">
            <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
            <option value="Out for Delivery" ${order.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      `;

      // Status change listener
      const select = tr.querySelector('.status-select');
      select.addEventListener('change', async (e) => {
        const newStatus = e.target.value;
        try {
          await API.updateOrderStatus(order.id, newStatus);
          UI.showToast(`Order ${order.order_number} updated to ${newStatus}`, 'success', '📦');
          await this.refreshData();
        } catch (err) {
          UI.showToast(`Failed to update status: ${err.message}`, 'error', '⚠️');
        }
      });

      tbody.appendChild(tr);
    });
  },

  renderProducts() {
    const tbody = document.getElementById('catalogTableBody');
    const countTag = document.getElementById('catalogCountTag');
    if (countTag) countTag.textContent = `${this.products.length} products`;
    if (!tbody) return;

    tbody.innerHTML = '';
    this.products.forEach(prod => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="display: flex; align-items: center; gap: 10px;">
          <img src="${prod.image_url}" alt="${prod.name}" style="width: 36px; height: 36px; border-radius: 6px; object-fit: cover;">
          <div>
            <strong>${prod.name}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${prod.unit}</div>
          </div>
        </td>
        <td>${prod.category_name || 'Produce'}</td>
        <td><strong>${UI.formatPrice(prod.price)}</strong></td>
        <td>
          <span style="font-weight: 700; color: ${prod.stock > 10 ? 'var(--success)' : 'var(--danger)'};">
            ${prod.stock} left
          </span>
        </td>
        <td>
          ${prod.is_organic ? '<span class="status-badge" style="background: #dcfce7; color: #166534;">Organic</span>' : '<span class="text-muted">Standard</span>'}
        </td>
        <td>
          <button class="btn btn-sm btn-outline text-danger delete-prod-btn" data-id="${prod.id}" style="color: var(--danger); border-color: var(--danger);">
            Delete
          </button>
        </td>
      `;

      // Delete listener
      const deleteBtn = tr.querySelector('.delete-prod-btn');
      deleteBtn.addEventListener('click', async () => {
        if (confirm(`Are you sure you want to delete "${prod.name}"?`)) {
          try {
            await API.deleteProduct(prod.id);
            UI.showToast(`Product "${prod.name}" deleted`, 'info', '🗑️');
            await this.refreshData();
            // Also notify main app to refresh products grid
            window.dispatchEvent(new CustomEvent('grocery-catalog-updated'));
          } catch (err) {
            UI.showToast(`Could not delete: ${err.message}`, 'error', '⚠️');
          }
        }
      });

      tbody.appendChild(tr);
    });
  },

  populateCategoriesDropdown() {
    const select = document.getElementById('newProdCategory');
    if (!select || this.categories.length === 0) return;

    select.innerHTML = '';
    this.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      select.appendChild(opt);
    });
  },

  async handleAddProduct(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('saveProductBtn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span>Saving to Supabase...</span>';

    try {
      const payload = {
        name: document.getElementById('newProdName').value.trim(),
        category_id: document.getElementById('newProdCategory').value,
        price: parseFloat(document.getElementById('newProdPrice').value),
        original_price: document.getElementById('newProdOriginalPrice').value ? parseFloat(document.getElementById('newProdOriginalPrice').value) : null,
        unit: document.getElementById('newProdUnit').value.trim(),
        stock: parseInt(document.getElementById('newProdStock').value) || 50,
        image_url: document.getElementById('newProdImage').value.trim(),
        badge: document.getElementById('newProdBadge').value.trim() || null,
        description: document.getElementById('newProdDescription').value.trim(),
        is_organic: document.getElementById('newProdOrganic').checked,
        is_featured: document.getElementById('newProdFeatured').checked
      };

      await API.createProduct(payload);
      UI.showToast(`Product "${payload.name}" published successfully!`, 'success', '✨');
      document.getElementById('addProductForm').reset();
      this.switchTab('products');
      await this.refreshData();
      window.dispatchEvent(new CustomEvent('grocery-catalog-updated'));
    } catch (err) {
      UI.showToast(`Failed to add product: ${err.message}`, 'error', '⚠️');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<span>Save & Publish Product</span>';
    }
  }
};
