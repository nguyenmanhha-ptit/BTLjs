// ============================================
// APP.JS - Logic chính của ứng dụng TechZone
// ============================================

// ============ BIẾN TOÀN CỤC ============
let cart = [];
let currentCategory = 'tat-ca';
let currentSearch = '';
let currentSort = 'default';
let userRatings = {};

// ============ THAM CHIẾU DOM ============
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
const ordersModal = document.getElementById('orders-modal');
const ordersListEl = document.getElementById('orders-list');

const toastContainer = document.getElementById('toast-container');

// HÀM 1: dinhDangGia(price)
function dinhDangGia(price) {
    return price.toLocaleString('vi-VN') + '₫';
}

// HÀM 2: layPhanTramGiam(oldPrice, price)
function layPhanTramGiam(oldPrice, price) {
    if (oldPrice && oldPrice > price) {
        return Math.round((1 - price / oldPrice) * 100);
    } else {
        return 0;
    }
}

// HÀM 3: hienThiSao(rating)
function hienThiSao(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.round(rating)) {
            starsHTML += '<span class="star-icon star-filled">★</span>';
        } else {
            starsHTML += '<span class="star-icon">★</span>';
        }
    }
    return starsHTML;
}

// HÀM: hienThiSaoTuongTac(rating, orderId, itemIndex)
function hienThiSaoTuongTac(rating, orderId, itemIndex) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        let starClass = 'star-icon star-interactive';
        if (i <= Math.round(rating)) {
            starClass += ' star-filled';
        }
        starsHTML += '<span class="' + starClass + '" data-star="' + i + '" ' +
            'data-order="' + orderId + '" data-item="' + itemIndex + '" ' +
            'onclick="danhGiaSanPhamDonHang(' + orderId + ', ' + itemIndex + ', ' + i + ')" ' +
            'title="Đánh giá ' + i + ' sao">★</span>';
    }
    return starsHTML;
}

// HÀM: danhGiaSanPhamDonHang(orderId, itemIndex, star)
function danhGiaSanPhamDonHang(orderId, itemIndex, star) {
    let orders = taiDonHang();
    let order = null;

    for (let i = 0; i < orders.length; i++) {
        if (orders[i].id === orderId) {
            order = orders[i];
            break;
        }
    }

    if (!order || order.status !== 'received') {
        hienThongBao('Bạn chỉ có thể đánh giá sau khi nhận hàng!', 'error');
        return;
    }

    if (order.items[itemIndex]) {
        order.items[itemIndex].rating = star;

        if (order.items[itemIndex].productId) {
            userRatings[order.items[itemIndex].productId] = star;
            luuDanhGia();
        }
    }

    localStorage.setItem('techzone-orders', JSON.stringify(orders));

    let allStars = document.querySelectorAll(
        '.star-interactive[data-order="' + orderId + '"][data-item="' + itemIndex + '"]'
    );
    for (let i = 0; i < allStars.length; i++) {
        let starValue = parseInt(allStars[i].getAttribute('data-star'));
        if (starValue <= star) {
            allStars[i].classList.add('star-filled');
        } else {
            allStars[i].classList.remove('star-filled');
        }
    }

    let ratingRow = allStars[0].closest('.order-item-rating');
    if (ratingRow) {
        let label = ratingRow.querySelector('.rating-user-label');
        if (!label) {
            let newLabel = document.createElement('span');
            newLabel.className = 'rating-user-label';
            newLabel.textContent = star + ' sao ✓';
            ratingRow.appendChild(newLabel);
        } else {
            label.textContent = star + ' sao ✓';
        }
    }

    locSanPham();

    let itemName = order.items[itemIndex].name;
    hienThongBao('Đã đánh giá "' + itemName + '" ' + star + ' sao ⭐', 'success');
}

// HÀM: xacNhanNhanHang(orderId)
function xacNhanNhanHang(orderId) {
    let orders = taiDonHang();

    for (let i = 0; i < orders.length; i++) {
        if (orders[i].id === orderId) {
            orders[i].status = 'received';
            break;
        }
    }

    localStorage.setItem('techzone-orders', JSON.stringify(orders));
    hienThiDonHang();
    hienThongBao('Đã xác nhận nhận hàng! Bạn có thể đánh giá sản phẩm ngay bây giờ.', 'success');
}

// HÀM: hienThiDonHang()
function hienThiDonHang() {
    let orders = taiDonHang();

    if (orders.length === 0) {
        ordersListEl.innerHTML =
            '<div class="orders-empty">' +
                '<div class="orders-empty-icon">📦</div>' +
                '<p class="orders-empty-text">Bạn chưa có đơn hàng nào</p>' +
                '<p class="orders-empty-sub">Hãy mua sắm và quay lại đây nhé!</p>' +
            '</div>';
        return;
    }

    let sortedOrders = orders.slice().reverse();
    let html = '';

    for (let i = 0; i < sortedOrders.length; i++) {
        let order = sortedOrders[i];

        let statusClass = '';
        let statusText = '';
        let statusIcon = '';
        if (order.status === 'received') {
            statusClass = 'status-received';
            statusText = 'Đã nhận hàng';
            statusIcon = '✅';
        } else {
            statusClass = 'status-processing';
            statusText = 'Đang xử lý';
            statusIcon = '🔄';
        }

        let itemsHTML = '';
        for (let j = 0; j < order.items.length; j++) {
            let item = order.items[j];
            let itemTotal = item.price * item.quantity;

            let product = null;
            if (item.productId) {
                product = timSanPhamTheoId(item.productId);
            }
            let imgHTML = '';
            if (product && product.image) {
                imgHTML = '<img src="' + product.image + '" alt="' + item.name + '" class="order-item-img">';
            } else {
                imgHTML = '<span class="order-item-emoji">📦</span>';
            }

            let ratingHTML = '';
            if (order.status === 'received') {
                let currentRating = item.rating || 0;
                if (currentRating > 0) {
                    ratingHTML = '<div class="order-item-rating">' +
                        '<span class="order-rating-label">Đánh giá:</span>' +
                        hienThiSaoTuongTac(currentRating, order.id, j) +
                        '<span class="rating-user-label">' + currentRating + ' sao ✓</span>' +
                    '</div>';
                } else {
                    ratingHTML = '<div class="order-item-rating">' +
                        '<span class="order-rating-label">Đánh giá:</span>' +
                        hienThiSaoTuongTac(0, order.id, j) +
                    '</div>';
                }
            } else {
                ratingHTML = '<div class="order-item-rating-hint">' +
                    '<span>⭐ Nhận hàng để đánh giá</span>' +
                '</div>';
            }

            itemsHTML += '<div class="order-item">' +
                '<div class="order-item-left">' +
                    imgHTML +
                    '<div class="order-item-info">' +
                        '<div class="order-item-name">' + item.name + '</div>' +
                        '<div class="order-item-meta">SL: ' + item.quantity + ' × ' + dinhDangGia(item.price) + '</div>' +
                        ratingHTML +
                    '</div>' +
                '</div>' +
                '<div class="order-item-total">' + dinhDangGia(itemTotal) + '</div>' +
            '</div>';
        }

        let actionHTML = '';
        if (order.status !== 'received') {
            actionHTML = '<button class="order-receive-btn" onclick="xacNhanNhanHang(' + order.id + ')">' +
                '📦 Xác nhận đã nhận hàng</button>';
        }

        html += '<div class="order-card ' + statusClass + '">' +
            '<div class="order-card-header">' +
                '<div class="order-card-info">' +
                    '<div class="order-id">Đơn #' + order.id.toString().slice(-6) + '</div>' +
                    '<div class="order-date">' + order.date + '</div>' +
                '</div>' +
                '<div class="order-status ' + statusClass + '">' + statusIcon + ' ' + statusText + '</div>' +
            '</div>' +
            '<div class="order-items">' + itemsHTML + '</div>' +
            '<div class="order-card-footer">' +
                '<div class="order-total">Tổng: <strong>' + dinhDangGia(order.total) + '</strong></div>' +
                actionHTML +
            '</div>' +
        '</div>';
    }

    ordersListEl.innerHTML = html;
}

// HÀM: dongMoModalDonHang()
function dongMoModalDonHang() {
    if (ordersModal.classList.contains('active')) {
        ordersModal.classList.remove('active');
    } else {
        hienThiDonHang();
        ordersModal.classList.add('active');
    }
}

// HÀM PHỤ TRỢ: luuDanhGia() / taiDanhGia()
function luuDanhGia() {
    localStorage.setItem('techzone-ratings', JSON.stringify(userRatings));
}

function taiDanhGia() {
    let saved = localStorage.getItem('techzone-ratings');
    if (saved) {
        userRatings = JSON.parse(saved);
    } else {
        userRatings = {};
    }
}

// HÀM 4: layTenDanhMuc(categoryId)
function layTenDanhMuc(categoryId) {
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].id === categoryId) {
            return categories[i].name;
        }
    }
    return 'Khác';
}

// HÀM 5: hienThiBoLocDanhMuc()
function hienThiBoLocDanhMuc() {
    categoryFiltersEl.innerHTML = '';

    for (let i = 0; i < categories.length; i++) {
        let cat = categories[i];

        let btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.setAttribute('data-category', cat.id);

        if (cat.id === currentCategory) {
            btn.classList.add('active');
        }

        btn.innerHTML = cat.icon + ' ' + cat.name;

        btn.addEventListener('click', function () {
            currentCategory = cat.id;
            locSanPham();
            hienThiBoLocDanhMuc();
        });

        categoryFiltersEl.appendChild(btn);
    }
}

// HÀM 6: timKiemSanPham(keyword)
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

// HÀM 7: sapXepSanPham(productList, criteria)
function sapXepSanPham(productList, criteria) {
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

    return sorted;
}

// HÀM 8: locSanPham()
function locSanPham() {
    let filtered = [];
    if (currentSearch.length > 0) {
        filtered = timKiemSanPham(currentSearch);
    } else {
        for (let i = 0; i < products.length; i++) {
            filtered.push(products[i]);
        }
    }

    if (currentCategory !== 'tat-ca') {
        let categoryFiltered = [];
        for (let i = 0; i < filtered.length; i++) {
            if (filtered[i].category === currentCategory) {
                categoryFiltered.push(filtered[i]);
            }
        }
        filtered = categoryFiltered;
    }

    filtered = sapXepSanPham(filtered, currentSort);

    resultCount.innerHTML = 'Hiển thị <span>' + filtered.length + '</span> sản phẩm';

    hienThiSanPham(filtered);
}

// HÀM 9: hienThiSanPham(productList)
function hienThiSanPham(productList) {
    productGrid.innerHTML = '';

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

        let card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = (i * 0.05) + 's';

        let badgeHTML = '';
        if (discount > 0) {
            badgeHTML = '<span class="product-badge">-' + discount + '%</span>';
        }

        let oldPriceHTML = '';
        if (product.oldPrice && product.oldPrice > product.price) {
            oldPriceHTML = '<span class="product-old-price">' + dinhDangGia(product.oldPrice) + '</span>';
        }

        card.innerHTML =
            '<div class="product-image-container">' +
                '<img class="product-img" src="' + product.image + '" alt="' + product.name + '" loading="lazy">' +
                badgeHTML +
            '</div>' +
            '<div class="product-info">' +
                '<div class="product-category">' + layTenDanhMuc(product.category) + '</div>' +
                '<h3 class="product-name">' + product.name + '</h3>' +
                '<p class="product-desc">' + product.description + '</p>' +
                '<div class="product-rating">' +
                    '<span class="stars">' + hienThiSao(userRatings[product.id] || product.rating) + '</span>' +
                    '<span class="rating-number">' + (userRatings[product.id] ? userRatings[product.id] + '.0' : product.rating) + '</span>' +
                    (userRatings[product.id] ? '<span class="rating-user-label">Đã đánh giá</span>' : '') +
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

// HÀM 10: themVaoGio(productId)
function themVaoGio(productId) {
    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity = cart[i].quantity + 1;
            found = true;
            break;
        }
    }

    if (!found) {
        cart.push({ id: productId, quantity: 1 });
    }

    luuGioHang();
    hienThiGioHang();
    capNhatBadgeGio();

    let product = timSanPhamTheoId(productId);
    if (product) {
        hienThongBao('Đã thêm "' + product.name + '" vào giỏ hàng!', 'success');
    }
}

// HÀM 11: timSanPhamTheoId(id)
function timSanPhamTheoId(id) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            return products[i];
        }
    }
    return null;
}

// HÀM 12: xoaKhoiGio(productId)
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

// HÀM 13: capNhatSoLuong(productId, delta)
function capNhatSoLuong(productId, delta) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity = cart[i].quantity + delta;

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

// HÀM 14: tinhTongTien()
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

// HÀM 15: hienThiGioHang()
function hienThiGioHang() {
    cartItemsEl.innerHTML = '';

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
                    '<div class="cart-item-image"><img src="' + product.image + '" alt="' + product.name + '"></div>' +
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

    let total = tinhTongTien();
    cartTotalEl.textContent = dinhDangGia(total);
}

// HÀM 16: capNhatBadgeGio()
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

// HÀM 17: dongMoGioHang()
function dongMoGioHang() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');

    if (cartSidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// HÀM 18: hienThongBao(message, type)
function hienThongBao(message, type) {
    let toast = document.createElement('div');
    toast.className = 'toast ' + type;

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

    setTimeout(function () {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// HÀM 19: kiemTraThanhToan(formData)
function kiemTraThanhToan(formData) {
    let isValid = true;

    let errorElements = document.querySelectorAll('.form-error');
    for (let i = 0; i < errorElements.length; i++) {
        errorElements[i].classList.remove('visible');
    }
    let inputElements = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    for (let i = 0; i < inputElements.length; i++) {
        inputElements[i].classList.remove('error');
    }

    if (!formData.name || formData.name.trim().length < 2) {
        document.getElementById('customer-name').classList.add('error');
        document.getElementById('name-error').classList.add('visible');
        isValid = false;
    }

    let phoneRegex = /^0\d{9}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone.trim())) {
        document.getElementById('customer-phone').classList.add('error');
        document.getElementById('phone-error').classList.add('visible');
        isValid = false;
    }

    if (formData.email && formData.email.trim().length > 0) {
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            document.getElementById('customer-email').classList.add('error');
            document.getElementById('email-error').classList.add('visible');
            isValid = false;
        }
    }

    if (!formData.address || formData.address.trim().length < 10) {
        document.getElementById('customer-address').classList.add('error');
        document.getElementById('address-error').classList.add('visible');
        isValid = false;
    }

    if (!formData.payment || formData.payment === '') {
        document.getElementById('payment-method').classList.add('error');
        document.getElementById('payment-error').classList.add('visible');
        isValid = false;
    }

    return isValid;
}

// HÀM 20: xuLyDatHang()
function xuLyDatHang() {
    let formData = {
        name: document.getElementById('customer-name').value,
        phone: document.getElementById('customer-phone').value,
        email: document.getElementById('customer-email').value,
        address: document.getElementById('customer-address').value,
        payment: document.getElementById('payment-method').value
    };

    if (!kiemTraThanhToan(formData)) {
        hienThongBao('Vui lòng điền đầy đủ thông tin hợp lệ!', 'error');
        return;
    }

    let order = {
        id: Date.now(),
        customer: formData,
        items: [],
        total: tinhTongTien(),
        date: new Date().toLocaleString('vi-VN'),
        status: 'processing'
    };

    for (let i = 0; i < cart.length; i++) {
        let product = timSanPhamTheoId(cart[i].id);
        if (product) {
            order.items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: cart[i].quantity,
                rating: 0
            });
        }
    }

    luuDonHang(order);

    cart = [];
    luuGioHang();
    hienThiGioHang();
    capNhatBadgeGio();

    checkoutModal.classList.remove('active');
    successModal.classList.add('active');

    checkoutForm.reset();

    hienThongBao('Đặt hàng thành công! 🎉', 'success');
}

// HÀM PHỤ TRỢ: luuGioHang() / taiGioHang()
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

// HÀM PHỤ TRỢ: luuDonHang() / taiDonHang()
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

// HÀM: chuyenDoiGiaoDien()
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

// HÀM: dangKySuKien()
function dangKySuKien() {

    document.getElementById('cart-btn').addEventListener('click', function () {
        dongMoGioHang();
    });

    document.getElementById('cart-close-btn').addEventListener('click', function () {
        dongMoGioHang();
    });

    cartOverlay.addEventListener('click', function () {
        dongMoGioHang();
    });

    document.getElementById('orders-btn').addEventListener('click', function () {
        dongMoModalDonHang();
    });

    document.getElementById('orders-close-btn').addEventListener('click', function () {
        ordersModal.classList.remove('active');
    });

    ordersModal.addEventListener('click', function (e) {
        if (e.target === ordersModal) {
            ordersModal.classList.remove('active');
        }
    });

    checkoutBtn.addEventListener('click', function () {
        dongMoGioHang();
        checkoutModal.classList.add('active');
    });

    document.getElementById('checkout-close-btn').addEventListener('click', function () {
        checkoutModal.classList.remove('active');
    });

    checkoutModal.addEventListener('click', function (e) {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('active');
        }
    });

    checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault();
        xuLyDatHang();
    });

    document.getElementById('success-close-btn').addEventListener('click', function () {
        successModal.classList.remove('active');
    });

    successModal.addEventListener('click', function (e) {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });

    searchInput.addEventListener('input', function () {
        currentSearch = searchInput.value;
        locSanPham();
    });

    sortSelect.addEventListener('change', function () {
        currentSort = sortSelect.value;
        locSanPham();
    });

    document.getElementById('theme-toggle-btn').addEventListener('click', function () {
        chuyenDoiGiaoDien();
    });

    window.addEventListener('scroll', function () {
        let header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    document.getElementById('mobile-menu-btn').addEventListener('click', function () {
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

// KHỞI TẠO ỨNG DỤNG
function khoiTao() {
    taiGiaoDien();
    taiGioHang();
    taiDanhGia();
    hienThiBoLocDanhMuc();
    locSanPham();
    hienThiGioHang();
    capNhatBadgeGio();
    dangKySuKien();
}

document.addEventListener('DOMContentLoaded', khoiTao);
