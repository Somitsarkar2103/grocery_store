/**
 * FreshCart Cart & Wishlist State Management
 */
const CartState = {
  items: [],
  coupon: null,
  listeners: [],
  wishlistListeners: [],
  wishlist: [],

  init() {
    try {
      const savedCart = localStorage.getItem('freshcart_cart_v1');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
      const savedCoupon = localStorage.getItem('freshcart_coupon_v1');
      if (savedCoupon) {
        this.coupon = JSON.parse(savedCoupon);
      }
      const savedWishlist = localStorage.getItem('freshcart_wishlist_v1');
      if (savedWishlist) {
        this.wishlist = JSON.parse(savedWishlist);
      }
    } catch (e) {
      console.warn('Could not parse cart from localStorage:', e);
      this.items = [];
      this.wishlist = [];
      this.coupon = null;
    }
  },

  save() {
    localStorage.setItem('freshcart_cart_v1', JSON.stringify(this.items));
    if (this.coupon) {
      localStorage.setItem('freshcart_coupon_v1', JSON.stringify(this.coupon));
    } else {
      localStorage.removeItem('freshcart_coupon_v1');
    }
    this.notify();
  },

  saveWishlist() {
    localStorage.setItem('freshcart_wishlist_v1', JSON.stringify(this.wishlist));
    this.notifyWishlist();
  },

  subscribe(fn) {
    this.listeners.push(fn);
    fn(this.getCalculations());
  },

  notify() {
    const calc = this.getCalculations();
    this.listeners.forEach(fn => fn(calc));
  },

  subscribeWishlist(fn) {
    this.wishlistListeners.push(fn);
    fn(this.wishlist);
  },

  notifyWishlist() {
    this.wishlistListeners.forEach(fn => fn(this.wishlist));
  },

  addItem(product, quantity = 1) {
    const existingIndex = this.items.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        original_price: product.original_price ? parseFloat(product.original_price) : null,
        image_url: product.image_url,
        unit: product.unit || '1 unit',
        quantity: quantity
      });
    }
    this.save();
  },

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
  },

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.save();
      }
    }
  },

  clearCart() {
    this.items = [];
    this.coupon = null;
    this.save();
  },

  applyCoupon(couponData) {
    this.coupon = couponData;
    this.save();
  },

  removeCoupon() {
    this.coupon = null;
    this.save();
  },

  getCalculations() {
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);

    const freeShippingThreshold = 35.00;
    const isFreeShipping = subtotal >= freeShippingThreshold || (this.coupon && this.coupon.code === 'FREESHIP');
    const deliveryFee = subtotal === 0 ? 0 : (isFreeShipping ? 0 : 4.99);
    const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
    const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

    let discount = 0;
    if (this.coupon && subtotal > 0) {
      if (this.coupon.discount_percent > 0) {
        discount = (subtotal * this.coupon.discount_percent) / 100;
      } else if (this.coupon.discount_amount > 0) {
        discount = Math.min(subtotal, this.coupon.discount_amount);
      }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = subtotal === 0 ? 0 : taxableAmount * 0.05; // 5% estimated sales tax
    const total = subtotal === 0 ? 0 : Math.max(0, subtotal - discount + deliveryFee + tax);

    return {
      items: this.items,
      itemCount,
      subtotal: parseFloat(subtotal.toFixed(2)),
      deliveryFee: parseFloat(deliveryFee.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      coupon: this.coupon,
      isFreeShipping,
      freeShippingRemaining: parseFloat(freeShippingRemaining.toFixed(2)),
      freeShippingPercent
    };
  },

  // Wishlist Methods
  toggleWishlist(product) {
    const index = this.wishlist.findIndex(item => item.id === product.id);
    let added = false;
    if (index > -1) {
      this.wishlist.splice(index, 1);
      added = false;
    } else {
      this.wishlist.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image_url: product.image_url,
        unit: product.unit || '1 unit'
      });
      added = true;
    }
    this.saveWishlist();
    return added;
  },

  isInWishlist(productId) {
    return this.wishlist.some(item => item.id === productId);
  }
};

CartState.init();
