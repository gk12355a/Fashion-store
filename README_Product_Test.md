# 🧪 Hướng dẫn Test API - Fashion Store

Tài liệu này mô tả cách kiểm tra các API endpoint cho dự án **Fashion Store** bằng công cụ như **Postman**.

**Base URL:** `http://localhost:8080/api/v1`

---

## 👕 Module: SẢN PHẨM (Product)

### 1. Lấy danh sách sản phẩm (có Sắp xếp & Phân trang)

**Endpoint:** `GET /products`  
**URL:** `http://localhost:8080/api/v1/products?page=0&size=10&sort=price,asc`

**Params:**  
- `page`: Số trang (bắt đầu từ 0).  
- `size`: Số lượng sản phẩm mỗi trang (tối đa 10).  
- `sort`: Sắp xếp theo `name`, `price`, hoặc `inventory` với chiều `asc` (tăng dần) hoặc `desc` (giảm dần).

**Success Response (200 OK):**
```json
{
    "content": [
        {
            "id": 1,
            "imageUrl": "http://example.com/image.jpg",
            "name": "Áo Sơ Mi Dài Tay",
            "category": "Áo Sơ Mi",
            "size": "M",
            "color": "Trắng",
            "price": 550000,
            "inventory": 50
        }
    ],
    "pageable": { },
    "totalPages": 5,
    "totalElements": 48
}
```

---

### 2. Thêm một sản phẩm mới

**Endpoint:** `POST /products`  
**URL:** `http://localhost:8080/api/v1/products`

**Body (raw/JSON):**
```json
{
    "imageUrl": "http://example.com/new_image.jpg",
    "name": "Quần Jeans Slim-fit",
    "category": "Quần Jeans",
    "size": "L",
    "color": "Xanh Đen",
    "price": 890000,
    "inventory": 120
}
```

**Success Response (201 Created):**
```json
{
    "id": 101,
    "imageUrl": "http://example.com/new_image.jpg",
    "name": "Quần Jeans Slim-fit",
    "category": "Quần Jeans",
    "size": "L",
    "color": "Xanh Đen",
    "price": 890000,
    "inventory": 120
}
```

---

### 3. Cập nhật thông tin sản phẩm

**Endpoint:** `PUT /products/{id}`  
**URL:** `http://localhost:8080/api/v1/products/101`

**Body (raw/JSON):**
```json
{
    "price": 950000,
    "inventory": 115
}
```

**Success Response (200 OK):**
```json
{
    "id": 101,
    "imageUrl": "http://example.com/new_image.jpg",
    "name": "Quần Jeans Slim-fit",
    "category": "Quần Jeans",
    "size": "L",
    "color": "Xanh Đen",
    "price": 950000,
    "inventory": 115
}
```

---

### 4. Xóa một sản phẩm

**Endpoint:** `DELETE /products/{id}`  
**URL:** `http://localhost:8080/api/v1/products/101`

**Success Response (204 No Content):** Không có nội dung trả về.

---

### 5. Tìm kiếm sản phẩm

**Endpoint:** `GET /products/search`  
**URL:** `http://localhost:8080/api/v1/products/search?keyword=jeans`

**Params:**  
- `keyword`: Từ khóa để tìm kiếm theo **Tên**, **Loại**, **Size**, hoặc **Màu**.

**Success Response (200 OK):**
```json
[
    {
        "id": 101,
        "imageUrl": "http://example.com/new_image.jpg",
        "name": "Quần Jeans Slim-fit",
        "category": "Quần Jeans",
        "size": "L",
        "color": "Xanh Đen",
        "price": 950000,
        "inventory": 115
    }
]
```
