# Kiến Thức HTML Được Sử Dụng Trong Dự Án TechZone

Tài liệu này tổng hợp toàn bộ các thẻ (tags), thuộc tính (attributes), và cấu trúc HTML5 được sử dụng để xây dựng bộ khung cho website bán hàng công nghệ **TechZone**.

---

## 1. Cấu Trúc Cơ Bản Của Trang Web (Document Metadata & Boilerplate)
*   `<!DOCTYPE html>`: Khai báo chuẩn HTML5 cho trình duyệt.
*   `<html lang="vi">`: Khai báo ngôn ngữ trang web là tiếng Việt, giúp các bộ máy tìm kiếm (SEO) và trình đọc màn hình nhận diện chính xác.
*   `<head>`: Chứa thông tin cấu hình (metadata) không hiển thị trực tiếp trên trang.
*   `<meta charset="UTF-8">`: Cấu hình mã hóa ký tự giúp hiển thị tiếng Việt có dấu chuẩn xác mà không bị lỗi font.
*   `<meta name="viewport" content="width=device-width, initial-scale=1.0">`: Cấu hình giúp website tương thích với các kích thước màn hình (Responsive Design) trên điện thoại, máy tính bảng và desktop.
*   `<meta name="description">`, `<meta name="keywords">`, `<meta name="author">`: Các thẻ meta hỗ trợ SEO, cung cấp mô tả ngắn, từ khóa chính và tác giả của trang web.
*   `<title>`: Đặt tiêu đề hiển thị trên tab của trình duyệt.
*   `<link rel="stylesheet" href="...">`: Nhúng file CSS (`css/style.css`) để thiết kế giao diện.
*   `<link rel="icon" href="...">`: Nhúng biểu tượng icon (favicon) cho tab trình duyệt bằng định dạng mã hóa SVG inline chứa emoji `⚡`.

---

## 2. Các Thẻ HTML5 Ngữ Nghĩa (Semantic Tags)
Sử dụng thẻ ngữ nghĩa giúp mã nguồn rõ ràng hơn và hỗ trợ đắc lực cho công cụ tìm kiếm:
*   `<header>`: Phần đầu trang web, chứa Logo, thanh tìm kiếm và các nút điều khiển (giỏ hàng, nút đổi giao diện).
*   `<section>`: Định nghĩa các vùng nội dung độc lập (Ví dụ: `section class="hero"` giới thiệu banner quảng cáo chính).
*   `<main>`: Vùng chứa nội dung quan trọng nhất của trang web (Trong dự án là danh sách sản phẩm và các nút lọc).
*   `<aside>`: Định nghĩa nội dung phụ bên lề. Được dùng để làm Sidebar giỏ hàng trượt ra từ bên phải màn hình (`class="cart-sidebar"`).
*   `<footer>`: Phần chân trang, chứa thông tin liên hệ, liên kết nhanh hỗ trợ khách hàng và bản quyền.

---

## 3. Các Thẻ Văn Bản & Cấu Trúc Khối (Text & Block Formatting)
*   `<h1>` đến `<h3>`: Các tiêu đề trang có độ quan trọng giảm dần:
    *   `<h1>`: Tiêu đề chính lớn nhất nằm ở khu vực banner Hero.
    *   `<h2>`: Dùng cho tiêu đề của từng phần nội dung lớn như "Sản Phẩm Nổi Bật".
    *   `<h3>`: Tiêu đề nhỏ (tên sản phẩm, các đề mục trong Modal/Footer).
*   `<p>`: Thẻ đoạn văn dùng để hiển thị các văn bản giới thiệu, mô tả sản phẩm.
*   `<span>`: Thẻ nội dung inline dùng để bọc các thành phần chữ nhỏ cần định dạng CSS riêng biệt (như số lượng giỏ hàng, chữ gradient, sao đánh giá).
*   `<div>`: Thẻ phân chia vùng (block) dùng làm container trung gian để định vị layout (Flexbox/Grid).
*   `<br>`: Thẻ ngắt dòng văn bản.
*   `<ul>` & `<li>`: Tạo danh sách không thứ tự, được sử dụng ở chân trang (Footer) để liệt kê các đường liên kết nhanh.

---

## 4. Các Thẻ Liên Kết & Đa Phương Tiện (Links & Icons)
*   `<a href="...">`: Tạo liên kết điều hướng:
    *   `href="#"`: Liên kết giả hoặc quay về đầu trang.
    *   `href="#products"`: Liên kết neo (Anchor Link) giúp màn hình tự động cuộn đến khu vực có `id="products"` khi click.
*   **Emoji/Icon Inline:** Thay vì tải tệp hình ảnh nặng, dự án sử dụng trực tiếp các ký tự Emoji (`⚡`, `🔍`, `🌙`, `🛒`, `💵`, `🏦`, `🏠`, `🗑️`) để làm icon. Điều này giúp tối ưu hóa thời gian tải trang.

---

## 5. Biểu Mẫu & Tương Tác (Forms & Inputs)
Được sử dụng trong Form điền thông tin khi nhấn nút Thanh toán:
*   `<form id="checkout-form">`: Bọc toàn bộ các ô nhập dữ liệu, giúp gom nhóm dữ liệu để gửi đi hoặc kiểm tra tính hợp lệ trước khi đặt hàng.
*   `<label for="...">`: Gắn nhãn cho các ô nhập liệu. Thuộc tính `for` liên kết chặt chẽ với `id` của thẻ input tương ứng để tăng trải nghiệm người dùng (bấm vào chữ label thì con trỏ tự động nhảy vào ô input).
*   `<input>`: Các ô nhập thông tin với nhiều kiểu dữ liệu (type) phù hợp:
    *   `type="text"`: Ô nhập văn bản thông thường (Họ và tên).
    *   `type="tel"`: Ô chuyên dụng nhập số điện thoại, kích hoạt bàn phím số trên thiết bị di động.
    *   `type="email"`: Ô nhập định dạng hòm thư điện tử.
*   `<textarea>`: Ô nhập văn bản nhiều dòng để khách hàng nhập địa chỉ giao hàng chi tiết.
*   `<select>` & `<option>`: Hộp chọn thả xuống (Drop-down list) để người dùng chọn phương thức thanh toán hoặc sắp xếp sản phẩm.
*   `<button>`: Các nút bấm dùng để thực hiện hành động:
    *   `type="submit"`: Dùng trong form để gửi dữ liệu đi khi click.
    *   Thuộc tính `disabled`: Vô hiệu hóa không cho click khi giỏ hàng trống.

---

## 6. Các Thuộc Tính HTML Quan Trọng (Key Attributes)
*   `id`: Tên định danh duy nhất của phần tử trên trang. Được JavaScript dùng làm tham chiếu để lấy giá trị hoặc chỉnh sửa (như `id="search-input"`, `id="cart-total"`).
*   `class`: Dùng để áp dụng các định dạng CSS hoặc được JavaScript bật/tắt để thay đổi trạng thái giao diện (Ví dụ: thêm class `.active` để mở sidebar, thêm class `.error` để cảnh báo viền đỏ).
*   `placeholder`: Dòng chữ gợi ý mờ hiển thị bên trong các ô input trước khi người dùng nhập dữ liệu.
*   `required`: Thuộc tính khai báo trường bắt buộc phải nhập dữ liệu trong biểu mẫu.
*   `autocomplete="off"`: Tắt tính năng tự động gợi ý lịch sử nhập của trình duyệt trên thanh tìm kiếm.
*   `title`: Hiển thị dòng mô tả ngắn (Tooltip) khi người dùng di chuột (hover) qua nút bấm.
*   `aria-label`: Cải thiện khả năng tiếp cận (Accessibility) giúp trình đọc màn hình cho người khiếm thị hiểu được chức năng của nút Menu di động.
