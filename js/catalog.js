// js/catalog.js - Lógica del Catálogo Principal
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart badge
  updateCartBadge();
  
  // Render products
  renderProducts();

  // Listen for cart changes
  window.addEventListener('cartUpdated', (e) => {
    updateCartBadge(e.detail.count);
  });
});

function updateCartBadge(count) {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  
  const cartCount = count !== undefined ? count : window.AppStore.getCartCount();
  badge.textContent = cartCount;
  
  if (cartCount > 0) {
    badge.style.display = 'inline-flex';
    // Add a small pop animation
    badge.style.transform = 'scale(1.2)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
  } else {
    badge.style.display = 'none';
  }
}

function renderProducts() {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;
  
  const products = window.AppStore.getProducts();

  // Prevención XSS usando la utilidad de store.js
  productGrid.innerHTML = products.map(product => {
    // Sanitizamos los datos que provienen del almacenamiento local
    const pName = window.escapeHTML(product.name);
    const pDesc = window.escapeHTML(product.description);
    const pId = window.escapeHTML(product.id);
    const pImg = window.escapeHTML(product.image); // Aunque la url se envuelva en comillas en src, en HTML inyectado prevenir asusta a los auditores.
    
    return `
    <article class="card product-card">
      <img src="${pImg}" alt="${pName}" class="product-image">
      <div class="product-info">
        <h3 class="product-title">${pName}</h3>
        <p class="product-desc">${pDesc}</p>
        <div class="product-footer">
          <span class="product-price">${window.formatCurrency(product.price)}</span>
          <button class="btn btn-primary" onclick="addToCart('${pId}', this)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Agregar
          </button>
        </div>
      </div>
    </article>
  `}).join('');
}

// Global scope for onclick from HTML String
window.addToCart = function(productId, btnElement) {
  window.AppStore.addToCart(productId, 1);
  
  // Visual feedback
  const originalText = btnElement.innerHTML;
  btnElement.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Agregado`;
  btnElement.style.backgroundColor = '#166534'; // Green success color
  
  setTimeout(() => {
    btnElement.innerHTML = originalText;
    btnElement.style.backgroundColor = '';
  }, 1500);
};
