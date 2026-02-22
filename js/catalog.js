// Catalog functionality
// getCategoryName(), truncateText(), formatCurrency(),
// openProductModal(), addToCart() — semua di main.js

let filteredProducts = [...products];

document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    setupEventListeners();
});

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
    productList.forEach(product => {
        productGrid.innerHTML += createProductCard(product);
    });
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
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}"
                         onerror="this.src='images/products/placeholder.jpg'">
                    <div class="product-badge">${stockBadge}</div>
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <span class="badge bg-light text-dark border">${getCategoryName(product.category)}</span>
                    </div>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted small flex-grow-1">${truncateText(product.description, 80)}</p>
                    <div class="product-meta mb-3">
                        <small class="text-muted">
                            <i class="fas fa-map-marker-alt"></i> ${product.origin}
                        </small>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h4 class="text-primary mb-0">${formatCurrency(product.price)}</h4>
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

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('priceFilter').addEventListener('change', applyFilters);
    document.getElementById('resetFilter').addEventListener('click', resetFilters);
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const category   = document.getElementById('categoryFilter').value;
    const priceRange = document.getElementById('priceFilter').value;

    filteredProducts = products.filter(product => {
        // Filter hanya berdasarkan nama produk
        const matchesName = !searchTerm || product.name.toLowerCase().includes(searchTerm);

        const matchesCategory = !category || product.category === category;

        let matchesPrice = true;
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            matchesPrice = product.price >= min && product.price <= max;
        }

        return matchesName && matchesCategory && matchesPrice;
    });

    displayProducts(filteredProducts);
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('priceFilter').value = '';
    filteredProducts = [...products];
    displayProducts(products);
}