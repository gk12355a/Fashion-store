import React from "react";
import "../Table.css";

// 1. Xóa props sort
export default function OrderDetailTable({ orderDetails, handleEdit, handleDelete }) {
  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Mã đơn</th>
          {/* 2. Xóa class và onClick */}
          <th>Mã SP</th>
          <th>Số lượng</th>
          {/* 3. Xóa class và onClick */}
          <th>Đơn giá</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {orderDetails.length > 0 ? (
          orderDetails.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.orderId}</td>
              <td>{d.productId}</td>
              <td>{d.quantity}</td>
              <td>{d.unitPrice.toLocaleString()} đ</td>
              <td>
                {/* 4. Sửa class nút cho đồng bộ */}
                <button className="action edit" onClick={() => handleEdit(d)}>✏️</button>
                <button className="action delete" onClick={() => handleDelete(d.id)}>🗑️</button>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan="6">Không có chi tiết đơn nào</td></tr>
        )}
      </tbody>
    </table>
  );
}