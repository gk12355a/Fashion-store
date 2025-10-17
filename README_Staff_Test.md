# API Testing Guide for Fashion Shop Gem - Staff Module

## 👥 Module: NHÂN VIÊN (Staff)

### 1. Lấy danh sách nhân viên (có Sắp xếp & Phân trang)
- **Endpoint:** GET /staffs
- **Method:** GET
- **URL:** http://localhost:8080/api/v1/staffs?page=0&size=10&sort=salary,desc
- **Params:**
  - `page`: Số trang (bắt đầu từ 0).
  - `size`: Số lượng nhân viên mỗi trang (tối đa 10).
  - `sort`: Sắp xếp theo salary (Lương) với chiều asc (tăng dần) hoặc desc (giảm dần).

- **Success Response (200 OK):**
```json
{
    "content": [
        {
            "id": 1,
            "name": "Nguyễn Văn A",
            "position": "Quản lý",
            "salary": 15000000,
            "workShift": "Ca Hành chính"
        }
    ],
    "pageable": { ... },
    "totalPages": 5,
    "totalElements": 45,
    ...
}
```

### 2. Thêm một nhân viên mới
- **Endpoint:** POST /staffs
- **Method:** POST
- **URL:** http://localhost:8080/api/v1/staffs
- **Body (raw/JSON):**
```json
{
    "name": "Nguyễn Văn An",
    "position": "Nhân viên bán hàng",
    "salary": 7500000,
    "workShift": "Ca Sáng"
}
```

- **Success Response (201 Created):**
```json
{
    "id": 101,
    "name": "Nguyễn Văn An",
    "position": "Nhân viên bán hàng",
    "salary": 7500000,
    "workShift": "Ca Sáng"
}
```

### 3. Cập nhật thông tin nhân viên
- **Endpoint:** PUT /staffs/{id}
- **Method:** PUT
- **URL:** http://localhost:8080/api/v1/staffs/101
- **Body (raw/JSON):**
```json
{
    "name": "Trần Thị Bình",
    "position": "Quản lý cửa hàng",
    "salary": 15000000,
    "workShift": "Ca Hành chính"
}
```

- **Success Response (200 OK):**
```json
{
    "id": 101,
    "name": "Trần Thị Bình",
    "position": "Quản lý cửa hàng",
    "salary": 15000000,
    "workShift": "Ca Hành chính"
}
```

### 4. Xóa một nhân viên
- **Endpoint:** DELETE /staffs/{id}
- **Method:** DELETE
- **URL:** http://localhost:8080/api/v1/staffs/101
- **Success Response (204 No Content):** Không có nội dung trả về.

### 5. Tìm kiếm nhân viên
- **Endpoint:** GET /staffs/search
- **Method:** GET
- **URL:** http://localhost:8080/api/v1/staffs/search?keyword=viên
- **Params:**
  - `keyword`: Tìm theo tên hoặc chức vụ (không phân biệt hoa thường).

- **Success Response (200 OK):**
```json
[
    {
        "id": 1,
        "name": "Nguyễn Văn A",
        "position": "Nhân viên bán hàng",
        "salary": 7500000,
        "workShift": "Ca Sáng"
    }
]
```

This documentation is customized for Fashion Shop Gem. Let me know if there are more modules or if you'd like a comprehensive guide combining all of them!