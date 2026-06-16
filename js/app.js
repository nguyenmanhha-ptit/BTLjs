// ============================================
// APP.JS - Logic chính của ứng dụng TechZone
// ============================================
// YÊU CẦU ĐÁP ỨNG:
// ✅ Tương tác DOM: hienThiSanPham, hienThiGioHang, hienThongBao, dongMoGioHang
// ✅ 5+ hàm tự định nghĩa: 20 hàm bên dưới
// ✅ Cấu trúc If/Else: kiemTraThanhToan, themVaoGio, locSanPham
// ✅ Vòng lặp: hienThiSanPham, tinhTongTien, timKiemSanPham
// ✅ NÂNG CAO: LocalStorage, Responsive UI, Dark Mode
// ============================================

// ============ BIẾN TOÀN CỤC ============
let cart = [];                    // Mảng giỏ hàng: [{id, quantity}]
let currentCategory = 'tat-ca';  // Danh mục đang chọn
let currentSearch = '';           // Từ khóa tìm kiếm hiện tại
let currentSort = 'default';     // Tiêu chí sắp xếp hiện tại

// ============ THAM CHIẾU DOM ============
// Lưu tham chiếu 1 lần để dùng nhiều lần → tăng hiệu suất
const productGrid = document.getElementById('product-grid');
const categoryFiltersEl = document.getElementById('category-filters');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const resultCount = document.getElementById('result-count');

const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartBadge = document.getElementById('cart-badge');
const checkoutBtn = document.getElementById('checkout-btn');

const checkoutModal = document.getElementById('checkout-modal');
const checkoutForm = document.getElementById('checkout-form');
const successModal = document.getElementById('success-modal');

const toastContainer = document.getElementById('toast-container');

// ============================================
// HÀM 1: dinhDangGia(price)
// ============================================
// Mô tả: Định dạng số tiền sang dạng tiền Việt Nam
// VD: 29990000 → "29.990.000₫"
// Yêu cầu: Hàm tự định nghĩa
function dinhDangGia(price) {
    return price.toLocaleString('vi-VN') + '₫';
}

// ============================================
// HÀM 2: layPhanTramGiam(oldPrice, price)
// ============================================
// Mô tả: Tính phần trăm giảm giá
// VD: oldPrice=34990000, price=29990000 → 14 (%)
// Yêu cầu: Hàm tự định nghĩa, If/Else
function layPhanTramGiam(oldPrice, price) {
    if (oldPrice && oldPrice > price) {
        return Math.round((1 - price / oldPrice) * 100);
    } else {
        return 0;
    }
}

// ============================================
// HÀM 3: hienThiSao(rating)
// ============================================
// Mô tả: Tạo chuỗi sao đánh giá từ điểm rating
// VD: rating=4.5 → "★★★★★" (4 sao đầy + 1 nửa sao xấp xỉ)
// Yêu cầu: Hàm tự định nghĩa, Vòng lặp
function hienThiSao(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.round(rating)) {
            stars += '★';
        } else {
            stars += '☆';
        }
    }
    return stars;
}

// ============================================
// HÀM 4: layTenDanhMuc(categoryId)
// ============================================
// Mô tả: Lấy tên hiển thị của danh mục từ id
// VD: "dien-thoai" → "Điện thoại"
// Yêu cầu: Hàm tự định nghĩa, Vòng lặp
function layTenDanhMuc(categoryId) {
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].id === categoryId) {
            return categories[i].name;
        }
    }
    return 'Khác';
}

// ============================================
// HÀM 5: hienThiBoLocDanhMuc()
// ============================================
// Mô tả: Tạo các nút lọc danh mục từ mảng categories
//         Gắn sự kiện click cho mỗi nút
// Yêu cầu: DOM (createElement, appendChild), Vòng lặp (for)
function hienThiBoLocDanhMuc() {
    categoryFiltersEl.innerHTML = '';

    for (let i = 0; i < categories.length; i++) {
        let cat = categories[i];

        // Tạo nút danh mục
        let btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.setAttribute('data-category', cat.id);

        // Thêm class active cho danh mục đang chọn
        if (cat.id === currentCategory) {
            btn.classList.add('active');
        }

        btn.innerHTML = cat.icon + ' ' + cat.name;

        // Gắn sự kiện click
        btn.addEventListener('click', function () {
            currentCategory = cat.id;
            locSanPham();
            hienThiBoLocDanhMuc(); // Re-render để cập nhật active
        });

        categoryFiltersEl.appendChild(btn);
    }
}

// ============================================
// HÀM 6: timKiemSanPham(keyword)
// ============================================
// Mô tả: Lọc sản phẩm theo từ khóa tìm kiếm (so sánh tên + mô tả)
// Yêu cầu: Vòng lặp (for), If/Else
function timKiemSanPham(keyword) {
    let results = [];
    let lowerKeyword = keyword.toLowerCase().trim();

    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let nameMatch = product.name.toLowerCase().includes(lowerKeyword);
        let descMatch = product.description.toLowerCase().includes(lowerKeyword);

        if (nameMatch || descMatch) {
            results.push(product);
        }
    }

    return results;
}

// ============================================
// HÀM 7: sapXepSanPham(productList, criteria)
// ============================================
// Mô tả: Sắp xếp mảng sản phẩm theo tiêu chí
// Tiêu chí: 'price-asc', 'price-desc', 'name-asc', 'rating-desc'
// Yêu cầu: If/Else, Hàm tự định nghĩa
function sapXepSanPham(productList, criteria) {
    // Tạo bản sao để không thay đổi mảng gốc
    let sorted = productList.slice();

    if (criteria === 'price-asc') {
        sorted.sort(function (a, b) {
            return a.price - b.price;
        });
    } else if (criteria === 'price-desc') {
        sorted.sort(function (a, b) {
            return b.price - a.price;
        });
    } else if (criteria === 'name-asc') {
        sorted.sort(function (a, b) {
            return a.name.localeCompare(b.name, 'vi');
        });
    } else if (criteria === 'rating-desc') {
        sorted.sort(function (a, b) {
            return b.rating - a.rating;
        });
    }
    // else: 'default' → giữ nguyên thứ tự

    return sorted;
}

// ============================================
// HÀM 8: locSanPham()
// ============================================
// Mô tả: Hàm chính để lọc + sắp xếp + render sản phẩm
//         Kết hợp: danh mục + tìm kiếm + sắp xếp
// Yêu cầu: If/Else, Vòng lặp (qua timKiemSanPham + sapXepSanPham)
function locSanPham() {
    // Bước 1: Lọc theo tìm kiếm
    let filtered = [];
    if (currentSearch.length > 0) {
        filtered = timKiemSanPham(currentSearch);
    } else {
        // Copy toàn bộ sản phẩm
        for (let i = 0; i < products.length; i++) {
            filtered.push(products[i]);
        }
    }

    // Bước 2: Lọc theo danh mục
    if (currentCategory !== 'tat-ca') {
        let categoryFiltered = [];
        for (let i = 0; i < filtered.length; i++) {
            if (filtered[i].category === currentCategory) {
                categoryFiltered.push(filtered[i]);
            }
        }
        filtered = categoryFiltered;
    }

    // Bước 3: Sắp xếp
    filtered = sapXepSanPham(filtered, currentSort);

    // Bước 4: Cập nhật số lượng kết quả
    resultCount.innerHTML = 'Hiển thị <span>' + filtered.length + '</span> sản phẩm';

    // Bước 5: Render
    hienThiSanPham(filtered);
}

// ============================================
// HÀM 9: hienThiSanPham(productList)
// ============================================
// Mô tả: Hiển thị danh sách sản phẩm lên lưới (product-grid)
//         Mỗi SP → 1 card HTML chứa: ảnh, tên, giá, nút thêm giỏ
// Yêu cầu: DOM (innerHTML, createElement), Vòng lặp (for)
function hienThiSanPham(productList) {
    productGrid.innerHTML = '';

    // Nếu không có sản phẩm → hiển thị thông báo trống
    if (productList.length === 0) {
        productGrid.innerHTML = '<div class="empty-state">' +
            '<div class="empty-state-icon">🔍</div>' +
            '<p class="empty-state-text">Không tìm thấy sản phẩm phù hợp</p>' +
            '</div>';
        return;
    }

    for (let i = 0; i < productList.length; i++) {
        let product = productList[i];
        let discount = layPhanTramGiam(product.oldPrice, product.price);

        // Tạo card element
        let card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = (i * 0.05) + 's';

        // Badge giảm giá (chỉ hiện nếu có)
        let badgeHTML = '';
        if (discount > 0) {
            badgeHTML = '<span class="product-badge">-' + discount + '%</span>';
        }

        // Old price (chỉ hiện nếu có)
        let oldPriceHTML = '';
        if (product.oldPrice && product.oldPrice > product.price) {
            oldPriceHTML = '<span class="product-old-price">' + dinhDangGia(product.oldPrice) + '</span>';
        }

        card.innerHTML =
            '<div class="product-image-container">' +
                '<span class="product-emoji">' + product.image + '</span>' +
                badgeHTML +
            '</div>' +
            '<div class="product-info">' +
                '<div class="product-category">' + layTenDanhMuc(product.category) + '</div>' +
                '<h3 class="product-name">' + product.name + '</h3>' +
                '<p class="product-desc">' + product.description + '</p>' +
                '<div class="product-rating">' +
                    '<span class="stars">' + hienThiSao(product.rating) + '</span>' +
                    '<span class="rating-number">' + product.rating + '</span>' +
                '</div>' +
                '<div class="product-price-row">' +
                    '<div>' +
                        '<span class="product-price">' + dinhDangGia(product.price) + '</span> ' +
                        oldPriceHTML +
                    '</div>' +
                '</div>' +
                '<button class="add-to-cart-btn" onclick="themVaoGio(' + product.id + ')">' +
                    '🛒 Thêm vào giỏ' +
                '</button>' +
            '</div>';

        productGrid.appendChild(card);
    }
}

// ============================================
// HÀM 10: themVaoGio(productId)
// ============================================
// Mô tả: Thêm sản phẩm vào giỏ hàng
//         Nếu SP đã có → tăng số lượng
//         Nếu SP chưa có → thêm mới với quantity = 1
// Yêu cầu: If/Else, DOM (cập nhật badge, cart)
function themVaoGio(productId) {
    // Kiểm tra SP đã có trong giỏ chưa
    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity = cart[i].quantity + 1;
            found = true;
            break;
        }
    }

    // Nếu chưa có → thêm mới
    if (!found) {
        cart.push({ id: productId, quantity: 1 });
    }

    // Cập nhật giao diện
    luuGioHang();
    hienThiGioHang();
    capNhatBadgeGio();

    // Hiện thông báo
    let product = timSanPhamTheoId(productId);
    if (product) {
        hienThongBao('Đã thêm "' + product.name + '" vào giỏ hàng!', 'success');
    }
}

// ============================================
// HÀM 11: timSanPhamTheoId(id)
// ============================================
// Mô tả: Tìm sản phẩm trong mảng products theo id
// Yêu cầu: Vòng lặp (for), If/Else
function timSanPhamTheoId(id) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            return products[i];
        }
    }
    return null;
}

// ============================================
// HÀM 12: xoaKhoiGio(productId)
// ============================================
// Mô tả: Xóa sản phẩm khỏi giỏ hàng theo id
// Yêu cầu: DOM, Vòng lặp
function xoaKhoiGio(productId) {
    let newCart = [];
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id !== productId) {
            newCart.push(cart[i]);
        }
    }
    cart = newCart;

    luuGioHang();
    hienThiGioHang();
    capNhatBadgeGio();
    hienThongBao('Đã xóa sản phẩm khỏi giỏ hàng', 'warning');
}

// ============================================
// HÀM 13: capNhatSoLuong(productId, delta)
// ============================================
// Mô tả: Tăng/giảm số lượng SP trong giỏ
//         delta = +1 (tăng) hoặc -1 (giảm)
//         Nếu quantity = 0 → xóa khỏi giỏ
// Yêu cầu: If/Else, DOM
function capNhatSoLuong(productId, delta) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity = cart[i].quantity + delta;

            // Nếu số lượng <= 0 → xóa
            if (cart[i].quantity <= 0) {
                xoaKhoiGio(productId);
                return;
            }
            break;
        }
    }

    luuGioHang();
    hienThiGioHang();
    capNhatBadgeGio();
}

// ============================================
// HÀM 14: tinhTongTien()
// ============================================
// Mô tả: Tính tổng tiền của tất cả SP trong giỏ hàng
// Yêu cầu: Vòng lặp (for)
function tinhTongTien() {
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        let product = timSanPhamTheoId(cart[i].id);
        if (product) {
            total = total + (product.price * cart[i].quantity);
        }
    }

    return total;
}

// ============================================
// HÀM 15: hienThiGioHang()
// ============================================
// Mô tả: Hiển thị danh sách SP trong giỏ hàng lên sidebar
//         Mỗi item: ảnh, tên, giá, nút +/-, nút xóa
// Yêu cầu: DOM (innerHTML), Vòng lặp (for), If/Else
function hienThiGioHang() {
    cartItemsEl.innerHTML = '';

    // Giỏ hàng trống
    if (cart.length === 0) {
        cartItemsEl.innerHTML =
            '<div class="cart-empty">' +
                '<div class="cart-empty-icon">🛒</div>' +
                '<p class="cart-empty-text">Giỏ hàng trống</p>' +
            '</div>';
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;

        for (let i = 0; i < cart.length; i++) {
            let cartItem = cart[i];
            let product = timSanPhamTheoId(cartItem.id);

            if (product) {
                let itemEl = document.createElement('div');
                itemEl.className = 'cart-item';

                itemEl.innerHTML =
                    '<div class="cart-item-image">' + product.image + '</div>' +
                    '<div class="cart-item-details">' +
                        '<div class="cart-item-name">' + product.name + '</div>' +
                        '<div class="cart-item-price">' + dinhDangGia(product.price) + '</div>' +
                        '<div class="cart-item-controls">' +
                            '<button class="qty-btn" onclick="capNhatSoLuong(' + product.id + ', -1)">−</button>' +
                            '<span class="cart-item-qty">' + cartItem.quantity + '</span>' +
                            '<button class="qty-btn" onclick="capNhatSoLuong(' + product.id + ', +1)">+</button>' +
                        '</div>' +
                    '</div>' +
                    '<button class="cart-item-remove" onclick="xoaKhoiGio(' + product.id + ')" title="Xóa">🗑️</button>';

                cartItemsEl.appendChild(itemEl);
            }
        }
    }

    // Cập nhật tổng tiền
    let total = tinhTongTien();
    cartTotalEl.textContent = dinhDangGia(total);
}

// ============================================
// HÀM 16: capNhatBadgeGio()
// ============================================
// Mô tả: Cập nhật số lượng hiển thị trên icon giỏ hàng (badge)
// Yêu cầu: DOM, If/Else
function capNhatBadgeGio() {
    let totalItems = 0;
    for (let i = 0; i < cart.length; i++) {
        totalItems = totalItems + cart[i].quantity;
    }

    cartBadge.textContent = totalItems;

    if (totalItems > 0) {
        cartBadge.classList.remove('hidden');
    } else {
        cartBadge.classList.add('hidden');
    }
}

// ============================================
// HÀM 17: dongMoGioHang()
// ============================================
// Mô tả: Đóng/mở sidebar giỏ hàng + overlay nền mờ
// Yêu cầu: DOM (classList.toggle)
function dongMoGioHang() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');

    // Khóa/mở cuộn trang khi giỏ hàng mở
    if (cartSidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// ============================================
// HÀM 18: hienThongBao(message, type)
// ============================================
// Mô tả: Hiển thị thông báo dạng toast (popup nhỏ góc phải)
//         type: 'success', 'error', 'warning'
//         Tự biến mất sau 3 giây
// Yêu cầu: DOM (createElement, appendChild), If/Else
function hienThongBao(message, type) {
    let toast = document.createElement('div');
    toast.className = 'toast ' + type;

    // Chọn icon theo loại thông báo
    let icon = '✅';
    if (type === 'error') {
        icon = '❌';
    } else if (type === 'warning') {
        icon = '⚠️';
    }

    toast.innerHTML =
        '<span class="toast-icon">' + icon + '</span>' +
        '<span class="toast-message">' + message + '</span>';

    toastContainer.appendChild(toast);

    // Tự xóa sau 3 giây
    setTimeout(function () {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// ============================================
// HÀM 19: kiemTraThanhToan(formData)
// ============================================
// Mô tả: Kiểm tra dữ liệu form thanh toán có hợp lệ không
//         - Họ tên: không được trống, >= 2 ký tự
//         - SĐT: phải là 10 số, bắt đầu bằng 0
//         - Email: nếu có → phải đúng format
//         - Địa chỉ: không được trống, >= 10 ký tự
//         - Phương thức: phải chọn
// Yêu cầu: If/Else (nhiều), Hàm tự định nghĩa
function kiemTraThanhToan(formData) {
    let isValid = true;

    // Reset tất cả lỗi
    let errorElements = document.querySelectorAll('.form-error');
    for (let i = 0; i < errorElements.length; i++) {
        errorElements[i].classList.remove('visible');
    }
    let inputElements = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    for (let i = 0; i < inputElements.length; i++) {
        inputElements[i].classList.remove('error');
    }

    // Validate họ tên
    if (!formData.name || formData.name.trim().length < 2) {
        document.getElementById('customer-name').classList.add('error');
        document.getElementById('name-error').classList.add('visible');
        isValid = false;
    }

    // Validate số điện thoại (10 số, bắt đầu bằng 0)
    let phoneRegex = /^0\d{9}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone.trim())) {
        document.getElementById('customer-phone').classList.add('error');
        document.getElementById('phone-error').classList.add('visible');
        isValid = false;
    }

    // Validate email (nếu có nhập)
    if (formData.email && formData.email.trim().length > 0) {
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            document.getElementById('customer-email').classList.add('error');
            document.getElementById('email-error').classList.add('visible');
            isValid = false;
        }
    }

    // Validate địa chỉ
    if (!formData.address || formData.address.trim().length < 10) {
        document.getElementById('customer-address').classList.add('error');
        document.getElementById('address-error').classList.add('visible');
        isValid = false;
    }

    // Validate phương thức thanh toán
    if (!formData.payment || formData.payment === '') {
        document.getElementById('payment-method').classList.add('error');
        document.getElementById('payment-error').classList.add('visible');
        isValid = false;
    }

    return isValid;
}

// ============================================
// HÀM 20: xuLyDatHang()
// ============================================
// Mô tả: Xử lý đặt hàng sau khi validate thành công
//         - Lưu đơn hàng vào localStorage
//         - Xóa giỏ hàng
//         - Hiện modal thành công
// Yêu cầu: If/Else, DOM, localStorage
function xuLyDatHang() {
    let formData = {
        name: document.getElementById('customer-name').value,
        phone: document.getElementById('customer-phone').value,
        email: document.getElementById('customer-email').value,
        address: document.getElementById('customer-address').value,
        payment: document.getElementById('payment-method').value
    };

    // Validate
    if (!kiemTraThanhToan(formData)) {
        hienThongBao('Vui lòng điền đầy đủ thông tin hợp lệ!', 'error');
        return;
    }

    // Tạo đơn hàng
    let order = {
        id: Date.now(),
        customer: formData,
        items: [],
        total: tinhTongTien(),
        date: new Date().toLocaleString('vi-VN')
    };

    // Copy cart items vào đơn hàng
    for (let i = 0; i < cart.length; i++) {
        let product = timSanPhamTheoId(cart[i].id);
        if (product) {
            order.items.push({
                name: product.name,
                price: product.price,
                quantity: cart[i].quantity
            });
        }
    }

    // Lưu đơn hàng vào localStorage
    luuDonHang(order);

    // Xóa giỏ hàng
    cart = [];
    luuGioHang();
    hienThiGioHang();
    capNhatBadgeGio();

    // Đóng checkout modal, mở success modal
    checkoutModal.classList.remove('active');
    successModal.classList.add('active');

    // Reset form
    checkoutForm.reset();

    hienThongBao('Đặt hàng thành công! 🎉', 'success');
}

// ============================================
// HÀM PHỤ TRỢ: luuGioHang() / taiGioHang()
// ============================================
// Mô tả: Lưu/tải giỏ hàng từ localStorage
// Yêu cầu: localStorage (nâng cao)

function luuGioHang() {
    localStorage.setItem('techzone-cart', JSON.stringify(cart));
}

function taiGioHang() {
    let savedCart = localStorage.getItem('techzone-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = [];
    }
}

// ============================================
// HÀM PHỤ TRỢ: luuDonHang() / taiDonHang()
// ============================================
// Mô tả: Lưu/tải lịch sử đơn hàng từ localStorage
// Yêu cầu: localStorage (nâng cao)

function luuDonHang(order) {
    let orders = taiDonHang();
    orders.push(order);
    localStorage.setItem('techzone-orders', JSON.stringify(orders));
}

function taiDonHang() {
    let savedOrders = localStorage.getItem('techzone-orders');
    if (savedOrders) {
        return JSON.parse(savedOrders);
    } else {
        return [];
    }
}

// ============================================
// HÀM: chuyenDoiGiaoDien()
// ============================================
// Mô tả: Chuyển đổi giao diện giữa dark mode và light mode
//         Lưu preference vào localStorage
// Yêu cầu: DOM, localStorage, If/Else
function chuyenDoiGiaoDien() {
    let body = document.body;
    let themeBtn = document.getElementById('theme-toggle-btn');

    if (body.getAttribute('data-theme') === 'light') {
        body.removeAttribute('data-theme');
        themeBtn.textContent = '🌙';
        localStorage.setItem('techzone-theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        themeBtn.textContent = '☀️';
        localStorage.setItem('techzone-theme', 'light');
    }
}

function taiGiaoDien() {
    let savedTheme = localStorage.getItem('techzone-theme');
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        document.getElementById('theme-toggle-btn').textContent = '☀️';
    }
}

// ============================================
// HÀM: dangKySuKien()
// ============================================
// Mô tả: Đăng ký tất cả sự kiện cho các phần tử trên trang
//         - Click: nút giỏ hàng, đóng sidebar, thanh toán, modal
//         - Input: tìm kiếm
//         - Change: sắp xếp
//         - Submit: form checkout
//         - Scroll: header effect
// Yêu cầu: DOM (addEventListener), If/Else
function dangKySuKien() {

    // --- Giỏ hàng: Mở/Đóng ---
    document.getElementById('cart-btn').addEventListener('click', function () {
        dongMoGioHang();
    });

    document.getElementById('cart-close-btn').addEventListener('click', function () {
        dongMoGioHang();
    });

    cartOverlay.addEventListener('click', function () {
        dongMoGioHang();
    });

    // --- Thanh toán: Mở modal ---
    checkoutBtn.addEventListener('click', function () {
        dongMoGioHang(); // Đóng sidebar
        checkoutModal.classList.add('active');
    });

    // --- Checkout Modal: Đóng ---
    document.getElementById('checkout-close-btn').addEventListener('click', function () {
        checkoutModal.classList.remove('active');
    });

    checkoutModal.addEventListener('click', function (e) {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('active');
        }
    });

    // --- Checkout Form: Submit ---
    checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault();
        xuLyDatHang();
    });

    // --- Success Modal: Đóng ---
    document.getElementById('success-close-btn').addEventListener('click', function () {
        successModal.classList.remove('active');
    });

    successModal.addEventListener('click', function (e) {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });

    // --- Tìm kiếm: Input ---
    searchInput.addEventListener('input', function () {
        currentSearch = searchInput.value;
        locSanPham();
    });

    // --- Sắp xếp: Change ---
    sortSelect.addEventListener('change', function () {
        currentSort = sortSelect.value;
        locSanPham();
    });

    // --- Dark Mode Toggle ---
    document.getElementById('theme-toggle-btn').addEventListener('click', function () {
        chuyenDoiGiaoDien();
    });

    // --- Header: Scroll Effect ---
    window.addEventListener('scroll', function () {
        let header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    document.getElementById('mobile-menu-btn').addEventListener('click', function () {
        // Trên mobile, hiện/ẩn search bar
        let searchContainer = document.querySelector('.search-container');
        if (searchContainer.style.display === 'block') {
            searchContainer.style.display = '';
        } else {
            searchContainer.style.display = 'block';
            searchContainer.style.position = 'absolute';
            searchContainer.style.top = '100%';
            searchContainer.style.left = '0';
            searchContainer.style.right = '0';
            searchContainer.style.padding = '12px 24px';
            searchContainer.style.background = 'var(--bg-secondary)';
            searchContainer.style.borderBottom = '1px solid var(--border)';
            searchContainer.style.maxWidth = '100%';
        }
    });

    // --- Smooth Scroll: Hero CTA button ---
    let heroBtn = document.querySelector('.hero-btn');
    if (heroBtn) {
        heroBtn.addEventListener('click', function (e) {
            e.preventDefault();
            let target = document.getElementById('products');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ============================================
// KHỞI TẠO ỨNG DỤNG
// ============================================
// Hàm khoiTao() chạy khi trang tải xong (DOMContentLoaded)
// Thứ tự:
//   1. Tải theme (dark/light) từ localStorage
//   2. Tải giỏ hàng từ localStorage
//   3. Render danh mục lọc
//   4. Render sản phẩm (lọc + sắp xếp)
//   5. Render giỏ hàng
//   6. Cập nhật badge
//   7. Đăng ký sự kiện
function khoiTao() {
    taiGiaoDien();
    taiGioHang();
    hienThiBoLocDanhMuc();
    locSanPham();
    hienThiGioHang();
    capNhatBadgeGio();
    dangKySuKien();
}

// Chạy khi DOM tải xong
document.addEventListener('DOMContentLoaded', khoiTao);
