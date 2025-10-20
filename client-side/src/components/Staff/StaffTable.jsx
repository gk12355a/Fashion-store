import React from "react";
import "../Table.css";

export default function StaffTable({ staffs, handleSort, sortField, sortOrder, handleEdit, handleDelete }) {
  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          <th
            className={`sortable ${sortField === "name" ? sortOrder : ""}`}
            onClick={() => handleSort("name")}
          >
            Tên
          </th>
          <th>Chức vụ</th>
          <th
            className={`sortable ${sortField === "salary" ? sortOrder : ""}`}
            onClick={() => handleSort("salary")}
          >
            Lương (VNĐ)
          </th>
          {/* Sửa sort field */}
          <th
             className={`sortable ${sortField === "workShift" ? sortOrder : ""}`}
             onClick={() => handleSort("workShift")}
          >
            Ca làm việc
          </th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {staffs.length > 0 ? (
          staffs.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.position}</td>
              <td>{s.salary.toLocaleString()}</td>
              {/* Sửa hiển thị */}
              <td>{s.workShift}</td>
              {/* ------------ */}
              <td>
                <button className="edit-btn" onClick={() => handleEdit(s)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(s.id)}>🗑️</button>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan="6">Không tìm thấy nhân viên</td></tr>
        )}
      </tbody>
    </table>
  );
}