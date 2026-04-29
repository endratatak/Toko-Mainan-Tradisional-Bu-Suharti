// Catalog functionality
// getCategoryName(), truncateText(), formatCurrency(),
// openProductModal(), addToCart() — semua di main.js

const catalogProducts = products.filter(p => p.price > 0);
let filteredProducts = [...catalogProducts];

const activeFilters = { category: '', price: '', search: '' };

document.addEventListener('DOMContentLoaded', function() {
    showSkeletons();
    setupEventListeners();
    readURL();
});

// ── Filter State ──────────────────────────────────

function setFilter(key, value) {
    activeFilters[key] = value;
    syncUI();
    updateURL();
    applyFilters();
}

function syncUI() {
    document.getElementById('searchInput').value      = activeFilters.search;
    document.getElementById('categoryFilter').value   = activeFilters.category;
    document.getElementById('priceFilter').value      = activeFilters.price;

    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.cat === activeFilters.category);
    });
}

function updateURL() {
    const params = new URLSearchParams();
    if (activeFilters.search)   params.set('search',   activeFilters.search);
    if (activeFilters.category) params.set('category', activeFilters.category);
    if (activeFilters.price)    params.set('price',    activeFilters.price);
    history.replaceState(null, '', params.toString() ? '?' + params.toString() : '?');
}

function readURL() {
    const params = new URLSearchParams(window.location.search);
    activeFilters.search   = params.get('search')   || '';
    activeFilters.category = params.get('category') || '';
    activeFilters.price    = params.get('price')    || '';
    syncUI();
    applyFilters();
}

// ── Event Listeners ───────────────────────────────

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', function() {
        setFilter('search', this.value.trim());
    });
    document.getElementById('categoryFilter').addEventListener('change', function() {
        setFilter('category', this.value);
    });
    document.getElementById('priceFilter').addEventListener('change', function() {
        setFilter('price', this.value);
    });
    document.getElementById('resetFilter').addEventListener('click', resetFilters);
}

// Dipanggil dari onclick di category pills (index.html)
function filterByCategory(cat) {
    setFilter('category', cat);
}

// ── Render ────────────────────────────────────────

function showSkeletons(n = 8) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = Array(n).fill(`
        <div class="col-6 col-md-4 col-lg-3">
            <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-body">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function displayProducts(productList) {
    const productGrid  = document.getElementById('productGrid');
    const noResults    = document.getElementById('noResults');
    const productCount = document.getElementById('productCount');

    productGrid.innerHTML = '';

    if (productList.length === 0) {
        noResults.classList.remove('d-none');
        productCount.textContent = 'Tidak ada produk ditemukan';
        return;
    }

    noResults.classList.add('d-none');
    productCount.textContent = `Menampilkan ${productList.length} produk`;
    productGrid.innerHTML = productList.map(createProductCard).join('');
}

function createProductCard(product) {
    const stockBadge = product.stock > 10
        ? '<span class="badge bg-success">Stok Tersedia</span>'
        : product.stock > 0
            ? '<span class="badge bg-warning text-dark">Stok Terbatas</span>'
            : '<span class="badge bg-danger">Habis</span>';

    const soldOut = product.stock === 0;

    return `
        <div class="col-md-6 col-lg-4 col-xl-3">
            <div class="card product-card h-100 shadow-sm">
                <div class="product-image-wrapper" style="cursor:pointer;" onclick="openProductModal(${product.id})">
                    <img src="${escapeHTML(product.image)}" class="card-img-top product-image" alt="${escapeHTML(product.altText || product.name)}"
                         loading="lazy" decoding="async"
                         onerror="this.onerror=null;this.src='images/products/placeholder.svg'">
                    <div class="product-badge">${stockBadge}</div>
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <span class="badge bg-light text-dark border">${escapeHTML(getCategoryName(product.category))}</span>
                    </div>
                    <h5 class="card-title">${escapeHTML(product.name)}</h5>
                    <p class="card-text text-muted small flex-grow-1">${escapeHTML(truncateText(product.description, 80))}</p>
                    <div class="product-meta mb-3">
                        <small class="text-muted">
                            <i class="fas fa-map-marker-alt"></i> ${escapeHTML(product.origin)}
                        </small>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h4 class="text-primary mb-0">${escapeHTML(formatCurrency(product.price))}</h4>
                        <button class="btn btn-outline-primary btn-sm" onclick="openProductModal(${product.id})">
                            <i class="fas fa-eye"></i> Detail
                        </button>
                    </div>
                    <button class="btn btn-primary btn-sm w-100" onclick="addToCart(${product.id})" ${soldOut ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart me-1"></i>
                        ${soldOut ? 'Stok Habis' : 'Tambah ke Keranjang'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ── Filter Logic ──────────────────────────────────

function applyFilters() {
    const { search, category, price } = activeFilters;

    filteredProducts = catalogProducts.filter(product => {
        const matchesName     = !search   || product.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !category || product.category === category;

        let matchesPrice = true;
        if (price) {
            const [min, max] = price.split('-').map(Number);
            matchesPrice = product.price >= min && product.price <= max;
        }

        return matchesName && matchesCategory && matchesPrice;
    });

    displayProducts(filteredProducts);
}

function resetFilters() {
    activeFilters.category = '';
    activeFilters.price    = '';
    activeFilters.search   = '';
    history.replaceState(null, '', '?');
    syncUI();
    filteredProducts = [...catalogProducts];
    displayProducts(catalogProducts);
}
