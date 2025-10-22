import React from "react";
import "../Table.css";

// 1. Xóa props sort
export default function StaffTable({ staffs, handleEdit, handleDelete }) {
  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          {/* 2. Xóa class/onClick */}
          <th>Tên</th>
          <th>Chức vụ</th>
          {/* 3. Xóa class/onClick */}
          <th>Lương (VNĐ)</th>
          {/* 4. Xóa class/onClick */}
          <th>Ca làm việc</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {staffs.length > 0 ? (
          staffs.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td style={{ textAlign: "left", paddingLeft: "10px" }}>{s.name}</td>
              <td>{s.position}</td>
              <td>{s.salary.toLocaleString('vi-VN')}</td>
              <td>{s.workShift}</td>
              <td>
                {/* 5. Đồng bộ class nút */}
                <button className="action edit" onClick={() => handleEdit(s)}>✏️</button>
                <button className="action delete" onClick={() => handleDelete(s.id)}>🗑️</button>
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