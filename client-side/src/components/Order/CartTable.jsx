import React from 'react';
import './CartTable.css'; // Sẽ tạo file CSS này ở bước tiếp theo

/**
 * Bảng hiển thị các sản phẩm trong giỏ hàng (bên trong OrderForm Modal)
 * @param {array} items - Danh sách cartItems
 * @param {function} onRemove - Hàm callback khi bấm nút Xóa
 */
export default function CartTable({ items, onRemove }) {
  if (items.length === 0) {
    return (
      <div className="cart-empty">
        Giỏ hàng đang trống. Vui lòng thêm sản phẩm.
      </div>
    );
  }

  return (
    <div className="cart-table-wrapper">
      <table className="cart-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.productId}>
              <td data-label="Sản phẩm">{item.name}</td>
              <td data-label="Đơn giá">{item.unitPrice.toLocaleString()} đ</td>
              <td data-label="Số lượng">{item.quantity}</td>
              <td data-label="Thành tiền" className="cell-total">
                {(item.unitPrice * item.quantity).toLocaleString()} đ
              </td>
              <td data-label="Xóa">
                <button
                  className="cart-remove-btn"
                  onClick={() => onRemove(item.productId)}
                >
                  &times;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}