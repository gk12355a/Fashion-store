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

export default function PromotionTable({ promotions, handleSort, sortField, sortOrder, handleEdit, handleDelete }) {
  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          <th className={`sortable ${sortField === "name" ? sortOrder : ""}`} onClick={() => handleSort("name")}>
            Tên KM
          </th>
          <th>Loại</th>
          {/* Sửa sort field */}
          <th className={`sortable ${sortField === "discountValue" ? sortOrder : ""}`} onClick={() => handleSort("discountValue")}>
            Giảm giá
          </th>
          {/* Sửa sort field */}
          <th className={`sortable ${sortField === "expiryDate" ? sortOrder : ""}`} onClick={() => handleSort("expiryDate")}>
            Thời hạn
          </th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {promotions.length > 0 ? promotions.map(p => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.type}</td>
            {/* Sửa hiển thị */}
            <td>{p.discountValue?.toLocaleString()} {p.type === 'PERCENTAGE' ? '%' : 'đ'}</td>
            <td>{formatDate(p.expiryDate)}</td>
            {/* ------------ */}
            <td>
              <button className="edit-btn" onClick={() => handleEdit(p)}>✏️</button>
              <button className="delete-btn" onClick={() => handleDelete(p.id)}>🗑️</button>
            </td>
          </tr>
        )) : <tr><td colSpan="6">Không tìm thấy khuyến mãi</td></tr>}
      </tbody>
    </table>
  );
}