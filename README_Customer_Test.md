# 🧪 Hướng dẫn Test API - Fashion Store

Tài liệu này mô tả cách kiểm tra các API endpoint cho dự án **Fashion Store** bằng công cụ như **Postman**.

**Base URL:** `http://localhost:8080/api/v1`

---

## 👥 Module: KHÁCH HÀNG (Customer)

### 1. Lấy danh sách khách hàng (có Sắp xếp & Phân trang)

**Endpoint:** `GET /customers`  
**URL:** `http://localhost:8080/api/v1/customers?page=0&size=10&sort=rewardPoints,desc`

**Params:**  
- `page`: Số trang (bắt đầu từ 0).  
- `size`: Số lượng khách hàng mỗi trang (tối đa 10).  
- `sort`: Sắp xếp theo `name` hoặc `rewardPoints` với chiều `asc` (tăng dần) hoặc `desc` (giảm dần).

**Success Response (200 OK):**
```json
{
    "content": [
        {
            "id": 1,
            "name": "Nguyễn Văn A",
            "phone": "0987654321",
            "email": "nguyenvana@example.com",
            "memberType": "Vàng",
            "rewardPoints": 1500
        }
    ],
    "pageable": { },
    "totalPages": 10,
    "totalElements": 95
}
```

---

### 2. Thêm một khách hàng mới

**Endpoint:** `POST /customers`  
**URL:** `http://localhost:8080/api/v1/customers`

**Body (raw/JSON):**
```json
{
    "name": "Trần Thị B",
    "phone": "0912345678",
    "email": "tranthib@example.com",
    "memberType": "Bạc",
    "rewardPoints": 100
}
```

**Success Response (201 Created):**
```json
{
    "id": 102,
    "name": "Trần Thị B",
    "phone": "0912345678",
    "email": "tranthib@example.com",
    "memberType": "Bạc",
    "rewardPoints": 100
}
```

---

### 3. Cập nhật thông tin khách hàng

**Endpoint:** `PUT /customers/{id}`  
**URL:** `http://localhost:8080/api/v1/customers/102`

**Body (raw/JSON):**
```json
{
    "name": "Trần Thị B",
    "phone": "0912345678",
    "email": "tranthib.updated@example.com",
    "memberType": "Vàng",
    "rewardPoints": 1250
}
```

**Success Response (200 OK):**
```json
{
    "id": 102,
    "name": "Trần Thị B",
    "phone": "0912345678",
    "email": "tranthib.updated@example.com",
    "memberType": "Vàng",
    "rewardPoints": 1250
}
```

---

### 4. Xóa một khách hàng

**Endpoint:** `DELETE /customers/{id}`  
**URL:** `http://localhost:8080/api/v1/customers/102`

**Success Response (204 No Content):** Không có nội dung trả về.

---

### 5. Tìm kiếm khách hàng

**Endpoint:** `GET /customers/search`  
**URL:** `http://localhost:8080/api/v1/customers/search?keyword=0912345678`

**Params:**  
- `keyword`: Từ khóa để tìm kiếm theo **Tên**, **SĐT**, hoặc **Email**.

**Success Response (200 OK):**
```json
[
    {
        "id": 102,
        "name": "Trần Thị B",
        "phone": "0912345678",
        "email": "tranthib.updated@example.com",
        "memberType": "Vàng",
        "rewardPoints": 1250
    }
]
```
