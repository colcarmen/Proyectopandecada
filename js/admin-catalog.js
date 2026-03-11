// js/admin-catalog.js - Lógica del Panel de Administración del Catálogo
document.addEventListener('DOMContentLoaded', () => {
  renderProductsList();
});

function renderProductsList() {
  const products = window.AppStore.getProducts();
  const container = document.getElementById('productsContainer');
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = `<p class="text-muted text-center" style="padding: 2rem;">No hay productos en el catálogo.</p>`;
    return;
  }

  // Prevención XSS al mostrar productos a un administrador
  container.innerHTML = products.map(product => {
    const pName = window.escapeHTML(product.name);
    const pImg = window.escapeHTML(product.image);
    const pId = window.escapeHTML(product.id);
    
    return `
    <div class="product-list-item">
      <img src="${pImg}" alt="${pName}" class="product-list-img" onerror="this.src='https://via.placeholder.com/60?text=Error'">
      <div style="flex-grow: 1;">
        <div style="font-weight: 600;">${pName}</div>
        <div style="color: var(--text-muted); font-size: 0.9rem;">${window.formatCurrency(product.price)}</div>
      </div>
      <button class="btn btn-outline" style="padding: 0.4rem 0.6rem; font-size: 0.8rem;" onclick="editProduct('${pId}')">Editar</button>
      <button class="btn btn-outline" style="padding: 0.4rem 0.6rem; font-size: 0.8rem; border-color: #ef4444; color: #ef4444;" onclick="deleteProduct('${pId}')">Borrar</button>
    </div>
  `}).join('');
}

// Global scope for bindings in HTML
window.handleSaveProduct = function(e) {
  e.preventDefault();

  const id = document.getElementById('productId').value;
  const product = {
    name: document.getElementById('productName').value,
    price: parseFloat(document.getElementById('productPrice').value),
    image: document.getElementById('productImage').value,
    description: document.getElementById('productDesc').value
  };

  if (id) {
    product.id = id;
    window.AppStore.updateProduct(product);
  } else {
    window.AppStore.addProduct(product);
  }

  resetForm();
  renderProductsList();
  
  // Visual feedback opcional: Toast o alerta simple (mantenemos alert por ahora)
  alert(id ? "Producto actualizado con éxito." : "Producto agregado con éxito.");
};

window.editProduct = function(id) {
  const product = window.AppStore.getProductById(id);
  if (!product) return;

  document.getElementById('formTitle').textContent = 'Editar Producto';
  document.getElementById('productId').value = product.id;
  document.getElementById('productName').value = product.name;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productImage').value = product.image;
  document.getElementById('productDesc').value = product.description;

  document.getElementById('saveBtn').textContent = 'Guardar Cambios';
  document.getElementById('cancelBtn').style.display = 'inline-flex';
};

window.deleteProduct = function(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    window.AppStore.deleteProduct(id);
    renderProductsList();
  }
};

window.resetForm = function() {
  const form = document.getElementById('productForm');
  if(form) form.reset();
  
  document.getElementById('productId').value = '';
  document.getElementById('formTitle').textContent = 'Añadir Nuevo Producto';
  document.getElementById('saveBtn').textContent = 'Guardar Producto';
  document.getElementById('cancelBtn').style.display = 'none';
};
