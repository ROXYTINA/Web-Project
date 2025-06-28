/* ================== USER INTERFACE LOGIC ================== */
// Account info panel toggle and user info fill
document.addEventListener('DOMContentLoaded', function() {
  // Account info toggle
  const accountBtn = document.getElementById('customer-account-btn');
  if (accountBtn) {
    accountBtn.addEventListener('click', function() {
      const container = document.getElementById('account-info-container');
      container.classList.toggle('hidden');
    });
  }
  // Fill user info from localStorage
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  if (username) document.getElementById('account-username').textContent = username;
  if (email) document.getElementById('account-email').textContent = email;

  // Product info modal logic
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function (e) {
      if (e.target.tagName === 'BUTTON') return;
      document.getElementById('panel-product-img').src = card.dataset.img || '';
      document.getElementById('panel-product-name').textContent = card.dataset.name || '';
      document.getElementById('panel-product-price').textContent = card.dataset.price || '';
      document.getElementById('panel-product-category').textContent = "Category: " + (card.dataset.category || '');
      document.getElementById('panel-product-description').textContent = card.dataset.description || '';
      document.getElementById('panel-product-seller').textContent = "Seller: " + (card.dataset.seller || '');
      document.getElementById('product-info-panel').classList.remove('hidden');
    });
  });
  document.getElementById('close-product-info').onclick = function () {
    document.getElementById('product-info-panel').classList.add('hidden');
  };
  document.getElementById('product-info-panel').addEventListener('click', function(e) {
    if (e.target === this) this.classList.add('hidden');
  });

/* ================== CART FUNCTIONALITY ================== */
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  function updateCartCount() {
    const count = cart.length;
    const badge = document.getElementById('cart-count');
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  // Add to cart (only one of each product)
  function addToCart(product) {
    if (cart.some(item => item.name === product.name)) {
      alert('This product is already in your cart.');
      return;
    }
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Added to cart: ' + product.name);
  }

  // Add to cart from product cards
  document.querySelectorAll('.product-card .bg-pink-600').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const product = {
        name: card.dataset.name,
        price: parseFloat(card.dataset.price.replace('$','')),
        img: card.dataset.img
      };
      addToCart(product);
    });
  });

  // Add to cart from product info modal
  document.querySelector('#product-info-panel .bg-pink-600').addEventListener('click', function(e) {
    e.stopPropagation();
    const name = document.getElementById('panel-product-name').textContent;
    const price = parseFloat(document.getElementById('panel-product-price').textContent.replace('$',''));
    const img = document.getElementById('panel-product-img').src;
    const product = { name, price, img };
    addToCart(product);
  });

  // Cart panel open/close
  document.getElementById('cart-btn').onclick = function() {
    renderCart();
    document.getElementById('cart-panel').classList.remove('hidden');
  };
  document.getElementById('close-cart-panel').onclick = function () {
    document.getElementById('cart-panel').classList.add('hidden');
  };
  document.getElementById('cart-panel').addEventListener('click', function(e) {
    if (e.target === this) this.classList.add('hidden');
  });

  // Render cart items
  function renderCart() {
    const itemsDiv = document.getElementById('cart-items');
    if (cart.length === 0) {
      itemsDiv.innerHTML = '<div class="text-center text-gray-400 italic py-8">Your cart is empty.<br>🛒</div>';
      document.getElementById('cart-total').textContent = '0.00';
      return;
    }
    let total = 0;
    itemsDiv.innerHTML = cart.map((item, i) => {
      total += item.price;
      return `
        <div class="flex items-center bg-pink-50 rounded-xl p-3 shadow border border-pink-100">
          <img src="${item.img}" alt="${item.name}" class="w-14 h-14 rounded-lg mr-4 border-2 border-pink-200 shadow">
          <div class="flex-1">
            <div class="font-bold text-pink-800 text-lg">${item.name}</div>
            <div class="text-pink-600 font-semibold">$${item.price.toFixed(2)}</div>
          </div>
          <button onclick="removeCartItem(${i})" class="ml-2 text-pink-400 hover:text-pink-700 text-2xl font-bold transition" title="Remove">&times;</button>
        </div>
      `;
    }).join('');
    document.getElementById('cart-total').textContent = total.toFixed(2);
  }

  // Remove item from cart
  window.removeCartItem = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
  };

/* ================== CHECKOUT PANEL LOGIC ================== */
  // Open checkout panel from cart panel (prevent if cart is empty)
  document.querySelector('#cart-panel button.bg-gradient-to-r').addEventListener('click', function() {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }
    document.getElementById('checkout-total').textContent = document.getElementById('cart-total').textContent;
    document.getElementById('checkout-panel').classList.remove('hidden');
    document.getElementById('checkout-form').classList.remove('hidden');
    document.getElementById('checkout-success').classList.add('hidden');
  });

  // Close checkout panel
  document.getElementById('close-checkout-panel').onclick = function () {
    document.getElementById('checkout-panel').classList.add('hidden');
  };
  document.getElementById('checkout-panel').addEventListener('click', function(e) {
    if (e.target === this) this.classList.add('hidden');
  });

  // Payment method logic (show/hide card/QR fields)
  document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const cardFields = document.getElementById('card-fields');
      const qrFields = document.getElementById('qr-fields');
      if (this.value === 'card') {
        cardFields.classList.remove('hidden');
        qrFields.classList.add('hidden');
      } else if (this.value === 'qr') {
        qrFields.classList.remove('hidden');
        cardFields.classList.add('hidden');
      } else {
        cardFields.classList.add('hidden');
        qrFields.classList.add('hidden');
      }
    });
  });

  // Handle checkout form submit
  document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('checkout-form').classList.add('hidden');
    document.getElementById('checkout-success').classList.remove('hidden');
    // Clear cart after successful checkout
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    // Hide checkout panel after 2 seconds
    setTimeout(function() {
      document.getElementById('checkout-panel').classList.add('hidden');
      document.getElementById('checkout-form').reset();
      document.getElementById('checkout-form').classList.remove('hidden');
      document.getElementById('checkout-success').classList.add('hidden');
      document.getElementById('card-fields').classList.add('hidden');
      document.getElementById('qr-fields').classList.add('hidden');
    }, 2000);
  });

  // Initialize cart count on page load
  updateCartCount();
});

// Cart panel open/close
document.getElementById('cart-btn').onclick = function() {
  renderCart();
  document.getElementById('cart-panel').classList.remove('hidden');
};
