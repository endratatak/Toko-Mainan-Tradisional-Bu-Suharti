// Product Detail Page Logic
// Catatan: getCategoryName(), truncateText(), viewProductDetail(),
// formatCurrency(), formatWeight(), orderViaWhatsApp(),
// shareProduct() semuanya didefinisikan di main.js

document.addEventListener('DOMContentLoaded', function() {
    loadProductDetail();
});

// Ambil ID produk dari URL parameter (?id=5)
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function loadProductDetail() {
    const productId = getProductIdFromURL();

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    const product = products.find(p => p.id === parseInt(productId));

    if (!product) {
        document.getElementById('productDetailContent').innerHTML = `
            <div class="alert alert-warning text-center py-5">
                <i class="fas fa-box-open fa-3x mb-3 text-muted"></i>
                <h4>Produk tidak ditemukan</h4>
                <p class="text-muted">Produk yang Anda cari tidak tersedia atau telah dihapus.</p>
                <a href="index.html" class="btn btn-primary mt-2">
                    <i class="fas fa-arrow-left me-2"></i> Kembali ke Katalog
                </a>
            </div>
        `;
        return;
    }

    // Update breadcrumb & title
    document.getElementById('breadcrumbProduct').textContent = product.name;
    document.title = `${product.name} - Toko Mainan Tradisional Bu Suharti`;

    // Update meta tags for SEO
    updateMetaTags(product);

    displayProductDetail(product);
    loadRelatedProducts(product);
}

function displayProductDetail(product) {
    const stockStatus = product.stock > 10
        ? '<span class="badge bg-success fs-6"><i class="fas fa-check-circle me-1"></i> Stok Tersedia</span>'
        : product.stock > 0
            ? '<span class="badge bg-warning fs-6"><i class="fas fa-exclamation-circle me-1"></i> Stok Terbatas</span>'
            : '<span class="badge bg-danger fs-6"><i class="fas fa-times-circle me-1"></i> Habis</span>';

    const detailHTML = `
        <div class="row">

            <!-- Gambar Produk -->
            <div class="col-lg-5 mb-4">
                <div class="sticky-top" style="top: 100px;">
                    <img src="${escapeHTML(product.image)}"
                        class="product-detail-image"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='images/products/placeholder.jpg'">
                    <div class="mt-3 d-flex gap-2">
                        <button class="btn btn-outline-secondary flex-fill"
                                onclick="shareProduct(${product.id})">
                            <i class="fas fa-share-alt me-1"></i> Bagikan
                        </button>
                        <a href="index.html" class="btn btn-outline-primary flex-fill">
                            <i class="fas fa-arrow-left me-1"></i> Kembali
                        </a>
                    </div>
                </div>
            </div>

            <!-- Info Produk -->
            <div class="col-lg-7">
                <div class="mb-3 d-flex flex-wrap gap-2">
                    <span class="badge bg-primary fs-6">${escapeHTML(getCategoryName(product.category))}</span>
                    ${stockStatus}
                </div>

                <h1 class="fw-bold mb-3">${escapeHTML(product.name)}</h1>

                <div class="mb-4">
                    <h2 class="text-primary fw-bold">${escapeHTML(formatCurrency(product.price))}</h2>
                </div>

                <!-- Deskripsi -->
                <div class="card bg-light mb-4">
                    <div class="card-body">
                        <h5 class="card-title fw-bold mb-3">Deskripsi Produk</h5>
                        <p class="card-text">${escapeHTML(product.description)}</p>
                    </div>
                </div>

                <!-- Spesifikasi -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title fw-bold mb-3">Spesifikasi</h5>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-box text-primary me-2"></i>
                                    <strong class="me-2">Material:</strong>
                                    <span>${escapeHTML(product.material)}</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-weight text-primary me-2"></i>
                                    <strong class="me-2">Berat:</strong>
                                    <span>${escapeHTML(formatWeight(product.weight))}</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-child text-primary me-2"></i>
                                    <strong class="me-2">Usia:</strong>
                                    <span>${escapeHTML(product.ageRange)}</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-map-marker-alt text-primary me-2"></i>
                                    <strong class="me-2">Asal:</strong>
                                    <span>${escapeHTML(product.origin)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Fitur -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title fw-bold mb-3">Fitur & Keunggulan</h5>
                        <ul class="feature-list">
                            ${product.features.map(f => `<li>${escapeHTML(f)}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <!-- Tombol Aksi -->
                <div class="row g-3">
                    <div class="col-12">
                        <button class="btn btn-success btn-lg w-100"
                                onclick="orderViaWhatsApp(${product.id})"
                                ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fab fa-whatsapp me-2"></i> Pesan via WhatsApp
                        </button>
                    </div>
                </div>

                <div class="alert alert-info mt-4">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Informasi:</strong> Harga dan ketersediaan produk dapat berubah sewaktu-waktu.
                    Silakan hubungi kami untuk konfirmasi sebelum melakukan pemesanan.
                </div>
            </div>
        </div>
    `;

    document.getElementById('productDetailContent').innerHTML = detailHTML;
}

function loadRelatedProducts(currentProduct) {
    const related = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);

    if (related.length === 0) {
        document.getElementById('relatedProducts').innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">Tidak ada produk terkait</p>
            </div>
        `;
        return;
    }

    const relatedHTML = related.map(product => {
        const stockBadge = product.stock > 10
            ? '<span class="badge bg-success">Stok Tersedia</span>'
            : product.stock > 0
                ? '<span class="badge bg-warning">Stok Terbatas</span>'
                : '<span class="badge bg-danger">Habis</span>';

        return `
            <div class="col-md-6 col-lg-3">
                <div class="card product-card h-100 shadow-sm">
                    <div class="product-image-wrapper">
                        <img src="${escapeHTML(product.image)}" class="card-img-top product-image" alt="${escapeHTML(product.name)}"
                            loading="lazy"
                            onerror="this.onerror=null;this.src='images/products/placeholder.jpg'">
                        <div class="product-badge">${stockBadge}</div>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title fw-bold">${escapeHTML(product.name)}</h6>
                        <p class="text-muted small flex-grow-1">${escapeHTML(truncateText(product.description, 60))}</p>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <h5 class="text-primary mb-0">${escapeHTML(formatCurrency(product.price))}</h5>
                            <a href="product-detail.html?id=${product.id}" class="btn btn-primary btn-sm">
                                Detail
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('relatedProducts').innerHTML = relatedHTML;
}

function updateMetaTags(product) {
    const baseUrl = 'https://endratatak.github.io/Toko-Mainan-Tradisional-Bu-Suharti/';
    const productUrl = `${baseUrl}product-detail.html?id=${product.id}`;

    // Update title
    document.title = `${product.name} - Toko Mainan Tradisional Bu Suharti`;

    // Update meta description
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
        descriptionMeta.setAttribute('content', truncateText(product.description, 160));
    }

    // Update Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', product.name);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', truncateText(product.description, 200));

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', product.image.startsWith('http') ? product.image : baseUrl + product.image);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', productUrl);

    // Update Twitter Card
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', product.name);

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', truncateText(product.description, 200));
}
