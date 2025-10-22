import React from "react";
import "../Table.css"; // Dùng CSS chung

// Hàm format ngày giờ
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "";
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch (e) { return dateTimeString; }
}

// 1. Xóa props sort
export default function PaymentTable({ payments, handleEdit, handleDelete }) {
  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Mã đơn</th>
          <th>Phương thức</th>
          {/* 2. Xóa class/onClick */}
          <th>Số tiền (VNĐ)</th>
          {/* 3. Xóa class/onClick */}
          <th>Ngày TT</th>
          <th>Nhân viên TT</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {payments.length > 0 ? (
          payments.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.orderId}</td>
              <td>{p.paymentMethod}</td>
              <td>{p.amount.toLocaleString('vi-VN')}</td>
              <td>{formatDateTime(p.paymentDate)}</td>
              <td>{p.staff?.name || 'N/A'}</td> {/* Hiển thị tên NV */}
              <td>
                {/* 4. Đồng bộ class nút */}
                <button className="action edit" onClick={() => handleEdit(p)}>✏️</button>
                <button className="action delete" onClick={() => handleDelete(p.id)}>🗑️</button>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan="7">Không tìm thấy thanh toán</td></tr>
        )}
      </tbody>
    </table>
  );
}