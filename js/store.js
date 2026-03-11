// js/store.js - Centralized state management using localStorage

const STORE_KEYS = {
  PRODUCTS: 'pandecasa_products',
  CART: 'pandecasa_cart',
  ORDERS: 'pandecasa_orders'
};

const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'Hogaza de Masa Madre',
    description: 'Fermentación lenta de 48 horas, corteza crujiente y miga aireada.',
    price: 85.00,
    image: 'https://images.unsplash.com/photo-1585478259715-876a6a81fa08?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p2',
    name: 'Baguette Rústica',
    description: 'Clásica receta francesa, ideal para acompañar tus comidas.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p3',
    name: 'Concha de Vainilla',
    description: 'Dulce tradicional mexicano con una crujiente costra de azúcar.',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1551101966-282672b1ac8a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p4',
    name: 'Focaccia de Romero',
    description: 'Con aceite de oliva extra virgen, romero fresco y sal de mar.',
    price: 95.00,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70912?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p5',
    name: 'Croissant de Mantequilla',
    description: 'Capas hojaldradas y un sabor intenso a mantequilla.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1555507036-ab1e4006aaeb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p6',
    name: 'Pan de Centeno',
    description: 'Denso y nutritivo, perfecto para sándwiches robustos.',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'
  }
];

class Store {
  constructor() {
    this.init();
  }

  /**
   * Inicializa el almacenamiento local con datos por defecto si están vacíos.
   * Maneja errores en caso de que el localStorage esté desactivado o lleno.
   */
  init() {
    try {
      if (!localStorage.getItem(STORE_KEYS.PRODUCTS)) {
        localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
      }
      if (!localStorage.getItem(STORE_KEYS.CART)) {
        localStorage.setItem(STORE_KEYS.CART, JSON.stringify([]));
      }
      if (!localStorage.getItem(STORE_KEYS.ORDERS)) {
        localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify([]));
      }
    } catch (error) {
      console.warn('Advertencia: localStorage no está disponible o accesible.', error);
    }
  }

  // --- Products ---
  
  /**
   * Obtiene todos los productos del almacenamiento.
   * @returns {Array} Listado de productos.
   */
  getProducts() {
    try {
      const data = localStorage.getItem(STORE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error parseando productos de localStorage:', e);
      return [];
    }
  }

  /**
   * Obtiene un producto por su ID.
   * @param {string} id El ID del producto.
   * @returns {Object|undefined} El producto encontrado o undefined.
   */
  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  }

  addProduct(product) {
    const products = this.getProducts();
    const newProduct = {
      ...product,
      id: 'p' + Date.now()
    };
    products.push(newProduct);
    localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  }

  updateProduct(updatedProduct) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(products));
    }
  }

  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  // --- Cart ---
  
  /**
   * Obtiene el carrito del almacenamiento.
   * @returns {Array} Listado de items en el carrito.
   */
  getCart() {
    try {
      const data = localStorage.getItem(STORE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error parseando carrito de localStorage:', e);
      return [];
    }
  }

  addToCart(productId, quantity = 1) {
    const cart = this.getCart();
    const product = this.getProductById(productId);
    
    if (!product) return;

    const existingItem = cart.find(item => item.product.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    try {
      localStorage.setItem(STORE_KEYS.CART, JSON.stringify(cart));
      this.notifyCartUpdated();
    } catch(e) { console.error('Error guardando en carrito:', e); }
  }

  updateCartItemQuantity(productId, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => item.product.id !== productId);
    } else {
      const item = cart.find(i => i.product.id === productId);
      if (item) item.quantity = quantity;
    }
    try {
      localStorage.setItem(STORE_KEYS.CART, JSON.stringify(cart));
      this.notifyCartUpdated();
    } catch(e) { console.error('Error actualizando cantidad en carrito:', e); }
  }

  clearCart() {
    try {
      localStorage.setItem(STORE_KEYS.CART, JSON.stringify([]));
      this.notifyCartUpdated();
    } catch(e) { console.error('Error limpiando carrito:', e); }
  }

  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }

  notifyCartUpdated() {
    const event = new CustomEvent('cartUpdated', { detail: { count: this.getCartCount(), total: this.getCartTotal() } });
    window.dispatchEvent(event);
  }

  // --- Orders ---
  
  /**
   * Obtiene todas las órdenes del almacenamiento.
   * @returns {Array} Listado de órdenes ordenadas por fecha reciente.
   */
  getOrders() {
    try {
      const data = localStorage.getItem(STORE_KEYS.ORDERS);
      const orders = data ? JSON.parse(data) : [];
      return orders.sort((a, b) => b.createdAt - a.createdAt);
    } catch (e) {
      console.error('Error parseando ordenes de localStorage:', e);
      return [];
    }
  }

  getOrderById(id) {
    return this.getOrders().find(o => o.id === id);
  }

  placeOrder(customerData) {
    const cart = this.getCart();
    if (cart.length === 0) return null;

    const orders = this.getOrders();
    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      items: [...cart],
      total: this.getCartTotal(),
      customer: customerData,
      status: 'pending', // pending, prep, ready, delivered
      createdAt: Date.now()
    };

    orders.push(newOrder);
    localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify(orders));
    this.clearCart();
    
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify(orders));
    }
  }

  getOrdersByStatus(status) {
    return this.getOrders().filter(o => o.status === status);
  }
}

// Global instance
const store = new Store();

// Format currency helper
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(value);
};

// Date formatter
const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateString));
};

// Helper for HTML sanitization to prevent XSS (ISO 27001)
const escapeHTML = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag])
  );
};

// Export to window
window.AppStore = store;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.escapeHTML = escapeHTML; // Exposed globally for use in rendering
