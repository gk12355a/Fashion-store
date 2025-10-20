import React from "react";
import "../Table.css";

export default function OrderList({ orders, handleSort, sortField, sortOrder, handleEdit, handleDelete }) {
  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Mã KH</th>
          <th className={`sortable ${sortField === "date" ? sortOrder : ""}`} onClick={() => handleSort("date")}>Ngày</th>
          <th>Trạng thái</th>
          <th className={`sortable ${sortField === "total" ? sortOrder : ""}`} onClick={() => handleSort("total")}>Tổng tiền (VNĐ)</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customerId}</td>
              <td>{o.date}</td>
              <td>{o.status}</td>
              <td>{o.total.toLocaleString()}</td>
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
