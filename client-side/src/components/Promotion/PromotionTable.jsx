import React from "react";
import "../Table.css";

// Hàm format ngày (ví dụ)
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    // Thêm 1 ngày để tránh lỗi timezone khi hiển thị YYYY-MM-DD
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('vi-VN');
  } catch (e) {
    return dateString;
  }
}
export default function PromotionTable({ promotions, handleEdit, handleDelete }) {
  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          {/* 2. Xóa class/onClick */}
          <th>Tên KM</th>
          <th>Loại</th>
          {/* 3. Xóa class/onClick */}
          <th>Giảm giá</th>
          {/* 4. Xóa class/onClick */}
          <th>Thời hạn</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {promotions.length > 0 ? promotions.map(p => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td style={{ textAlign: "left", paddingLeft: "10px" }}>{p.name}</td>
            <td>{p.type}</td>
            <td>{p.discountValue?.toLocaleString('vi-VN')} {p.type === 'PERCENTAGE' ? '%' : 'đ'}</td>
            <td>{formatDate(p.expiryDate)}</td>
            <td>
              {/* 5. Đồng bộ class nút */}
              <button className="action edit" onClick={() => handleEdit(p)}>✏️</button>
              <button className="action delete" onClick={() => handleDelete(p.id)}>🗑️</button>
            </td>
          </tr>
        )) : <tr><td colSpan="6">Không tìm thấy khuyến mãi</td></tr>}
      </tbody>
    </table>
  );
}