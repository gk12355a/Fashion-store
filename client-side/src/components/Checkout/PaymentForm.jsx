import React from "react";
import "../Form.css"; // Dùng CSS chung

// Danh sách gợi ý phương thức thanh toán
const paymentMethods = ["Tiền mặt", "Chuyển khoản", "Thẻ tín dụng", "Momo", "ZaloPay", "VNPay"];

export default function PaymentForm({
  show,
  formData,
  errors,
  onChange,
  onSave,
  onCancel,
  editing, // True nếu đang sửa, False nếu đang thêm mới
}) {
  if (!show) return null;

  // Format ngày giờ để hiển thị (chỉ dùng khi editing)
  const formatDateTimeLocal = (dateTimeString) => {
    return dateTimeString ? dateTimeString.slice(0, 16) : "";
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Sửa h3 -> h2 */}
        <h2>{editing ? "Chỉnh sửa thanh toán" : "Thêm thanh toán mới"}</h2>
        <div className="form">

          {/* ----- MÃ ĐƠN HÀNG ----- */}
          {/* Chỉ hiển thị/nhập khi Thêm mới */}
          {!editing && (
            <div className="form-group">
              <label htmlFor="payment-orderId">Mã đơn hàng (*)</label>
              <input
                id="payment-orderId"
                name="orderId"
                value={formData.orderId}
                onChange={onChange}
                placeholder="Nhập mã đơn hàng cần thanh toán"
                type="number"
                min="1"
              />
              {errors.orderId && <p className="error-text">{errors.orderId}</p>}
            </div>
          )}
          {/* Hiển thị Mã đơn khi Sửa (không cho đổi) */}
          {editing && (
             <div className="form-group">
               <label>Mã đơn hàng</label>
               <input type="text" value={formData.orderId} disabled />
             </div>
          )}


          {/* ----- PHƯƠNG THỨC THANH TOÁN ----- */}
          {/* Dùng select box cho tiện */}
          <div className="form-group">
            <label htmlFor="payment-method">Phương thức (*)</label>
            <select
                id="payment-method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={onChange}
            >
                <option value="">-- Chọn phương thức --</option>
                {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                ))}
            </select>
            {errors.paymentMethod && <p className="error-text">{errors.paymentMethod}</p>}
          </div>

          {/* ----- MÃ NHÂN VIÊN ----- */}
          {/* Chỉ hiển thị/nhập khi Thêm mới */}
          {!editing && (
            <div className="form-group">
              <label htmlFor="payment-staffId">Mã nhân viên thực hiện (*)</label>
              <input
                id="payment-staffId"
                name="staffId"
                value={formData.staffId}
                onChange={onChange}
                placeholder="Nhập mã nhân viên"
                type="number"
                min="1"
              />
              {errors.staffId && <p className="error-text">{errors.staffId}</p>}
            </div>
          )}

          {/* ----- HIỂN THỊ THÔNG TIN KHI SỬA ----- */}
          {/* Số tiền và Ngày TT là do backend tự động tính/lưu, chỉ hiển thị */}
          {editing && (
            <>
              <div className="form-group">
                <label>Số tiền</label>
                <input type="text" value={formData.displayAmount?.toLocaleString('vi-VN') + ' đ' || ''} disabled />
              </div>
              <div className="form-group">
                <label>Ngày thanh toán</label>
                <input type="datetime-local" value={formatDateTimeLocal(formData.displayPaymentDate) || ''} disabled />
              </div>
            </>
          )}

          {/* ----- NÚT BẤM ----- */}
          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>Lưu</button>
            <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
} 