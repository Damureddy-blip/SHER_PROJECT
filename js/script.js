document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('pageLoader');
  const backToTop = document.getElementById('backToTop');
  const yearEls = document.querySelectorAll('#year');
  const cartCount = document.getElementById('cartCount');
  const modalTitle = document.getElementById('quickViewTitle');
  const modalBody = document.getElementById('quickViewBody');
  const quickViewButtons = document.querySelectorAll('.quick-view');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartItemsContainer = document.getElementById('cartItems');
  const subtotalEl = document.getElementById('subtotal');
  const gstEl = document.getElementById('gst');
  const shippingEl = document.getElementById('shipping');
  const grandTotalEl = document.getElementById('grandTotal');

  yearEls.forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  setTimeout(() => {
    loader?.classList.add('hidden');
  }, 500);

  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => revealObserver.observe(item));

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('sherCart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
  };

  const renderCart = () => {
    if (!cartItemsContainer) return;

    const cart = JSON.parse(localStorage.getItem('sherCart') || '[]');
    if (!cart.length) {
      cartItemsContainer.innerHTML = '<p class="text-muted mb-0">Your cart is empty.</p>';
      if (subtotalEl) subtotalEl.textContent = '₹0';
      if (gstEl) gstEl.textContent = '₹0';
      if (shippingEl) shippingEl.textContent = '₹0';
      if (grandTotalEl) grandTotalEl.textContent = '₹0';
      return;
    }

    let subtotal = 0;
    cartItemsContainer.innerHTML = cart.map((item) => {
      subtotal += item.price * item.quantity;
      return `
        <div class="d-flex justify-content-between align-items-center border-bottom py-3">
          <div class="d-flex align-items-center gap-3">
            <img src="${item.image}" alt="${item.name}" width="70" height="70" class="rounded-3" />
            <div>
              <h6 class="mb-1">${item.name}</h6>
              <p class="text-muted small mb-0">Qty: ${item.quantity}</p>
            </div>
          </div>
          <div class="fw-bold">₹${item.price * item.quantity}</div>
        </div>`;
    }).join('');

    const gst = subtotal * 0.18;
    const shipping = subtotal > 0 ? 40 : 0;
    const grandTotal = subtotal + gst + shipping;

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (gstEl) gstEl.textContent = `₹${gst.toFixed(0)}`;
    if (shippingEl) shippingEl.textContent = `₹${shipping}`;
    if (grandTotalEl) grandTotalEl.textContent = `₹${grandTotal.toFixed(0)}`;
  };

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const cart = JSON.parse(localStorage.getItem('sherCart') || '[]');
      const item = {
        name: button.dataset.name,
        price: Number(button.dataset.price),
        image: button.dataset.image,
        quantity: 1
      };
      const existing = cart.find((entry) => entry.name === item.name);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push(item);
      }
      localStorage.setItem('sherCart', JSON.stringify(cart));
      updateCartCount();
      renderCart();
      alert(`${item.name} added to cart.`);
    });
  });

  quickViewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      modalTitle.textContent = button.dataset.name;
      modalBody.innerHTML = `
        <p class="text-muted">${button.dataset.description}</p>
        <p class="fw-bold text-primary">${button.dataset.price}</p>
      `;
      const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
      modal.show();
    });
  });

  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 500 ? 'block' : 'none';
  });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  updateCartCount();
  renderCart();
});
