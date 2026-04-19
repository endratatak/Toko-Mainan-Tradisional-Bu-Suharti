// ================================================
// sheets-loader.js — Muat produk dari Google Sheets CSV
// ================================================
//
// CARA SETUP:
// 1. Buat Google Sheet dengan kolom (baris pertama = header):
//    id | name | price | stock | category | image | description | material | weight | ageRange | origin | features
//
// 2. Kolom "features": pisahkan tiap fitur dengan tanda pipa (|)
//    Contoh: Aman untuk anak|Bahan kayu asli|Buatan tangan
//
// 3. Kolom "image": isi path relatif, contoh: images/products/Wayang.jpg
//
// 4. Publish sheet ke web:
//    File → Bagikan → Publikasikan ke web → Pilih "Sheet1" → Format "Nilai yang dipisahkan koma (.csv)"
//    → Klik Publikasikan → Salin URL yang muncul
//
// 5. Tempel URL di bawah ini (ganti tanda kutip kosong):

const SHEETS_CSV_URL = '';

// ================================================

window.productsReady = (async function () {
    if (!SHEETS_CSV_URL) {
        // Tidak dikonfigurasi — pakai data statis dari products.js
        return window.products;
    }

    try {
        showLoadingState(true);
        const res = await fetch(SHEETS_CSV_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const csv = await res.text();
        const fresh = parseSheetCSV(csv);
        if (fresh.length > 0) {
            window.products = fresh;
        }
    } catch (err) {
        console.warn('Google Sheets tidak dapat dimuat, menggunakan data lokal:', err.message);
    } finally {
        showLoadingState(false);
    }

    return window.products;
})();

function parseSheetCSV(csv) {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return [];

    return lines.slice(1).map(line => {
        const cols = parseCSVLine(line);
        const id = parseInt(cols[0]);
        if (isNaN(id) || id <= 0) return null;

        return {
            id,
            name:        (cols[1]  || '').trim(),
            price:       parseInt(cols[2])  || 0,
            stock:       parseInt(cols[3])  || 0,
            category:    (cols[4]  || '').trim(),
            image:       (cols[5]  || '').trim(),
            description: (cols[6]  || '').trim(),
            material:    (cols[7]  || '').trim(),
            weight:      parseInt(cols[8])  || 0,
            ageRange:    (cols[9]  || '').trim(),
            origin:      (cols[10] || '').trim(),
            features:    cols[11]
                ? cols[11].split('|').map(f => f.trim()).filter(Boolean)
                : []
        };
    }).filter(Boolean);
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += ch;
        }
    }
    result.push(current.trim());
    return result;
}

function showLoadingState(visible) {
    const grid = document.getElementById('productGrid');
    const count = document.getElementById('productCount');
    if (!grid) return;

    if (visible) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary mb-3" role="status" aria-label="Memuat produk"></div>
                <p class="text-muted">Memuat data produk terbaru...</p>
            </div>`;
        if (count) count.textContent = 'Memuat produk...';
    }
}
