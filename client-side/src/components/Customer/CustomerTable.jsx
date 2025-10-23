import React from "react";
import "../Table.css";

// 1. Xóa props: handleSort, sortField, sortOrder
export default function CustomerTable({ customers, handleEdit, handleDelete }) {
  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          {/* 2. Xóa class và onClick */}
          <th
          // className={`sortable ${sortField === "name" ? sortOrder : ""}`}
          // onClick={() => handleSort("name")}
          >
            Tên khách hàng
          </th>
          <th>SĐT</th>
          <th>Email</th>
          <th>Loại thành viên</th>
          {/* 3. Xóa class và onClick */}
          <th>Điểm thưởng</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {customers.length > 0 ? (
          customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td style={{ textAlign: "left", paddingLeft: "10px" }}>
                {c.name}
              </td>
              <td>{c.phoneNumber}</td>
              <td>{c.email}</td>
              <td>{c.membershipType}</td>
              <td>{c.rewardPoints}</td>
              <td>
                {/* 4. Sửa class nút cho đồng bộ (dùng className của Product) */}
                <button className="edit-btn" onClick={() => handleEdit(c)}>
                  ✏️
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(c.id)}
                >
                  🗑️
                </button>
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
