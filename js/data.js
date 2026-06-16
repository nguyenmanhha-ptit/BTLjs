// ============================================
// DATA.JS - Dữ liệu sản phẩm TechZone
// ============================================
// File này chứa toàn bộ dữ liệu sản phẩm và danh mục
// Được import vào index.html trước app.js
// ============================================

// ============ DANH MỤC SẢN PHẨM ============
const categories = [
    { id: 'tat-ca', name: 'Tất cả', icon: '🏪' },
    { id: 'dien-thoai', name: 'Điện thoại', icon: '📱' },
    { id: 'laptop', name: 'Laptop', icon: '💻' },
    { id: 'tablet', name: 'Tablet', icon: '📟' },
    { id: 'tai-nghe', name: 'Tai nghe', icon: '🎧' },
    { id: 'phu-kien', name: 'Phụ kiện', icon: '🔌' }
];

// ============ DANH SÁCH SẢN PHẨM ============
// Mỗi sản phẩm có: id, name, price, oldPrice, image (emoji), category, description, rating, stock
const products = [
    // ========== ĐIỆN THOẠI (5 sản phẩm) ==========
    {
        id: 1,
        name: 'iPhone 15 Pro Max',
        price: 29990000,
        oldPrice: 34990000,
        image: '📱',
        category: 'dien-thoai',
        description: 'Chip A17 Pro, Camera 48MP, Khung Titanium, USB-C',
        rating: 4.8,
        stock: 15
    },
    {
        id: 2,
        name: 'Samsung Galaxy S24 Ultra',
        price: 27990000,
        oldPrice: 31990000,
        image: '📱',
        category: 'dien-thoai',
        description: 'Snapdragon 8 Gen 3, S-Pen, Camera 200MP, AI Galaxy',
        rating: 4.7,
        stock: 20
    },
    {
        id: 3,
        name: 'Xiaomi 14 Pro',
        price: 15990000,
        oldPrice: 18990000,
        image: '📱',
        category: 'dien-thoai',
        description: 'Snapdragon 8 Gen 3, Leica Camera, Sạc 120W',
        rating: 4.5,
        stock: 25
    },
    {
        id: 4,
        name: 'OPPO Find X7 Ultra',
        price: 22990000,
        oldPrice: 25990000,
        image: '📱',
        category: 'dien-thoai',
        description: 'Dimensity 9300, Hasselblad Camera, Pin 5400mAh',
        rating: 4.6,
        stock: 12
    },
    {
        id: 5,
        name: 'Google Pixel 8 Pro',
        price: 18990000,
        oldPrice: 22990000,
        image: '📱',
        category: 'dien-thoai',
        description: 'Tensor G3, Camera AI, 7 năm cập nhật, Android gốc',
        rating: 4.6,
        stock: 10
    },

    // ========== LAPTOP (5 sản phẩm) ==========
    {
        id: 6,
        name: 'MacBook Air M3',
        price: 27990000,
        oldPrice: 32990000,
        image: '💻',
        category: 'laptop',
        description: 'Chip M3, 8GB RAM, 256GB SSD, Màn Liquid Retina 13.6"',
        rating: 4.9,
        stock: 18
    },
    {
        id: 7,
        name: 'Dell XPS 15',
        price: 35990000,
        oldPrice: 41990000,
        image: '💻',
        category: 'laptop',
        description: 'Intel Core i7-13700H, RTX 4060, 16GB RAM, OLED 3.5K',
        rating: 4.7,
        stock: 8
    },
    {
        id: 8,
        name: 'ASUS ROG Strix G16',
        price: 32990000,
        oldPrice: 37990000,
        image: '💻',
        category: 'laptop',
        description: 'Intel Core i9, RTX 4070, 16GB RAM, 240Hz, RGB',
        rating: 4.8,
        stock: 14
    },
    {
        id: 9,
        name: 'Lenovo ThinkPad X1 Carbon',
        price: 29990000,
        oldPrice: 34990000,
        image: '💻',
        category: 'laptop',
        description: 'Intel Core i7, 16GB RAM, 512GB SSD, 14" 2.8K OLED',
        rating: 4.6,
        stock: 10
    },
    {
        id: 10,
        name: 'HP Spectre x360',
        price: 31990000,
        oldPrice: 36990000,
        image: '💻',
        category: 'laptop',
        description: 'Intel Core i7, 16GB RAM, 1TB SSD, OLED 13.5" 2-in-1',
        rating: 4.5,
        stock: 7
    },

    // ========== TABLET (3 sản phẩm) ==========
    {
        id: 11,
        name: 'iPad Pro M4',
        price: 28990000,
        oldPrice: 32990000,
        image: '📟',
        category: 'tablet',
        description: 'Chip M4, Màn Ultra Retina XDR, Apple Pencil Pro',
        rating: 4.9,
        stock: 20
    },
    {
        id: 12,
        name: 'Samsung Galaxy Tab S9 Ultra',
        price: 23990000,
        oldPrice: 27990000,
        image: '📟',
        category: 'tablet',
        description: 'Snapdragon 8 Gen 2, 14.6" AMOLED, S-Pen, DeX',
        rating: 4.7,
        stock: 11
    },
    {
        id: 13,
        name: 'Xiaomi Pad 6 Pro',
        price: 9990000,
        oldPrice: 12990000,
        image: '📟',
        category: 'tablet',
        description: 'Snapdragon 8+ Gen 1, 11" 144Hz, Sạc 67W',
        rating: 4.4,
        stock: 30
    },

    // ========== TAI NGHE (4 sản phẩm) ==========
    {
        id: 14,
        name: 'Apple AirPods Pro 2',
        price: 5990000,
        oldPrice: 6990000,
        image: '🎧',
        category: 'tai-nghe',
        description: 'Chip H2, ANC, Adaptive Audio, USB-C, IP54',
        rating: 4.8,
        stock: 35
    },
    {
        id: 15,
        name: 'Sony WH-1000XM5',
        price: 7490000,
        oldPrice: 8990000,
        image: '🎧',
        category: 'tai-nghe',
        description: 'ANC hàng đầu, LDAC, 30h pin, Multipoint',
        rating: 4.9,
        stock: 15
    },
    {
        id: 16,
        name: 'Samsung Galaxy Buds3 Pro',
        price: 4990000,
        oldPrice: 5990000,
        image: '🎧',
        category: 'tai-nghe',
        description: 'ANC thông minh, 360 Audio, IP57, Galaxy AI',
        rating: 4.5,
        stock: 22
    },
    {
        id: 17,
        name: 'JBL Tune 770NC',
        price: 2490000,
        oldPrice: 3290000,
        image: '🎧',
        category: 'tai-nghe',
        description: 'ANC, Pure Bass, 70h pin, Bluetooth 5.3',
        rating: 4.3,
        stock: 40
    },

    // ========== PHỤ KIỆN (4 sản phẩm) ==========
    {
        id: 18,
        name: 'Sạc nhanh Anker 65W',
        price: 790000,
        oldPrice: 990000,
        image: '🔌',
        category: 'phu-kien',
        description: 'GaN II, 3 cổng (2 USB-C + 1 USB-A), PD 3.0',
        rating: 4.7,
        stock: 50
    },
    {
        id: 19,
        name: 'Chuột Logitech MX Master 3S',
        price: 2190000,
        oldPrice: 2590000,
        image: '🖱️',
        category: 'phu-kien',
        description: 'Wireless, 8000 DPI, Sạc USB-C, Kết nối 3 thiết bị',
        rating: 4.8,
        stock: 25
    },
    {
        id: 20,
        name: 'Bàn phím cơ Keychron K2',
        price: 1890000,
        oldPrice: 2290000,
        image: '⌨️',
        category: 'phu-kien',
        description: 'Gateron Brown, Bluetooth 5.1, RGB, Mac/Win',
        rating: 4.6,
        stock: 18
    },
    {
        id: 21,
        name: 'Ốp lưng MagSafe iPhone 15',
        price: 490000,
        oldPrice: 690000,
        image: '🛡️',
        category: 'phu-kien',
        description: 'Silicone cao cấp, MagSafe, Chống sốc, Nhiều màu',
        rating: 4.4,
        stock: 60
    }
];
