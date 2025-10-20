import React from "react";
import "../Table.css";

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
          <th className={`sortable ${sortField === "discount" ? sortOrder : ""}`} onClick={() => handleSort("discount")}>
            Giảm giá
          </th>
          <th>Thời hạn</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {promotions.length > 0 ? promotions.map(p => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.type}</td>
            <td>{p.discount.toLocaleString()}</td>
            <td>{p.expiry}</td>
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
