import React from "react";
import "../Table.css";

// Hàm format ngày giờ (ví dụ)
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "";
  try {
    const date = new Date(dateTimeString);
    // Lấy ngày/tháng/năm giờ:phút
    return date.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch (e) {
    return dateTimeString;
  }
}

export default function PaymentTable({ payments, handleSort, sortField, sortOrder, handleEdit, handleDelete }) {
  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Mã đơn</th>
          <th>Phương thức</th>
          <th
            // Sửa sort field
            className={`sortable ${sortField === "amount" ? sortOrder : ""}`}
            onClick={() => handleSort("amount")}
          >
            Số tiền (VNĐ)
          </th>
          <th
            // Sửa sort field
            className={`sortable ${sortField === "paymentDate" ? sortOrder : ""}`}
            onClick={() => handleSort("paymentDate")}
          >
            Ngày TT
          </th>
          <th>Nhân viên TT</th> {/* Thêm cột Nhân viên */}
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {payments.length > 0 ? (
          payments.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              {/* Sửa hiển thị */}
              <td>{p.orderId}</td>
              <td>{p.paymentMethod}</td>
              <td>{p.amount.toLocaleString()}</td>
              <td>{formatDateTime(p.paymentDate)}</td>
              {/* Hiển thị tên nhân viên (nếu API trả về) */}
              <td>{p.staff?.name || 'N/A'}</td>
              {/* ------------ */}
              <td>
                <button className="edit-btn" onClick={() => handleEdit(p)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>🗑️</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7">Không tìm thấy thanh toán</td> {/* Tăng colSpan */}
          </tr>
        )}
      </tbody>
    </table>
  );
}