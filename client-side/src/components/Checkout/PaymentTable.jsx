import React from "react";
import "../Table.css";

export default function PaymentTable({ payments, handleSort, sortField, sortOrder, handleEdit, handleDelete }) {
  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Mã đơn</th>
          <th>Phương thức</th>
          <th
            className={`sortable ${sortField === "amount" ? sortOrder : ""}`}
            onClick={() => handleSort("amount")}
          >
            Số tiền
          </th>
          <th
            className={`sortable ${sortField === "date" ? sortOrder : ""}`}
            onClick={() => handleSort("date")}
          >
            Ngày TT
          </th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {payments.length > 0 ? (
          payments.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.orderCode}</td>
              <td>{p.method}</td>
              <td>{p.amount.toLocaleString()} đ</td>
              <td>{p.date}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(p)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>🗑️</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6">Không tìm thấy thanh toán</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}