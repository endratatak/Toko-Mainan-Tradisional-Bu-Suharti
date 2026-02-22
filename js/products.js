// Database produk mainan tradisional
// Gambar disesuaikan dengan file di folder images/products/

const products = [
    {
        id: 1,
        name: "Topeng Ayam",
        category: "tradisional",
        price: 85000,
        image: "images/products/TopengAyam.jpg",
        description: "Topeng tradisional bermotif ayam. Dibuat oleh pengrajin lokal dengan cat natural yang aman.",
        stock: 15,
        weight: 200,
        material: "Kayu Albasia",
        ageRange: "5+ tahun",
        origin: "Yogyakarta",
        features: [
            "Kayu albasia ringan",
            "Cat natural non-toxic",
            "Tali pengaman elastis",
            "Handmade pengrajin lokal"
        ]
    },
    {
        id: 2,
        name: "Topeng Macan",
        category: "tradisional",
        price: 90000,
        image: "images/products/TopengMacan.jpg",
        description: "Topeng tradisional bermotif macan dengan ukiran detail. Cocok sebagai mainan dan koleksi.",
        stock: 12,
        weight: 220,
        material: "Kayu Albasia",
        ageRange: "5+ tahun",
        origin: "Yogyakarta",
        features: [
            "Ukiran tangan detail",
            "Cat warna cerah",
            "Tali pengaman elastis",
            "Finishing halus"
        ]
    },
    {
        id: 3,
        name: "Topeng Macan Premium",
        category: "tradisional",
        price: 110000,
        image: "images/products/TopengMacan1.jpg",
        description: "Topeng macan versi premium dengan detail ukiran lebih halus dan cat berkualitas tinggi.",
        stock: 8,
        weight: 230,
        material: "Kayu Jati",
        ageRange: "8+ tahun",
        origin: "Yogyakarta",
        features: [
            "Kayu jati berkualitas",
            "Detail ukiran lebih halus",
            "Cat anti-luntur",
            "Cocok untuk koleksi"
        ]
    },
    {
        id: 4,
        name: "Topeng Muka",
        category: "tradisional",
        price: 75000,
        image: "images/products/TopengMuka.jpg",
        description: "Topeng wajah tradisional Jawa dengan ekspresi khas. Mewarisi budaya seni topeng nusantara.",
        stock: 20,
        weight: 190,
        material: "Kayu Albasia",
        ageRange: "5+ tahun",
        origin: "Solo",
        features: [
            "Ekspresi wajah khas Jawa",
            "Ringan dan nyaman dipakai",
            "Cat natural aman",
            "Tali elastis kuat"
        ]
    },
    {
        id: 5,
        name: "Topeng Muka Klasik",
        category: "tradisional",
        price: 80000,
        image: "images/products/TopengMuka2.jpg",
        description: "Topeng muka klasik dengan motif tradisional yang lebih detail. Sempurna untuk pentas seni.",
        stock: 14,
        weight: 200,
        material: "Kayu Albasia",
        ageRange: "6+ tahun",
        origin: "Solo",
        features: [
            "Desain klasik tradisional",
            "Ukiran motif khas",
            "Cocok untuk pentas seni",
            "Finishing halus"
        ]
    },
    {
        id: 6,
        name: "Topeng Muka Macan",
        category: "tradisional",
        price: 95000,
        image: "images/products/TopengMukaMacan.jpg",
        description: "Perpaduan topeng muka dan motif macan. Unik dan menarik sebagai mainan edukatif budaya.",
        stock: 10,
        weight: 210,
        material: "Kayu Albasia",
        ageRange: "6+ tahun",
        origin: "Yogyakarta",
        features: [
            "Desain unik perpaduan motif",
            "Cat warna terang",
            "Kayu ringan",
            "Aman untuk anak"
        ]
    },
    {
        id: 7,
        name: "Topeng Muka Setengah",
        category: "tradisional",
        price: 70000,
        image: "images/products/TopengMukaSetengah.jpg",
        description: "Topeng setengah muka tradisional. Nyaman dipakai dan cocok untuk kegiatan seni budaya.",
        stock: 18,
        weight: 150,
        material: "Kayu Albasia",
        ageRange: "5+ tahun",
        origin: "Solo",
        features: [
            "Desain setengah muka",
            "Lebih nyaman dipakai",
            "Cat natural",
            "Ringan dan kuat"
        ]
    },
    {
        id: 8,
        name: "Topeng Petruk",
        category: "tradisional",
        price: 125000,
        image: "images/products/TopengPetruk.jpg",
        description: "Topeng karakter Petruk dari tokoh wayang Punakawan. Mengenalkan budaya pewayangan pada anak.",
        stock: 9,
        weight: 250,
        material: "Kayu Jati",
        ageRange: "7+ tahun",
        origin: "Yogyakarta",
        features: [
            "Karakter Punakawan ikonik",
            "Kayu jati berkualitas",
            "Detail ukiran presisi",
            "Nilai edukatif budaya tinggi"
        ]
    },
    {
        id: 9,
        name: "Topeng Zebra",
        category: "edukatif",
        price: 65000,
        image: "images/products/TopengZebra.jpg",
        description: "Topeng bermotif zebra dengan warna hitam putih khas. Edukatif untuk mengenalkan dunia binatang.",
        stock: 25,
        weight: 180,
        material: "Kayu Albasia",
        ageRange: "4+ tahun",
        origin: "Yogyakarta",
        features: [
            "Motif zebra menarik",
            "Warna kontras cerah",
            "Aman untuk balita",
            "Bahan ringan"
        ]
    },
    {
        id: 10,
        name: "Topeng Zebra Premium",
        category: "edukatif",
        price: 80000,
        image: "images/products/TopengZebra1.jpg",
        description: "Topeng zebra versi premium dengan detail lebih halus dan cat berkualitas tinggi.",
        stock: 16,
        weight: 190,
        material: "Kayu Albasia",
        ageRange: "4+ tahun",
        origin: "Yogyakarta",
        features: [
            "Detail lebih halus",
            "Cat premium anti-luntur",
            "Finishing glossy",
            "Tali elastis kuat"
        ]
    },
    {
        id: 11,
        name: "Foto Toko Bu Suharti",
        category: "kayu",
        price: 0,
        image: "images/products/FotoDariLuar.jpg",
        description: "Kunjungi langsung toko kami di Alun-Alun Utara Yogyakarta untuk melihat koleksi lengkap.",
        stock: 0,
        weight: 0,
        material: "-",
        ageRange: "-",
        origin: "Yogyakarta",
        features: [
            "Koleksi lengkap tersedia di toko",
            "Lokasi strategis Alun-Alun Utara",
            "Buka setiap hari 10.00 - 23.00 WIB",
            "Bisa melihat dan mencoba langsung"
        ]
    }
];

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = products;
}