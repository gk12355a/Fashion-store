# API Testing Guide for Fashion Shop Gem - OrderDetail Module

## 📋 Module: CHI TIẾT ĐƠN HÀNG (OrderDetail)

### 1. Lấy danh sách chi tiết đơn hàng (có Sắp xếp & Phân trang)
- **Endpoint:** GET /order-details
- **Method:** GET
- **URL:** http://localhost:8080/api/v1/order-details?page=0&size=10&sort=unitPrice,desc
- **Params:**
  - `page`: Số trang (bắt đầu từ 0).
  - `size`: Số lượng chi tiết mỗi trang (tối đa 10).
  - `sort`: Sắp xếp theo productId (Mã SP) hoặc unitPrice (Đơn giá) với chiều asc hoặc desc.

- **Success Response (200 OK):**
```json
{
    "content": [
        {
            "id": 1,
            "orderId": 201,
            "productId": 101,
            "quantity": 2,
            "unitPrice": 550000
        }
    ],
    "pageable": { ... },
    "totalPages": 2,
    "totalElements": 15,
    ...
}
```

### 2. Thêm một chi tiết đơn hàng mới
- **Endpoint:** POST /order-details
- **Method:** POST
- **URL:** http://localhost:8080/api/v1/order-details
- **Body (raw/JSON):**
```json
{
    "orderId": 201,
    "productId": 105,
    "quantity": 1,
    "unitPrice": 890000
}
```

- **Success Response (201 Created):**
```json
{
    "id": 301,
    "orderId": 201,
    "productId": 105,
    "quantity": 1,
    "unitPrice": 890000
}
```

### 3. Cập nhật thông tin chi tiết đơn hàng
- **Endpoint:** PUT /order-details/{id}
- **Method:** PUT
- **URL:** http://localhost:8080/api/v1/order-details/301
- **Body (raw/JSON):**
```json
{
    "quantity": 3,
    "unitPrice": 900000
}
```

- **Success Response (200 OK):**
```json
{
    "id": 301,
    "orderId": 201,
    "productId": 105,
    "quantity": 3,
    "unitPrice": 900000
}
```

### 4. Xóa một chi tiết đơn hàng
- **Endpoint:** DELETE /order-details/{id}
- **Method:** DELETE
- **URL:** http://localhost:8080/api/v1/order-details/301
- **Success Response (204 No Content):** Không có nội dung trả về.

### 5. Tìm kiếm chi tiết đơn hàng
- **Endpoint:** GET /order-details/search
- **Method:** GET
- **URL:**
  - Tìm theo Mã đơn: http://localhost:8080/api/v1/order-details/search?orderId=201
  - Tìm theo Mã sản phẩm: http://localhost:8080/api/v1/order-details/search?productId=105
- **Params:**
  - `orderId`: Tìm theo Mã đơn hàng.
  - `productId`: Tìm theo Mã sản phẩm.

- **Success Response (200 OK):**
```json
[
    {
        "id": 1,
        "orderId": 201,
        "productId": 101,
        "quantity": 2,
        "unitPrice": 550000
    }
]
```
