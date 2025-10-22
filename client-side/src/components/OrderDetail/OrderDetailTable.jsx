import React from "react";
import "../Table.css";

export default function OrderDetailTable({ orderDetails, handleSort, sortField, sortOrder, handleEdit, handleDelete }) {
  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Mã đơn</th>
          <th
            className={`sortable ${sortField === "productId" ? sortOrder : ""}`}
            onClick={() => handleSort("productId")}
          >
            Mã SP
          </th>
          <th>Số lượng</th>
          <th
            className={`sortable ${sortField === "unitPrice" ? sortOrder : ""}`}
            onClick={() => handleSort("unitPrice")}
          >
            Đơn giá
          </th>
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
                <button className="edit-btn" onClick={() => handleEdit(d)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(d.id)}>🗑️</button>
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
