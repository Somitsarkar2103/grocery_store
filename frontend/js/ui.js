/**
 * FreshCart UI Renderer & Component Handlers
 */
const UI = {
  // Toast notifications
  showToast(message, type = 'info', icon = '🥬') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);
    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Currency Formatter
  formatPrice(num) {
    return `₹${parseFloat(num || 0).toFixed(2)}`;
  },

  // Dark / Light Theme Toggle
  initTheme() {
    const savedTheme = localStorage.getItem('freshcart_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcons(savedTheme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('freshcart_theme', next);
        this.updateThemeIcons(next);
        this.showToast(`Switched to ${next} theme`, 'info', next === 'dark' ? '🌙' : '☀️');
      });
    }
  },

  updateThemeIcons(theme) {
    const sunIcon = document.querySelector('.icon-sun');
    const moonIcon = document.querySelector('.icon-moon');
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  },

  // Render Product Card
  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;

    const isFav = CartState.isInWishlist(product.id);
    const isOrganic = Boolean(product.is_organic || product.organic);
    const discountBadge = product.discount_percent > 0 
      ? `<span class="product-badge-pill discount">${product.discount_percent}% OFF</span>` 
      : (isOrganic ? `<span class="product-badge-pill organic">Organic</span>` : '');

    const badgeHTML = product.badge 
      ? `<span class="product-badge-pill ${product.badge.toLowerCase() === 'organic' ? 'organic' : ''}">${product.badge}</span>`
      : discountBadge;

    const imageUrl = product.image_url || product.image || '';
    const categoryName = product.category_name || (product.categories && product.categories.name) || product.category || 'Grocery';

    card.innerHTML = `
      <div class="product-image-wrap" data-action="quickview">
        <img src="${imageUrl}" alt="${product.name}" class="product-img" loading="lazy">
        ${badgeHTML}
        <button class="wishlist-toggle-btn ${isFav ? 'active' : ''}" data-action="wishlist" title="${isFav ? 'Remove from wishlist' : 'Save to wishlist'}">
          <svg viewBox="0 0 24 24" fill="${isFav ? '#ef4444' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div class="product-info">
        <span class="product-category-name">${categoryName}</span>
        <h3 class="product-title" data-action="quickview" title="${product.name}">${product.name}</h3>
        <span class="product-unit-text">${product.unit || '1 unit'}</span>

        <div class="product-rating">
          <span class="star-rating">★</span>
          <span class="rating-num">${product.rating || '4.8'}</span>
          <span class="rating-reviews">(${product.review_count || 12})</span>
        </div>

        <div class="product-bottom-row">
          <div class="product-pricing">
            <span class="current-price">${this.formatPrice(product.price)}</span>
            ${product.original_price ? `<span class="original-price">${this.formatPrice(product.original_price)}</span>` : ''}
          </div>

          <button class="add-cart-btn" data-action="add-to-cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add</span>
          </button>
        </div>
      </div>
    `;

    return card;
  },

  // Render Product Grid
  renderProducts(products, container) {
    container.innerHTML = '';
    const emptyState = document.getElementById('emptyProductsState');

    if (!products || products.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const fragment = document.createDocumentFragment();
    products.forEach(product => {
      fragment.appendChild(this.createProductCard(product));
    });
    container.appendChild(fragment);
  },

  // Render Categories in Top Grid
  renderCategories(categories, container, activeSlug = 'all') {
    container.innerHTML = '';

    categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = `category-card ${cat.slug === activeSlug ? 'active' : ''}`;
      card.dataset.slug = cat.slug;

      card.innerHTML = `
        <div class="category-image-wrap">
          <img src="${cat.image_url}" alt="${cat.name}">
        </div>
        <strong class="category-name">${cat.name}</strong>
        <span class="category-count">${cat.item_count || 0} items</span>
      `;

      container.appendChild(card);
    });
  },

  // Render Filter Categories in Sidebar
  renderSidebarCategories(categories, container, activeSlug = 'all') {
    container.innerHTML = '';

    // "All Categories" option
    const allBtn = document.createElement('button');
    allBtn.className = `filter-cat-btn ${activeSlug === 'all' ? 'active' : ''}`;
    allBtn.dataset.slug = 'all';
    allBtn.innerHTML = `
      <span>All Groceries</span>
      <span class="filter-cat-badge">All</span>
    `;
    container.appendChild(allBtn);

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `filter-cat-btn ${cat.slug === activeSlug ? 'active' : ''}`;
      btn.dataset.slug = cat.slug;
      btn.innerHTML = `
        <span>${cat.name}</span>
        <span class="filter-cat-badge">${cat.item_count || 0}</span>
      `;
      container.appendChild(btn);
    });
  },

  // Update Drawer Cart Items List
  updateCartDrawer(calc) {
    const listEl = document.getElementById('cartItemsList');
    const emptyView = document.getElementById('emptyCartView');
    const footer = document.getElementById('cartFooter');
    const headerTotal = document.getElementById('cartHeaderTotal');
    const badgeCount = document.getElementById('cartBadgeCount');
    const drawerCount = document.getElementById('drawerCartCount');
    const checkoutBtnTotal = document.getElementById('checkoutBtnTotal');

    // Header total & badge
    if (headerTotal) headerTotal.textContent = this.formatPrice(calc.total);
    if (badgeCount) badgeCount.textContent = calc.itemCount;
    if (drawerCount) drawerCount.textContent = `(${calc.itemCount} items)`;
    if (checkoutBtnTotal) checkoutBtnTotal.textContent = this.formatPrice(calc.total);

    // Free delivery progress bar
    const progressTrack = document.getElementById('deliveryProgressContainer');
    const progressBar = document.getElementById('deliveryProgressBar');
    const progressText = document.getElementById('deliveryProgressText');

    if (progressBar && progressText) {
      progressBar.style.width = `${calc.freeShippingPercent}%`;
      if (calc.isFreeShipping) {
        progressText.innerHTML = `🎉 <strong>Congratulations!</strong> You get <strong>FREE Express Delivery!</strong>`;
      } else {
        progressText.innerHTML = `Add <strong>₹${calc.freeShippingRemaining.toFixed(2)}</strong> more for <strong>FREE Delivery!</strong>`;
      }
    }

    // Bill summary values
    const subtotalEl = document.getElementById('summarySubtotal');
    const deliveryEl = document.getElementById('summaryDeliveryFee');
    const discountRow = document.getElementById('summaryDiscountRow');
    const discountEl = document.getElementById('summaryDiscount');
    const discountCodeLabel = document.getElementById('discountCodeLabel');
    const taxEl = document.getElementById('summaryTax');
    const totalEl = document.getElementById('summaryTotal');

    if (subtotalEl) subtotalEl.textContent = this.formatPrice(calc.subtotal);
    if (deliveryEl) deliveryEl.textContent = calc.deliveryFee === 0 ? 'FREE' : this.formatPrice(calc.deliveryFee);
    if (taxEl) taxEl.textContent = this.formatPrice(calc.tax);
    if (totalEl) totalEl.textContent = this.formatPrice(calc.total);

    if (discountRow && discountEl) {
      if (calc.discount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `-${this.formatPrice(calc.discount)}`;
        if (discountCodeLabel && calc.coupon) {
          discountCodeLabel.textContent = calc.coupon.code;
        }
      } else {
        discountRow.style.display = 'none';
      }
    }

    // Cart Items Rendering
    if (!calc.items || calc.items.length === 0) {
      if (listEl) listEl.innerHTML = '';
      if (emptyView) emptyView.style.display = 'block';
      if (footer) footer.style.display = 'none';
      if (progressTrack) progressTrack.style.display = 'none';
      return;
    }

    if (emptyView) emptyView.style.display = 'none';
    if (footer) footer.style.display = 'block';
    if (progressTrack) progressTrack.style.display = 'block';

    if (listEl) {
      listEl.innerHTML = '';
      calc.items.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item-row';
        itemRow.dataset.id = item.id;

        itemRow.innerHTML = `
          <img src="${item.image_url}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="cart-item-unit">${item.unit} • ${this.formatPrice(item.price)} each</div>
            <div class="cart-item-stepper">
              <button class="stepper-btn" data-action="decrease" data-id="${item.id}">−</button>
              <span class="stepper-count">${item.quantity}</span>
              <button class="stepper-btn" data-action="increase" data-id="${item.id}">+</button>
            </div>
          </div>
          <div class="cart-item-price-side">
            <span class="cart-item-price">${this.formatPrice(item.price * item.quantity)}</span>
            <button class="cart-item-remove-btn" data-action="remove" data-id="${item.id}">Remove</button>
          </div>
        `;
        listEl.appendChild(itemRow);
      });
    }
  },

  // Update Wishlist Drawer
  updateWishlistDrawer(wishlist) {
    const listEl = document.getElementById('wishlistItemsList');
    const emptyView = document.getElementById('emptyWishlistView');
    const countEl = document.getElementById('wishlistCount');
    const drawerCountEl = document.getElementById('drawerWishlistCount');

    if (countEl) countEl.textContent = wishlist.length;
    if (drawerCountEl) drawerCountEl.textContent = `(${wishlist.length} items)`;

    if (!wishlist || wishlist.length === 0) {
      if (listEl) listEl.innerHTML = '';
      if (emptyView) emptyView.style.display = 'block';
      return;
    }

    if (emptyView) emptyView.style.display = 'none';

    if (listEl) {
      listEl.innerHTML = '';
      wishlist.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item-row';
        itemRow.dataset.id = item.id;

        itemRow.innerHTML = `
          <img src="${item.image_url}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="cart-item-unit">${item.unit}</div>
            <button class="btn btn-sm btn-outline mt-3" data-action="wishlist-add-cart" data-id="${item.id}">Move to Basket</button>
          </div>
          <div class="cart-item-price-side">
            <span class="cart-item-price">${this.formatPrice(item.price)}</span>
            <button class="cart-item-remove-btn" data-action="wishlist-remove" data-id="${item.id}">Remove</button>
          </div>
        `;
        listEl.appendChild(itemRow);
      });
    }
  },

  // Synchronize heart button states on all rendered product cards
  syncWishlistButtons(wishlist) {
    const wishIds = new Set((wishlist || []).map(item => String(item.id)));
    document.querySelectorAll('.product-card').forEach(card => {
      const pid = String(card.dataset.id);
      const isFav = wishIds.has(pid);
      const btn = card.querySelector('[data-action="wishlist"]');
      if (btn) {
        btn.classList.toggle('active', isFav);
        const svg = btn.querySelector('svg');
        if (svg) svg.setAttribute('fill', isFav ? '#ef4444' : 'none');
        btn.setAttribute('title', isFav ? 'Remove from wishlist' : 'Save to wishlist');
      }
    });

    const qvModal = document.getElementById('quickViewBackdrop');
    if (qvModal) {
      const qvId = qvModal.dataset.id;
      if (qvId) {
        const isFav = wishIds.has(String(qvId));
        const qvBtn = qvModal.querySelector('[data-action="wishlist"]');
        if (qvBtn) {
          qvBtn.classList.toggle('active', isFav);
          const svg = qvBtn.querySelector('svg');
          if (svg) svg.setAttribute('fill', isFav ? '#ef4444' : 'none');
        }
      }
    }
  },

  // Open Quick View Modal
  openQuickView(product) {
    const modal = document.getElementById('quickViewBackdrop');
    if (!modal) return;

    modal.dataset.productId = product.id;
    document.getElementById('qvImage').src = product.image_url;
    document.getElementById('qvImage').alt = product.name;
    document.getElementById('qvTitle').textContent = product.name;
    document.getElementById('qvCategory').textContent = product.category_name || 'Produce';
    document.getElementById('qvPrice').textContent = this.formatPrice(product.price);
    
    const origPriceEl = document.getElementById('qvOriginalPrice');
    const discountEl = document.getElementById('qvDiscountPill');
    if (product.original_price) {
      origPriceEl.style.display = 'inline';
      origPriceEl.textContent = this.formatPrice(product.original_price);
      discountEl.style.display = 'inline-block';
      discountEl.textContent = `${product.discount_percent || 15}% OFF`;
    } else {
      origPriceEl.style.display = 'none';
      discountEl.style.display = 'none';
    }

    document.getElementById('qvUnit').textContent = `/ ${product.unit || '1 unit'}`;
    document.getElementById('qvDescription').textContent = product.description;
    document.getElementById('qvRating').textContent = product.rating || '4.8';
    document.getElementById('qvReviewCount').textContent = `(${product.review_count || 45} reviews)`;
    document.getElementById('qvQuantity').textContent = '1';

    // Nutrition grid
    const nutritionGrid = document.getElementById('qvNutritionGrid');
    if (nutritionGrid && product.nutrition) {
      nutritionGrid.innerHTML = '';
      Object.keys(product.nutrition).forEach(key => {
        const item = document.createElement('div');
        item.className = 'nutrition-pill';
        item.innerHTML = `
          <span>${key.replace('_', ' ')}</span>
          <strong>${product.nutrition[key]}</strong>
        `;
        nutritionGrid.appendChild(item);
      });
    }

    modal.classList.add('active');
  },

  closeQuickView() {
    const modal = document.getElementById('quickViewBackdrop');
    if (modal) modal.classList.remove('active');
  }
};
