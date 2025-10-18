# API Testing Guide for Fashion Shop Gem - Order Module

## 🛒 Module: ĐƠN HÀNG (Order)

### 1. Lấy danh sách đơn hàng (có Sắp xếp & Phân trang)
- **Endpoint:** GET /orders
- **Method:** GET
- **URL:** http://localhost:8080/api/v1/orders?page=0&size=10&sort=totalAmount,desc
- **Params:**
  - `page`: Số trang (bắt đầu từ 0).
  - `size`: Số lượng đơn hàng mỗi trang (tối đa 10).
  - `sort`: Sắp xếp theo orderDate (Ngày) hoặc totalAmount (Tổng tiền) với chiều asc (tăng dần) hoặc desc (giảm dần).

- **Success Response (200 OK):**
```json
{
    "content": [
        {
            "id": 1,
            "customerId": 101,
            "orderDate": "2025-10-17T10:30:00",
            "status": "Đã giao",
            "totalAmount": 1500000
        }
    ],
    "pageable": { ... },
    "totalPages": 5,
    "totalElements": 48,
    ...
}
```

### 2. Thêm một đơn hàng mới
- **Endpoint:** POST /orders
- **Method:** POST
- **URL:** http://localhost:8080/api/v1/orders
- **Body (raw/JSON):**
```json
{
    "customerId": 102,
    "orderDate": "2025-10-17T23:59:00",
    "status": "Đang xử lý",
    "totalAmount": 890000
}
```

- **Success Response (201 Created):**
```json
{
    "id": 201,
    "customerId": 102,
    "orderDate": "2025-10-17T23:59:00",
    "status": "Đang xử lý",
    "totalAmount": 890000
}
```

### 3. Cập nhật thông tin đơn hàng
- **Endpoint:** PUT /orders/{id}
- **Method:** PUT
- **URL:** http://localhost:8080/api/v1/orders/201
- **Body (raw/JSON):**
```json
{
    "customerId": 102,
    "orderDate": "2025-10-17T23:59:00",
    "status": "Đang giao",
    "totalAmount": 890000
}
```

- **Success Response (200 OK):**
```json
{
    "id": 201,
    "customerId": 102,
    "orderDate": "2025-10-17T23:59:00",
    "status": "Đang giao",
    "totalAmount": 890000
}
```

### 4. Xóa một đơn hàng
- **Endpoint:** DELETE /orders/{id}
- **Method:** DELETE
- **URL:** http://localhost:8080/api/v1/orders/201
- **Success Response (204 No Content):** Không có nội dung trả về.

### 5. Tìm kiếm đơn hàng
- **Endpoint:** GET /orders/search
- **Method:** GET
- **URL:** http://localhost:8080/api/v1/orders/search?customerId=102
- **Params:**
  - `customerId`: Tìm theo Mã Khách hàng.
  - `orderDate`: Tìm theo Ngày đặt hàng (ví dụ: 2025-10-17).
  - `status`: Tìm theo Trạng thái (ví dụ: Đang xử lý).

- **Success Response (200 OK):**
```json
[
    {
        "id": 201,
        "customerId": 102,
        "orderDate": "2025-10-17T23:59:00",
        "status": "Đang giao",
        "totalAmount": 890000
    }
]
```
