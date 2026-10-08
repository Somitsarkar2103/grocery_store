/**
 * FreshCart Main Application Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const App = {
    currentCategory: 'all',
    searchTerm: '',
    maxPrice: 1000,
    isOrganicOnly: false,
    isInStockOnly: true,
    currentSort: 'featured',
    allProducts: [],
    categories: [],

    async init() {
      try {
        UI.initTheme();
        CartState.subscribe(calc => UI.updateCartDrawer(calc));
        CartState.subscribeWishlist(wishlist => {
          UI.updateWishlistDrawer(wishlist);
          UI.syncWishlistButtons(wishlist);
        });

        if (typeof Admin !== 'undefined' && Admin.init) {
          Admin.init();
        } else if (typeof AdminDashboard !== 'undefined' && AdminDashboard.init) {
          AdminDashboard.init();
        }

        // Role and Auth UI Setup
        if (typeof Auth !== 'undefined') {
          Auth.renderHeader('headerAuthContainer');
          const adminBtn = document.getElementById('adminPortalBtn');
          if (adminBtn) {
            // Strict Role Separation: Normal customers cannot access admin portal!
            if (Auth.isAuthenticated() && !Auth.isAdmin()) {
              adminBtn.style.display = 'none';
            }
          }
        }

        this.bindHeaderActions();
        this.bindFilterActions();
        this.bindCartActions();
        this.bindCheckoutActions();
        this.bindQuickViewActions();
        this.bindWishlistActions();
        this.bindLocationActions();
        this.bindCustomerAccountActions();
      } catch (initErr) {
        console.warn('Non-fatal initialization warning:', initErr);
      }

      await this.loadCategories();
      await this.loadProducts();

      // Listen for catalog updates from Admin
      window.addEventListener('grocery-catalog-updated', () => {
        this.loadProducts();
      });
    },

    // --------------------------------------------------------------------------
    // 1. DATA LOADING
    // --------------------------------------------------------------------------
    async loadCategories() {
      try {
        const res = await API.getCategories();
        this.categories = res.data || [];

        // Render in top categories carousel
        const topContainer = document.getElementById('categoriesContainer');
        if (topContainer) {
          UI.renderCategories(this.categories, topContainer, this.currentCategory);
          // Category card click
          topContainer.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
              const slug = card.dataset.slug;
              this.setCategory(slug === this.currentCategory ? 'all' : slug);
            });
          });
        }

        // Render in sidebar
        const sidebarContainer = document.getElementById('filterCategoryList');
        if (sidebarContainer) {
          UI.renderSidebarCategories(this.categories, sidebarContainer, this.currentCategory);
          sidebarContainer.querySelectorAll('.filter-cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              this.setCategory(btn.dataset.slug);
            });
          });
        }

        // Populate search dropdown
        const searchCatSelect = document.getElementById('searchCategorySelect');
        if (searchCatSelect) {
          searchCatSelect.innerHTML = '<option value="all">All Departments</option>';
          this.categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.slug;
            opt.textContent = cat.name;
            searchCatSelect.appendChild(opt);
          });
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    },

    async loadProducts() {
      const grid = document.getElementById('productsGrid');
      const emptyState = document.getElementById('emptyProductsState');
      const countBadge = document.getElementById('productsCountBadge');

      if (grid) {
        grid.innerHTML = `
          <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Fetching fresh groceries from Supabase...</p>
          </div>
        `;
      }
      if (emptyState) {
        emptyState.style.display = 'none';
      }
      if (countBadge) {
        countBadge.textContent = 'Loading items...';
      }

      try {
        const params = {
          category: this.currentCategory,
          search: this.searchTerm,
          maxPrice: this.maxPrice,
          organic: this.isOrganicOnly ? 'true' : '',
          inStock: this.isInStockOnly ? 'true' : '',
          sort: this.currentSort,
          limit: 100
        };

        const res = await API.getProducts(params);
        let products = [];
        if (Array.isArray(res)) {
          products = res;
        } else if (res && Array.isArray(res.data)) {
          products = res.data;
        } else if (res && Array.isArray(res.products)) {
          products = res.products;
        }
        this.allProducts = products;

        // Update count badge & title
        if (countBadge) {
          if (this.allProducts.length === 0) {
            countBadge.textContent = 'No products found';
          } else {
            countBadge.textContent = `Showing ${this.allProducts.length} items`;
          }
        }

        const titleEl = document.getElementById('activeCategoryTitle');
        if (titleEl) {
          if (this.currentCategory === 'all') {
            titleEl.textContent = 'All Fresh Groceries';
          } else {
            const cat = this.categories.find(c => c.slug === this.currentCategory);
            titleEl.textContent = cat ? cat.name : 'Category Products';
          }
        }

        if (grid) {
          UI.renderProducts(this.allProducts, grid);
          this.bindProductCardEvents(grid);
          UI.syncWishlistButtons(CartState.wishlist);
        }

        this.updateActiveTags();
      } catch (err) {
        console.error('Failed to load products:', err);
        if (countBadge) {
          countBadge.textContent = 'Unable to load products';
        }
        if (emptyState) {
          emptyState.style.display = 'none';
        }
        if (grid) {
          grid.innerHTML = `
            <div class="empty-products-state" style="display: block;">
              <div class="empty-icon">⚠️</div>
              <h3>Unable to load products</h3>
              <p>Unable to load products. Please try again.</p>
              <button class="btn btn-primary" id="retryLoadProductsBtn">Retry</button>
            </div>
          `;
          const retryBtn = document.getElementById('retryLoadProductsBtn');
          if (retryBtn) {
            retryBtn.addEventListener('click', () => this.loadProducts());
          }
        }
      }
    },

    setCategory(slug) {
      this.currentCategory = slug;

      // Update active states in UI
      document.querySelectorAll('.category-card').forEach(card => {
        card.classList.toggle('active', card.dataset.slug === slug);
      });
      document.querySelectorAll('.filter-cat-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.slug === slug);
      });

      const searchSelect = document.getElementById('searchCategorySelect');
      if (searchSelect) searchSelect.value = slug;

      this.loadProducts();

      // Smooth scroll to store section if called from top
      const storeSection = document.getElementById('storeSection');
      if (storeSection && window.scrollY > storeSection.offsetTop) {
        storeSection.scrollIntoView({ behavior: 'smooth' });
      }
    },

    // --------------------------------------------------------------------------
    // 2. HEADER & SEARCH EVENTS
    // --------------------------------------------------------------------------
    bindHeaderActions() {
      // Top coupon click to copy
      const topCoupon = document.getElementById('topCouponCode');
      if (topCoupon) {
        topCoupon.addEventListener('click', () => {
          navigator.clipboard.writeText('FRESH20');
          UI.showToast('Coupon FRESH20 copied to clipboard!', 'success', '📋');
        });
      }

      // Close announcement
      const closeAnnounce = document.getElementById('closeAnnouncement');
      if (closeAnnounce) {
        closeAnnounce.addEventListener('click', () => {
          const bar = document.getElementById('announcementBar');
          if (bar) bar.style.display = 'none';
        });
      }

      // Search bar
      const searchInput = document.getElementById('searchInput');
      const clearBtn = document.getElementById('searchClearBtn');
      const searchCatSelect = document.getElementById('searchCategorySelect');
      let debounceTimeout = null;

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const val = e.target.value.trim();
          if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';

          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => {
            this.searchTerm = val;
            this.loadProducts();
          }, 300);
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (searchInput) {
            searchInput.value = '';
            clearBtn.style.display = 'none';
          }
          this.searchTerm = '';
          this.loadProducts();
        });
      }

      if (searchCatSelect) {
        searchCatSelect.addEventListener('change', (e) => {
          this.setCategory(e.target.value);
        });
      }

      // View All Categories button
      const resetCatBtn = document.getElementById('viewAllCategoriesBtn');
      if (resetCatBtn) {
        resetCatBtn.addEventListener('click', () => this.setCategory('all'));
      }

      // Footer category links
      document.querySelectorAll('.footer-cat-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.setCategory(link.dataset.cat);
          document.getElementById('storeSection').scrollIntoView({ behavior: 'smooth' });
        });
      });

      // Today's Hot Deals button
      const dealsBtn = document.getElementById('exploreDealsBtn');
      if (dealsBtn) {
        dealsBtn.addEventListener('click', () => {
          this.currentSort = 'price-asc';
          const sortSelect = document.getElementById('sortSelect');
          if (sortSelect) sortSelect.value = 'price-asc';
          this.loadProducts();
          document.getElementById('storeSection').scrollIntoView({ behavior: 'smooth' });
        });
      }
    },

    // --------------------------------------------------------------------------
    // 3. FILTER ACTIONS
    // --------------------------------------------------------------------------
    bindFilterActions() {
      // Price slider
      const priceRange = document.getElementById('priceRange');
      const priceDisplay = document.getElementById('priceDisplay');
      if (priceRange && priceDisplay) {
        priceRange.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          priceDisplay.textContent = `₹${val.toFixed(2)}`;
          this.maxPrice = val;
        });
        priceRange.addEventListener('change', () => this.loadProducts());
      }

      // Dietary preferences
      const organicFilter = document.getElementById('organicFilter');
      if (organicFilter) {
        organicFilter.addEventListener('change', (e) => {
          this.isOrganicOnly = e.target.checked;
          this.loadProducts();
        });
      }

      const inStockFilter = document.getElementById('inStockFilter');
      if (inStockFilter) {
        inStockFilter.addEventListener('change', (e) => {
          this.isInStockOnly = e.target.checked;
          this.loadProducts();
        });
      }

      // Sort Select
      const sortSelect = document.getElementById('sortSelect');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          this.currentSort = e.target.value;
          this.loadProducts();
        });
      }

      // Reset All Filters
      const resetFiltersBtn = document.getElementById('resetFiltersBtn');
      const clearSearchFiltersBtn = document.getElementById('clearSearchFiltersBtn');
      const clearTagsBtn = document.getElementById('clearTagsBtn');

      const resetAll = () => {
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.maxPrice = 1000;
        this.isOrganicOnly = false;
        this.isInStockOnly = false;
        this.currentSort = 'featured';

        if (priceRange) priceRange.value = 1000;
        if (priceDisplay) priceDisplay.textContent = '₹1,000.00';
        if (organicFilter) organicFilter.checked = false;
        if (inStockFilter) inStockFilter.checked = false;
        if (sortSelect) sortSelect.value = 'featured';

        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        const searchClearBtn = document.getElementById('searchClearBtn');
        if (searchClearBtn) searchClearBtn.style.display = 'none';

        this.setCategory('all');
      };

      if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAll);
      if (clearSearchFiltersBtn) clearSearchFiltersBtn.addEventListener('click', resetAll);
      if (clearTagsBtn) clearTagsBtn.addEventListener('click', resetAll);

      // Copy coupon code in sidebar
      document.querySelectorAll('.copy-coupon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const code = btn.dataset.code;
          navigator.clipboard.writeText(code);
          UI.showToast(`Coupon ${code} copied!`, 'success', '🏷️');
          // Open cart drawer and fill input
          this.openCart();
          const couponInput = document.getElementById('couponInput');
          if (couponInput) couponInput.value = code;
        });
      });
    },

    updateActiveTags() {
      const tagsBar = document.getElementById('activeTagsBar');
      const tagsList = document.getElementById('tagsList');
      if (!tagsBar || !tagsList) return;

      tagsList.innerHTML = '';
      const tags = [];

      if (this.currentCategory !== 'all') {
        const cat = this.categories.find(c => c.slug === this.currentCategory);
        tags.push({ label: `Category: ${cat ? cat.name : this.currentCategory}`, type: 'category' });
      }
      if (this.searchTerm) {
        tags.push({ label: `Search: "${this.searchTerm}"`, type: 'search' });
      }
      if (this.maxPrice < 1000) {
        tags.push({ label: `Under ₹${this.maxPrice.toFixed(2)}`, type: 'price' });
      }
      if (this.isOrganicOnly) {
        tags.push({ label: 'Organic Only', type: 'organic' });
      }

      if (tags.length === 0) {
        tagsBar.style.display = 'none';
        return;
      }

      tagsBar.style.display = 'flex';
      tags.forEach(t => {
        const chip = document.createElement('div');
        chip.className = 'filter-tag-chip';
        chip.innerHTML = `<span>${t.label}</span><button data-type="${t.type}">&times;</button>`;
        chip.querySelector('button').addEventListener('click', () => {
          if (t.type === 'category') this.setCategory('all');
          if (t.type === 'search') {
            this.searchTerm = '';
            document.getElementById('searchInput').value = '';
            this.loadProducts();
          }
          if (t.type === 'price') {
            this.maxPrice = 1000;
            document.getElementById('priceRange').value = 1000;
            document.getElementById('priceDisplay').textContent = '₹1,000.00';
            this.loadProducts();
          }
          if (t.type === 'organic') {
            this.isOrganicOnly = false;
            document.getElementById('organicFilter').checked = false;
            this.loadProducts();
          }
        });
        tagsList.appendChild(chip);
      });
    },

    // --------------------------------------------------------------------------
    // 4. PRODUCT CARD INTERACTIONS
    // --------------------------------------------------------------------------
    bindProductCardEvents(container) {
      if (container._hasCardEvents) return;
      container._hasCardEvents = true;

      container.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;
        const productId = card.dataset.id;
        const product = this.allProducts.find(p => p.id === productId);
        if (!product) return;

        // Wishlist Toggle
        const wishlistBtn = e.target.closest('[data-action="wishlist"]');
        if (wishlistBtn) {
          e.stopPropagation();
          const added = CartState.toggleWishlist(product);
          wishlistBtn.classList.toggle('active', added);
          wishlistBtn.querySelector('svg').setAttribute('fill', added ? '#ef4444' : 'none');
          UI.showToast(
            added ? `Added "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`,
            'info',
            added ? '❤️' : '🤍'
          );
          return;
        }

        // Add to Cart
        const addBtn = e.target.closest('[data-action="add-to-cart"]');
        if (addBtn) {
          e.stopPropagation();
          CartState.addItem(product, 1);
          addBtn.classList.add('added-animation');
          addBtn.innerHTML = `<span>Added ✓</span>`;
          UI.showToast(`Added 1x ${product.name} to basket!`, 'success', '🛒');
          setTimeout(() => {
            addBtn.classList.remove('added-animation');
            addBtn.innerHTML = `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add</span>
            `;
          }, 1200);
          return;
        }

        // Quick View Modal
        const qvTarget = e.target.closest('[data-action="quickview"]');
        if (qvTarget) {
          UI.openQuickView(product);
        }
      });
    },

    // --------------------------------------------------------------------------
    // 5. CART DRAWER & COUPON ACTIONS
    // --------------------------------------------------------------------------
    bindCartActions() {
      const cartTrigger = document.getElementById('cartTriggerBtn');
      const cartDrawer = document.getElementById('cartDrawer');
      const cartOverlay = document.getElementById('cartOverlay');
      const closeCart = document.getElementById('closeCartDrawer');
      const startShoppingBtn = document.getElementById('startShoppingBtn');

      this.openCart = () => {
        if (cartDrawer) cartDrawer.classList.add('open');
        if (cartOverlay) cartOverlay.classList.add('active');
      };

      this.closeCart = () => {
        if (cartDrawer) cartDrawer.classList.remove('open');
        if (cartOverlay) cartOverlay.classList.remove('active');
      };

      if (cartTrigger) cartTrigger.addEventListener('click', this.openCart);
      if (closeCart) closeCart.addEventListener('click', this.closeCart);
      if (cartOverlay) cartOverlay.addEventListener('click', this.closeCart);
      if (startShoppingBtn) {
        startShoppingBtn.addEventListener('click', () => {
          this.closeCart();
          document.getElementById('storeSection').scrollIntoView({ behavior: 'smooth' });
        });
      }

      // Cart Item Stepper & Remove clicks
      const cartList = document.getElementById('cartItemsList');
      if (cartList) {
        cartList.addEventListener('click', (e) => {
          const btn = e.target.closest('button');
          if (!btn) return;
          const productId = btn.dataset.id;
          const action = btn.dataset.action;
          const item = CartState.items.find(i => i.id === productId);
          if (!item) return;

          if (action === 'increase') {
            CartState.updateQuantity(productId, item.quantity + 1);
          } else if (action === 'decrease') {
            CartState.updateQuantity(productId, item.quantity - 1);
          } else if (action === 'remove') {
            CartState.removeItem(productId);
            UI.showToast(`Removed ${item.name} from basket`, 'info', '🗑️');
          }
        });
      }

      // Apply Coupon
      const applyCouponBtn = document.getElementById('applyCouponBtn');
      const couponInput = document.getElementById('couponInput');
      const couponStatus = document.getElementById('couponStatus');

      if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', async () => {
          const code = couponInput.value.trim();
          if (!code) {
            UI.showToast('Please enter a coupon code', 'warning', '⚠️');
            return;
          }

          const calc = CartState.getCalculations();
          try {
            applyCouponBtn.disabled = true;
            applyCouponBtn.textContent = 'Checking...';
            const res = await API.validateCoupon(code, calc.subtotal);
            if (res.success) {
              CartState.applyCoupon(res.data);
              couponStatus.className = 'coupon-status success';
              couponStatus.textContent = res.message;
              UI.showToast(`Coupon "${res.data.code}" applied! Saved ${UI.formatPrice(res.data.discount_amount)}`, 'success', '🎉');
            }
          } catch (err) {
            couponStatus.className = 'coupon-status error';
            couponStatus.textContent = err.message;
            UI.showToast(err.message, 'error', '⚠️');
          } finally {
            applyCouponBtn.disabled = false;
            applyCouponBtn.textContent = 'Apply';
          }
        });
      }
    },

    // --------------------------------------------------------------------------
    // 6. CHECKOUT & ORDER CONFIRMATION
    // --------------------------------------------------------------------------
    bindCheckoutActions() {
      const proceedBtn = document.getElementById('proceedToCheckoutBtn');
      const checkoutModal = document.getElementById('checkoutModalBackdrop');
      const closeCheckout = document.getElementById('closeCheckoutModal');
      const checkoutForm = document.getElementById('checkoutForm');

      if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
          const calc = CartState.getCalculations();
          if (calc.items.length === 0) {
            UI.showToast('Your basket is empty! Add items first.', 'warning', '🛒');
            return;
          }
          this.closeCart();
          this.openCheckoutModal(calc);
        });
      }

      this.openCheckoutModal = (calc) => {
        const modalItems = document.getElementById('modalItemsCount');
        const modalSub = document.getElementById('modalSubtotal');
        const modalDel = document.getElementById('modalDelivery');
        const modalTax = document.getElementById('modalTax');
        const modalTot = document.getElementById('modalTotal');
        const discountRow = document.getElementById('modalDiscountRow');
        const discountEl = document.getElementById('modalDiscount');

        if (modalItems) modalItems.textContent = calc.itemCount;
        if (modalSub) modalSub.textContent = UI.formatPrice(calc.subtotal);
        if (modalDel) modalDel.textContent = calc.deliveryFee === 0 ? 'FREE' : UI.formatPrice(calc.deliveryFee);
        if (modalTax) modalTax.textContent = UI.formatPrice(calc.tax);
        if (modalTot) modalTot.textContent = UI.formatPrice(calc.total);

        if (discountRow) {
          if (calc.discount > 0) {
            discountRow.style.display = 'flex';
            if (discountEl) discountEl.textContent = `-${UI.formatPrice(calc.discount)}`;
          } else {
            discountRow.style.display = 'none';
          }
        }

        // Auto-fill logged-in customer info if available
        if (typeof Auth !== 'undefined' && Auth.isAuthenticated()) {
          const user = Auth.getUser();
          if (user) {
            const nameInp = document.getElementById('custName');
            const emailInp = document.getElementById('custEmail');
            const phoneInp = document.getElementById('custPhone');
            if (nameInp && !nameInp.value) nameInp.value = user.name || '';
            if (emailInp && !emailInp.value) emailInp.value = user.email || '';
            if (phoneInp && !phoneInp.value) phoneInp.value = user.phone || '';
          }
        }

        if (checkoutModal) checkoutModal.classList.add('active');
      };

      if (closeCheckout) {
        closeCheckout.addEventListener('click', () => {
          if (checkoutModal) checkoutModal.classList.remove('active');
        });
      }

      // Radio card styles
      const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
      paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          document.querySelectorAll('.payment-radio-card').forEach(c => c.classList.remove('active'));
          radio.closest('.payment-radio-card').classList.add('active');
        });
      });

      // Submit Order
      if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const calc = CartState.getCalculations();
          const submitBtn = document.getElementById('submitOrderBtn');
          const spinner = document.getElementById('orderSpinner');

          submitBtn.disabled = true;
          submitBtn.querySelector('span').textContent = 'Confirming Order with Supabase...';
          if (spinner) spinner.style.display = 'inline-block';

          const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked').value;

          const orderPayload = {
            customer_name: document.getElementById('custName').value.trim(),
            customer_email: document.getElementById('custEmail').value.trim(),
            customer_phone: document.getElementById('custPhone').value.trim(),
            shipping_address: document.getElementById('custAddress').value.trim(),
            delivery_city: document.getElementById('custCity').value.trim(),
            delivery_zip: document.getElementById('custZip').value.trim(),
            delivery_slot: document.getElementById('deliverySlot').value,
            payment_method: selectedPayment,
            notes: document.getElementById('custNotes').value.trim(),
            items: calc.items.map(i => ({
              product_id: i.id,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              image_url: i.image_url
            })),
            coupon_code: calc.coupon ? calc.coupon.code : null
          };

          try {
            const res = await API.createOrder(orderPayload);
            const createdOrder = res.data;

            // Close checkout modal
            if (checkoutModal) checkoutModal.classList.remove('active');
            checkoutForm.reset();

            // Clear cart
            CartState.clearCart();

            // Show Success Modal
            this.showOrderSuccess(createdOrder);
            UI.showToast('Order confirmed! Driver assigned 🚚', 'success', '🎉');
          } catch (err) {
            UI.showToast(`Order failed: ${err.message}`, 'error', '⚠️');
          } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Place Order Now';
            if (spinner) spinner.style.display = 'none';
          }
        });
      }

      // Success modal actions
      const successModal = document.getElementById('orderSuccessBackdrop');
      const continueBtn = document.getElementById('continueShoppingSuccessBtn');
      const printBtn = document.getElementById('printReceiptBtn');

      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          if (successModal) successModal.classList.remove('active');
        });
      }

      if (printBtn) {
        printBtn.addEventListener('click', () => {
          window.print();
        });
      }
    },

    showOrderSuccess(order) {
      const modal = document.getElementById('orderSuccessBackdrop');
      if (!modal) return;

      document.getElementById('successOrderNumber').textContent = order.order_number;
      document.getElementById('successCustomerName').textContent = order.customer_name;
      document.getElementById('successAddress').textContent = `${order.shipping_address}, ${order.delivery_city}`;
      document.getElementById('successSlot').textContent = order.delivery_slot;
      document.getElementById('successTotal').textContent = `${UI.formatPrice(order.total)} (${order.payment_method})`;

      modal.classList.add('active');
    },

    // --------------------------------------------------------------------------
    // 7. QUICK VIEW ACTIONS
    // --------------------------------------------------------------------------
    bindQuickViewActions() {
      const closeBtn = document.getElementById('closeQuickViewModal');
      const backdrop = document.getElementById('quickViewBackdrop');
      const minusBtn = document.getElementById('qvMinusBtn');
      const plusBtn = document.getElementById('qvPlusBtn');
      const qtyEl = document.getElementById('qvQuantity');
      const addBtn = document.getElementById('qvAddToCartBtn');

      if (closeBtn) closeBtn.addEventListener('click', () => UI.closeQuickView());
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) UI.closeQuickView();
        });
      }

      if (minusBtn && plusBtn && qtyEl) {
        minusBtn.addEventListener('click', () => {
          let q = parseInt(qtyEl.textContent) || 1;
          if (q > 1) qtyEl.textContent = q - 1;
        });
        plusBtn.addEventListener('click', () => {
          let q = parseInt(qtyEl.textContent) || 1;
          qtyEl.textContent = q + 1;
        });
      }

      if (addBtn && backdrop) {
        addBtn.addEventListener('click', () => {
          const productId = backdrop.dataset.productId;
          const product = this.allProducts.find(p => p.id === productId);
          const quantity = parseInt(qtyEl.textContent) || 1;

          if (product) {
            CartState.addItem(product, quantity);
            UI.showToast(`Added ${quantity}x ${product.name} to basket!`, 'success', '🛒');
            UI.closeQuickView();
          }
        });
      }
    },

    // --------------------------------------------------------------------------
    // 8. WISHLIST ACTIONS
    // --------------------------------------------------------------------------
    bindWishlistActions() {
      const wishlistBtn = document.getElementById('wishlistBtn');
      const wishlistDrawer = document.getElementById('wishlistDrawer');
      const wishlistOverlay = document.getElementById('wishlistOverlay');
      const closeWishlist = document.getElementById('closeWishlistDrawer');

      const openWishlist = () => {
        if (wishlistDrawer) wishlistDrawer.classList.add('open');
        if (wishlistOverlay) wishlistOverlay.classList.add('active');
      };

      const closeWishlistDrawer = () => {
        if (wishlistDrawer) wishlistDrawer.classList.remove('open');
        if (wishlistOverlay) wishlistOverlay.classList.remove('active');
      };

      if (wishlistBtn) wishlistBtn.addEventListener('click', openWishlist);
      if (closeWishlist) closeWishlist.addEventListener('click', closeWishlistDrawer);
      if (wishlistOverlay) wishlistOverlay.addEventListener('click', closeWishlistDrawer);

      const wishlistItemsList = document.getElementById('wishlistItemsList');
      if (wishlistItemsList) {
        wishlistItemsList.addEventListener('click', (e) => {
          const btn = e.target.closest('button');
          if (!btn) return;
          const productId = btn.dataset.id;
          const item = CartState.wishlist.find(i => i.id === productId);
          if (!item) return;

          if (btn.dataset.action === 'wishlist-add-cart') {
            CartState.addItem(item, 1);
            CartState.removeFromWishlist(item.id);
            UI.showToast(`Moved ${item.name} to basket!`, 'success', '🛒');
          } else if (btn.dataset.action === 'wishlist-remove') {
            CartState.removeFromWishlist(item.id);
            UI.showToast(`Removed from wishlist`, 'info', '🤍');
          }
        });
      }
    },

    // --------------------------------------------------------------------------
    // 9. LOCATION SELECTOR
    // --------------------------------------------------------------------------
    bindLocationActions() {
      const locBtn = document.getElementById('locationBtn');
      const locModal = document.getElementById('locationModalBackdrop');
      const closeLoc = document.getElementById('closeLocationModal');
      const locText = document.getElementById('currentLocationText');
      const custZipInput = document.getElementById('customZipInput');
      const saveCustomZipBtn = document.getElementById('saveCustomZipBtn');

      if (locBtn && locModal) {
        locBtn.addEventListener('click', () => locModal.classList.add('active'));
      }
      if (closeLoc && locModal) {
        closeLoc.addEventListener('click', () => locModal.classList.remove('active'));
      }
      if (locModal) {
        locModal.addEventListener('click', (e) => {
          if (e.target === locModal) locModal.classList.remove('active');
        });
      }

      document.querySelectorAll('.location-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.location-preset-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const loc = btn.dataset.loc;
          if (locText) locText.textContent = loc;
          if (locModal) locModal.classList.remove('active');
          UI.showToast(`Delivery location set to ${loc}`, 'info', '📍');
        });
      });

      if (saveCustomZipBtn && custZipInput) {
        saveCustomZipBtn.addEventListener('click', () => {
          const zip = custZipInput.value.trim();
          if (zip) {
            if (locText) locText.textContent = `Zone ${zip}`;
            if (locModal) locModal.classList.remove('active');
            UI.showToast(`Delivery address updated to ZIP ${zip}`, 'info', '📍');
          }
        });
      }
    },

    // --------------------------------------------------------------------------
    // 10. CUSTOMER ACCOUNT MODALS (ORDERS & PROFILE)
    // --------------------------------------------------------------------------
    bindCustomerAccountActions() {
      const ordersModal = document.getElementById('customerOrdersModalBackdrop');
      const closeOrders = document.getElementById('closeCustOrdersModal');
      const ordersListContainer = document.getElementById('customerOrdersListContainer');
      const ordersEmailLabel = document.getElementById('custOrdersEmailLabel');

      const openCustomerOrders = async () => {
        if (!ordersModal) return;
        ordersModal.style.display = 'flex';

        const user = typeof Auth !== 'undefined' ? Auth.getUser() : null;
        const email = user ? user.email : '';
        if (ordersEmailLabel) {
          ordersEmailLabel.textContent = email ? `Orders for ${email}` : 'Store Orders';
        }

        try {
          if (ordersListContainer) {
            ordersListContainer.innerHTML = '<p class="text-muted" style="text-align: center; padding: 20px;">Fetching your orders...</p>';
          }
          const res = await API.getOrders(email);
          const orders = res.data || [];

          if (!ordersListContainer) return;
          if (orders.length === 0) {
            ordersListContainer.innerHTML = `
              <div style="text-align: center; padding: 30px;">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">📦</div>
                <h4>No orders placed yet</h4>
                <p class="text-muted">Once you place an order, your grocery deliveries and tracking will appear here.</p>
              </div>
            `;
            return;
          }

          ordersListContainer.innerHTML = '';
          orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.style.cssText = 'background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 14px;';
            const itemsSummary = (order.items || []).map(i => `${i.product_name || i.name} (x${i.quantity})`).join(', ') || 'Grocery Basket';
            const dateStr = order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent';
            const statusClass = (order.status || 'confirmed').toLowerCase().replace(/\s+/g, '-');

            orderCard.innerHTML = `
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                  <strong style="font-size: 1rem; color: var(--text-main);">${order.order_number}</strong>
                  <span class="text-muted" style="font-size: 0.78rem; display: block;">Placed on ${dateStr}</span>
                </div>
                <span class="status-badge ${statusClass}">${order.status}</span>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
                <strong>Items:</strong> ${itemsSummary}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color); padding-top: 8px; font-size: 0.88rem;">
                <span class="text-muted">Delivery: ${order.delivery_slot || 'Standard'}</span>
                <strong style="color: var(--primary); font-size: 1.05rem;">₹${parseFloat(order.total).toFixed(2)}</strong>
              </div>
            `;
            ordersListContainer.appendChild(orderCard);
          });
        } catch (err) {
          if (ordersListContainer) {
            ordersListContainer.innerHTML = `<p class="text-danger" style="text-align: center; padding: 20px;">Could not load orders: ${err.message}</p>`;
          }
        }
      };

      if (closeOrders) closeOrders.addEventListener('click', () => {
        if (ordersModal) ordersModal.style.display = 'none';
      });
      if (ordersModal) ordersModal.addEventListener('click', (e) => {
        if (e.target === ordersModal) ordersModal.style.display = 'none';
      });
      window.addEventListener('open-customer-orders-modal', openCustomerOrders);

      // Customer Profile Modal
      const profileModal = document.getElementById('customerProfileModalBackdrop');
      const closeProfile = document.getElementById('closeCustProfileModal');
      const closeProfileBtn = document.getElementById('closeProfileBtn');
      const logoutProfileBtn = document.getElementById('custProfileLogoutBtn');

      const openProfileModal = () => {
        if (!profileModal) return;
        const user = typeof Auth !== 'undefined' ? Auth.getUser() : null;
        if (!user) {
          window.location.href = '/user-login';
          return;
        }

        const avatar = document.getElementById('custProfileAvatar');
        const name = document.getElementById('custProfileName');
        const email = document.getElementById('custProfileEmail');
        const phone = document.getElementById('custProfilePhone');

        if (avatar) avatar.textContent = (user.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        if (name) name.textContent = user.name || 'Customer';
        if (email) email.textContent = user.email || '';
        if (phone) phone.textContent = user.phone || 'Not specified';

        profileModal.style.display = 'flex';
      };

      if (closeProfile) closeProfile.addEventListener('click', () => {
        if (profileModal) profileModal.style.display = 'none';
      });
      if (closeProfileBtn) closeProfileBtn.addEventListener('click', () => {
        if (profileModal) profileModal.style.display = 'none';
      });
      if (profileModal) profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) profileModal.style.display = 'none';
      });
      if (logoutProfileBtn) logoutProfileBtn.addEventListener('click', () => {
        if (typeof Auth !== 'undefined') Auth.logout('/');
      });
      window.addEventListener('open-customer-profile-modal', openProfileModal);
    }
  };

  App.init();
});
