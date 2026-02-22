// ================================================
// main.js — Utility + Cart + Modal + Component Loader
// ================================================

// ── Format Helpers ──────────────────────────────
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatWeight(grams) {
    return grams < 1000 ? `${grams} gram` : `${(grams / 1000).toFixed(1)} kg`;
}

function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function getCategoryName(category) {
    const map = {
        'tradisional': 'Mainan Tradisional',
        'edukatif'   : 'Mainan Edukatif',
        'kayu'       : 'Mainan Kayu',
        'outdoor'    : 'Outdoor'
    };
    return map[category] || category;
}

// ── Navigation ───────────────────────────────────
function viewProductDetail(productId) {
    openProductModal(productId);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', function () {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) btn.classList.toggle('show', (window.scrollY || window.pageYOffset) > 300);
});

// ── WhatsApp ─────────────────────────────────────
function orderViaWhatsApp(product) {
    const msg = encodeURIComponent(
        `Halo, saya tertarik dengan produk:\n\n` +
        `Nama     : ${product.name}\n` +
        `Harga    : ${formatCurrency(product.price)}\n` +
        `Kategori : ${getCategoryName(product.category)}\n\n` +
        `Apakah produk ini masih tersedia?`
    );
    window.open(`https://wa.me/628122940513?text=${msg}`, '_blank');
}

function shareProduct(product) {
    if (navigator.share) {
        navigator.share({ title: product.name, text: product.description, url: window.location.href });
    } else {
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert('Link produk telah disalin!'));
    }
}

// ================================================
// CART SYSTEM
// ================================================
let cart = [];

function addToCart(productId) {
    // products harus sudah di-load lewat products.js
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;

    if (product.stock === 0) {
        alert('Maaf, produk ini sedang habis.');
        return;
    }

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartBadge();
    showToast(`${product.name} ditambahkan ke keranjang`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== parseInt(productId));
    updateCartBadge();
    renderCart();
}

function updateQty(productId, delta) {
    const item = cart.find(i => i.id === parseInt(productId));
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(productId);
    else {
        updateCartBadge();
        renderCart();
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const total = cart.reduce((sum, i) => sum + i.qty, 0);
    if (total > 0) {
        badge.textContent = total;
        badge.classList.remove('d-none');
    } else {
        badge.classList.add('d-none');
    }
}

function getCartTotal() {
    return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function openCart() {
    renderCart();
    const modal = new bootstrap.Modal(document.getElementById('cartModal'));
    modal.show();
}

function renderCart() {
    const body   = document.getElementById('cartModalBody');
    const footer = document.getElementById('cartModalFooter');
    if (!body || !footer) return;

    if (cart.length === 0) {
        body.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Keranjang masih kosong</h5>
                <p class="text-muted small">Tambahkan produk dari katalog</p>
                <button class="btn btn-primary mt-2" data-bs-dismiss="modal" onclick="window.location.href='index.html'">
                    <i class="fas fa-store me-2"></i> Lihat Katalog
                </button>
            </div>`;
        footer.innerHTML = '';
        return;
    }

    // Render cart items
    body.innerHTML = cart.map(item => `
        <div class="d-flex align-items-center gap-3 py-3 border-bottom">
            <img src="${item.image}" alt="${item.name}"
                 style="width:70px;height:70px;object-fit:cover;border-radius:8px;"
                 onerror="this.src='images/products/placeholder.jpg'">
            <div class="flex-grow-1">
                <h6 class="mb-1 fw-bold">${item.name}</h6>
                <span class="badge bg-light text-dark border small">${getCategoryName(item.category)}</span>
                <div class="text-primary fw-bold mt-1">${formatCurrency(item.price)}</div>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-outline-secondary btn-sm" onclick="updateQty(${item.id}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="fw-bold px-1">${item.qty}</span>
                <button class="btn btn-outline-secondary btn-sm" onclick="updateQty(${item.id}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm ms-1" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Footer: total + checkout
    const total = getCartTotal();
    footer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center w-100 px-1">
            <span class="fw-bold fs-5">Total:</span>
            <span class="fw-bold fs-5 text-primary">${formatCurrency(total)}</span>
        </div>
        <button class="btn btn-success btn-lg w-100" onclick="checkoutViaWhatsApp()">
            <i class="fab fa-whatsapp me-2"></i> Checkout via WhatsApp
        </button>
        <button class="btn btn-outline-danger btn-sm w-100" onclick="clearCart()">
            <i class="fas fa-trash me-1"></i> Kosongkan Keranjang
        </button>
    `;
}

function clearCart() {
    if (!confirm('Kosongkan semua keranjang?')) return;
    cart = [];
    updateCartBadge();
    renderCart();
}

function checkoutViaWhatsApp() {
    if (cart.length === 0) return;

    const itemLines = cart.map(i =>
        `• ${i.name} x${i.qty} = ${formatCurrency(i.price * i.qty)}`
    ).join('\n');

    const total = formatCurrency(getCartTotal());

    const msg = encodeURIComponent(
        `Halo, saya ingin memesan produk berikut:\n\n` +
        `${itemLines}\n\n` +
        `*Total: ${total}*\n\n` +
        `Mohon konfirmasi ketersediaan dan info pengiriman. Terima kasih!`
    );

    window.open(`https://wa.me/628122940513?text=${msg}`, '_blank');
}

// ================================================
// PRODUCT MODAL
// ================================================
function openProductModal(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;

    const stockStatus = product.stock > 10
        ? `<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i>Stok Tersedia</span>`
        : product.stock > 0
            ? `<span class="badge bg-warning text-dark"><i class="fas fa-exclamation-circle me-1"></i>Stok Terbatas</span>`
            : `<span class="badge bg-danger"><i class="fas fa-times-circle me-1"></i>Habis</span>`;

    document.getElementById('productModalBody').innerHTML = `
        <div class="row g-4">
            <!-- Gambar -->
            <div class="col-lg-5">
                <img src="${product.image}" class="img-fluid rounded-3 shadow-sm w-100"
                     style="max-height:380px;object-fit:cover;"
                     alt="${product.name}"
                     onerror="this.src='images/products/placeholder.jpg'">
                <button class="btn btn-outline-secondary w-100 mt-3"
                        onclick="shareProduct(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    <i class="fas fa-share-alt me-1"></i> Bagikan Produk
                </button>
            </div>
            <!-- Info -->
            <div class="col-lg-7">
                <div class="d-flex flex-wrap gap-2 mb-3">
                    <span class="badge bg-primary">${getCategoryName(product.category)}</span>
                    ${stockStatus}
                </div>
                <h3 class="fw-bold mb-2">${product.name}</h3>
                <h4 class="text-primary fw-bold mb-3">${formatCurrency(product.price)}</h4>

                <!-- Deskripsi -->
                <p class="text-muted mb-3">${product.description}</p>

                <!-- Spesifikasi -->
                <div class="row g-2 mb-3">
                    <div class="col-6">
                        <div class="d-flex align-items-center gap-2 small">
                            <i class="fas fa-box text-primary"></i>
                            <span><strong>Material:</strong> ${product.material}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="d-flex align-items-center gap-2 small">
                            <i class="fas fa-child text-primary"></i>
                            <span><strong>Usia:</strong> ${product.ageRange}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="d-flex align-items-center gap-2 small">
                            <i class="fas fa-weight text-primary"></i>
                            <span><strong>Berat:</strong> ${formatWeight(product.weight)}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="d-flex align-items-center gap-2 small">
                            <i class="fas fa-map-marker-alt text-primary"></i>
                            <span><strong>Asal:</strong> ${product.origin}</span>
                        </div>
                    </div>
                </div>

                <!-- Fitur -->
                <ul class="feature-list mb-4">
                    ${product.features.map(f => `<li>${f}</li>`).join('')}
                </ul>

                <!-- Tombol Aksi -->
                <div class="d-flex flex-column gap-2">
                    <button class="btn btn-primary btn-lg"
                            onclick="addToCart(${product.id})"
                            ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart me-2"></i> Tambah ke Keranjang
                    </button>
                    <button class="btn btn-success btn-lg"
                            onclick="orderViaWhatsApp(${JSON.stringify(product).replace(/"/g, '&quot;')})"
                            ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fab fa-whatsapp me-2"></i> Pesan via WhatsApp
                    </button>
                </div>
            </div>
        </div>
    `;

    new bootstrap.Modal(document.getElementById('productModal')).show();
}

// ================================================
// TOAST NOTIFICATION
// ================================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const id = 'toast-' + Date.now();
    const bg = { success: 'bg-success', error: 'bg-danger', warning: 'bg-warning', info: 'bg-info' }[type] || 'bg-info';

    container.insertAdjacentHTML('beforeend', `
        <div id="${id}" class="toast align-items-center text-white ${bg} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `);

    const el = document.getElementById(id);
    const toast = new bootstrap.Toast(el, { delay: 2500 });
    toast.show();
    el.addEventListener('hidden.bs.toast', () => el.remove());
}

// ================================================
// COMPONENT LOADER
// ================================================
function loadComponents() {
    fetch('components.html')
        .then(res => {
            if (!res.ok) throw new Error('Gagal memuat components.html');
            return res.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Inject navbar
            const navbar = doc.getElementById('main-navbar');
            const navbarPlaceholder = document.getElementById('navbar-placeholder');
            if (navbar && navbarPlaceholder) {
                navbarPlaceholder.replaceWith(navbar);
                setActiveNavLink();
            }

            // Inject modals (product + cart) — diletakkan di body
            ['productModal', 'cartModal'].forEach(id => {
                const modal = doc.getElementById(id);
                if (modal && !document.getElementById(id)) {
                    document.body.appendChild(modal);
                }
            });

            // Inject footer
            const footer = doc.getElementById('main-footer');
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footer && footerPlaceholder) {
                footerPlaceholder.replaceWith(footer);
            }
        })
        .catch(err => console.error(err));
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === currentPage);
    });
}

// ================================================
// DOM READY
// ================================================
document.addEventListener('DOMContentLoaded', function () {
    loadComponents();
});

// ── Form Helpers ─────────────────────────────────
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            valid = false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    });
    return valid;
}

function clearValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.querySelectorAll('.is-invalid, .is-valid').forEach(f => {
        f.classList.remove('is-invalid', 'is-valid');
    });
}

// ── LocalStorage Helpers ──────────────────────────
function saveToLocalStorage(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); return true; }
    catch (e) { return false; }
}

function getFromLocalStorage(key) {
    try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : null; }
    catch (e) { return null; }
}