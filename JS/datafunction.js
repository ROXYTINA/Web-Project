// Save all products to localStorage (called from seller-panel)
function saveAllProducts(products) {
  localStorage.setItem('all_products', JSON.stringify(products));
}

// Get all products from localStorage (used in Customer-panel)
function getAllProducts() {
  return JSON.parse(localStorage.getItem('all_products') || '[]');
}

// Add or update a product (called from seller-panel)
function addOrUpdateProduct(product, index = null) {
  let products = getAllProducts();
  if (index !== null && products[index]) {
    products[index] = product;
  } else {
    products.push(product);
  }
  saveAllProducts(products);
}

// Delete a product (called from seller-panel)
function deleteProductByIndex(index) {
  let products = getAllProducts();
  products.splice(index, 1);
  saveAllProducts(products);
}

// Get products by category (used in Customer-panel)
function getProductsByCategory(category) {
  return getAllProducts().filter(p => p.category === category);
}

// Get product by name (optional utility)
function getProductByName(name) {
  return getAllProducts().find(p => p.name === name);
}