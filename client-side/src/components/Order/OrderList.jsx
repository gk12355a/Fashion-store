import React from "react";
import "../Table.css";

// Hàm format ngày (ví dụ)
const formatDate = (dateTimeString) => {
  if (!dateTimeString) return "";
  try {
    const date = new Date(dateTimeString);
    // Lấy ngày/tháng/năm
    return date.toLocaleDateString('vi-VN'); 
  } catch (e) {
    return dateTimeString; // Trả về chuỗi gốc nếu lỗi
  }
}

export default function OrderList({ orders, handleSort, sortField, sortOrder, handleEdit, handleDelete }) {
  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Mã KH</th>
          {/* Sửa sort field */}
          <th className={`sortable ${sortField === "orderDate" ? sortOrder : ""}`} onClick={() => handleSort("orderDate")}>Ngày</th>
          <th>Trạng thái</th>
          {/* Sửa sort field */}
          <th className={`sortable ${sortField === "totalAmount" ? sortOrder : ""}`} onClick={() => handleSort("totalAmount")}>Tổng tiền (VNĐ)</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customerId}</td>
              {/* Sửa hiển thị */}
              <td>{formatDate(o.orderDate)}</td>
              <td>{o.status}</td>
              <td>{o.totalAmount.toLocaleString()}</td> 
              {/* ------------ */}
              <td>
                <button className="edit-btn" onClick={() => handleEdit(o)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(o.id)}>🗑️</button>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan="6">Không tìm thấy đơn hàng</td></tr>
        )}
      </tbody>
    </table>
  );
}