# README - Hướng dẫn Test Module Khuyến Mãi (Promotion)

Tài liệu này cung cấp hướng dẫn chi tiết để kiểm tra các API endpoints của module **Khuyến Mãi** trong dự án **Fashion Shop**.

---

## 📝 Tổng quan các API Endpoints

| Feature | Method | URL | Mô tả |
|----------|---------|-----|------|
| Lấy danh sách | GET | /api/v1/promotions | Lấy danh sách tất cả khuyến mãi (hỗ trợ phân trang và sắp xếp). |
| Tạo mới | POST | /api/v1/promotions | Tạo một chương trình khuyến mãi mới. |
| Cập nhật | PUT | /api/v1/promotions/{id} | Cập nhật thông tin của một khuyến mãi đã có. |
| Xóa | DELETE | /api/v1/promotions/{id} | Xóa một khuyến mãi dựa trên ID. |
| Tìm kiếm | GET | /api/v1/promotions/search | Tìm kiếm khuyến mãi theo tên hoặc loại. |

---

## 🧪 Hướng dẫn Test chi tiết

Để thực hiện test, bạn có thể sử dụng các công cụ như **Postman**, **Insomnia**, hoặc **cURL** trên command line.  
Các ví dụ dưới đây sẽ sử dụng **cURL**.

---

### 1. Feature: Lấy danh sách khuyến mãi

**Mục tiêu:** Kiểm tra khả năng lấy danh sách khuyến mãi, bao gồm phân trang và sắp xếp.

#### a. Lấy danh sách mặc định
```bash
curl -X GET http://localhost:8080/api/v1/promotions
```
✅ **Kết quả mong đợi (200 OK):** Một đối tượng JSON chứa danh sách khuyến mãi trong `content` và thông tin phân trang.

#### b. Lấy danh sách với phân trang (trang 0, 5 mục/trang)
```bash
curl -X GET "http://localhost:8080/api/v1/promotions?page=0&size=5"
```
✅ **Kết quả mong đợi (200 OK):** `content` sẽ chỉ chứa tối đa 5 khuyến mãi.

#### c. Lấy danh sách với sắp xếp (sắp xếp theo tên, giảm dần)
```bash
curl -X GET "http://localhost:8080/api/v1/promotions?sort=name,desc"
```
✅ **Kết quả mong đợi (200 OK):** Danh sách khuyến mãi được sắp xếp theo tên từ Z-A.

---

### 2. Feature: Tạo khuyến mãi mới

**Mục tiêu:** Kiểm tra khả năng tạo một khuyến mãi mới với dữ liệu hợp lệ.

**Lệnh cURL:**
```bash
curl -X POST http://localhost:8080/api/v1/promotions \
-H "Content-Type: application/json" \
-d '{
  "name": "Sale Mừng Lễ 30/4",
  "type": "PERCENTAGE",
  "discountValue": 15,
  "expiryDate": "2025-04-30"
}'
```
✅ **Kết quả mong đợi (201 Created):** Một đối tượng JSON chứa thông tin chi tiết của khuyến mãi vừa được tạo, bao gồm cả `id`.


---

### 3. Feature: Cập nhật khuyến mãi

**Mục tiêu:** Kiểm tra khả năng cập nhật thông tin của một khuyến mãi đã tồn tại.

**Lệnh cURL (cập nhật khuyến mãi có ID = 1):**
```bash
curl -X PUT http://localhost:8080/api/v1/promotions/1 \
-H "Content-Type: application/json" \
-d '{
  "name": "Đại Tiệc Sale 30/4 - UPDATED",
  "type": "FIXED_AMOUNT",
  "discountValue": 50000,
  "expiryDate": "2025-05-01"
}'
```
✅ **Kết quả mong đợi (200 OK):** Một đối tượng JSON chứa thông tin của khuyến mãi đã được cập nhật.

---

### 4. Feature: Xóa khuyến mãi

**Mục tiêu:** Kiểm tra khả năng xóa một khuyến mãi khỏi hệ thống.

**Lệnh cURL (xóa khuyến mãi có ID = 1):**
```bash
curl -X DELETE http://localhost:8080/api/v1/promotions/1
```
✅ **Kết quả mong đợi (204 No Content):** API sẽ không trả về nội dung gì, chỉ có status code 204. Sau khi xóa, khuyến mãi này sẽ không còn trong danh sách khi gọi API GET.

---

### 5. Feature: Tìm kiếm khuyến mãi

**Mục tiêu:** Kiểm tra khả năng tìm kiếm khuyến mãi theo từ khóa.

**Lệnh cURL (tìm các khuyến mãi có chứa từ "sale"):**
```bash
curl -X GET "http://localhost:8080/api/v1/promotions/search?keyword=sale"
```
✅ **Kết quả mong đợi (200 OK):** Một đối tượng JSON chứa danh sách các khuyến mãi có tên hoặc loại chứa từ khóa *sale* (không phân biệt hoa thường). Nếu không tìm thấy, `content` sẽ là một mảng rỗng.
