import React from "react";
import "../Table.css";

// Hàm format ngày (ví dụ)
const formatDate = (dateTimeString) => {
  if (!dateTimeString) return "";
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('vi-VN'); 
  } catch (e) {
    return dateTimeString;
  }
}

// 1. Xóa props: handleSort, sortField, sortOrder
export default function OrderList({ orders, handleEdit, handleDelete }) {
  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Mã KH</th>
          {/* 2. Xóa class và onClick */}
          <th>Ngày</th>
          <th>Trạng thái</th>
          {/* 3. Xóa class và onClick */}
          <th>Tổng tiền (VNĐ)</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              {/* API /orders mới trả về DTO, nên chúng ta truy cập customerId */}
              <td>{o.customerId}</td> 
              <td>{formatDate(o.orderDate)}</td>
              <td>{o.status}</td>
              <td>{o.totalAmount.toLocaleString()}</td> 
              <td>
                {/* 4. Sửa class nút cho đồng bộ */}
                <button className="action edit" onClick={() => handleEdit(o)}>✏️</button>
                <button className="action delete" onClick={() => handleDelete(o.id)}>🗑️</button>
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