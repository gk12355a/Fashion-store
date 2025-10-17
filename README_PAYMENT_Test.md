# API Testing Guide for Fashion Shop Gem - Payment Module

## 💰 Module: THANH TOÁN (Payment)

### 1. Lấy danh sách thanh toán (có Sắp xếp & Phân trang)
- **Endpoint:** GET /payments
- **Method:** GET
- **URL:** http://localhost:8080/api/v1/payments?page=0&size=10&sort=paymentDate,desc
- **Params:**
  - `page`: Số trang (bắt đầu từ 0).
  - `size`: Số lượng thanh toán mỗi trang (tối đa 10).
  - `sort`: Sắp xếp theo paymentDate (Ngày TT) hoặc amount (Số tiền) với chiều asc hoặc desc.

- **Success Response (200 OK):**
```json
{
    "content": [
        {
            "id": 1,
            "orderId": 201,
            "paymentMethod": "Chuyển khoản",
            "amount": 1780000,
            "paymentDate": "2025-10-18T10:05:00"
        }
    ],
    "pageable": { ... },
    "totalPages": 3,
    "totalElements": 25,
    ...
}
```

### 2. Thêm một thanh toán mới
- **Endpoint:** POST /payments
- **Method:** POST
- **URL:** http://localhost:8080/api/v1/payments
- **Body (raw/JSON):**
```json
{
    "orderId": 202,
    "paymentMethod": "Tiền mặt",
    "amount": 950000,
    "paymentDate": "2025-10-18T12:30:00"
}
```

- **Success Response (201 Created):**
```json
{
    "id": 401,
    "orderId": 202,
    "paymentMethod": "Tiền mặt",
    "amount": 950000,
    "paymentDate": "2025-10-18T12:30:00"
}
```

### 3. Cập nhật thông tin thanh toán
- **Endpoint:** PUT /payments/{id}
- **Method:** PUT
- **URL:** http://localhost:8080/api/v1/payments/401
- **Body (raw/JSON):**
```json
{
    "paymentMethod": "Ví điện tử",
    "amount": 955000
}
```

- **Success Response (200 OK):**
```json
{
    "id": 401,
    "orderId": 202,
    "paymentMethod": "Ví điện tử",
    "amount": 955000,
    "paymentDate": "2025-10-18T12:30:00"
}
```

### 4. Xóa một thanh toán
- **Endpoint:** DELETE /payments/{id}
- **Method:** DELETE
- **URL:** http://localhost:8080/api/v1/payments/401
- **Success Response (204 No Content):** Không có nội dung trả về.

### 5. Tìm kiếm thanh toán
- **Endpoint:** GET /payments/search
- **Method:** GET
- **URL:**
  - Tìm theo Mã đơn: http://localhost:8080/api/v1/payments/search?orderId=201
  - Tìm theo Phương thức: http://localhost:8080/api/v1/payments/search?method=Tiền mặt
- **Params:**
  - `orderId`: Tìm theo Mã đơn hàng.
  - `method`: Tìm theo Phương thức thanh toán.

- **Success Response (200 OK):**
```json
[
    {
        "id": 1,
        "orderId": 201,
        "paymentMethod": "Chuyển khoản",
        "amount": 1780000,
        "paymentDate": "2025-10-18T10:05:00"
    }
]
```

This documentation is customized for Fashion Shop Gem. Let me know if there are more modules or if you'd like a comprehensive guide combining all of them!