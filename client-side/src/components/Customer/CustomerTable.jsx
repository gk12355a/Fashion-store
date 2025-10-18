import React from "react";
import "../Table.css";

export default function CustomerTable({
  customers,
  handleSort,
  sortField,
  sortOrder,
  handleEdit,
  handleDelete,
}) {
  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          <th
            className={`sortable ${sortField === "name" ? sortOrder : ""}`}
            onClick={() => handleSort("name")}
          >
            Tên khách hàng
          </th>
          <th>SĐT</th>
          <th>Email</th>
          <th>Loại thành viên</th>
          <th
            className={`sortable ${sortField === "points" ? sortOrder : ""}`}
            onClick={() => handleSort("points")}
          >
            Điểm thưởng
          </th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {customers.length > 0 ? (
          customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
              <td>{c.type}</td>
              <td>{c.points}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(c)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(c.id)}>🗑️</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7">Không tìm thấy khách hàng</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
