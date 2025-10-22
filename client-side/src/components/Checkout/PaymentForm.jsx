import React from "react";
import "../Form.css"; // Dùng CSS chung
import ReusableSearch from "../Common/ReusableSearch"; // Import ReusableSearch

const paymentMethods = ["Tiền mặt", "Chuyển khoản", "Thẻ tín dụng", "Momo", "ZaloPay", "VNPay"];

export default function PaymentForm({
  show,
  formData,
  errors,
  onChange,
  onSave,
  onCancel,
  editing,
}) {
  if (!show) return null;

  // Format ngày giờ để hiển thị (chỉ dùng khi editing)
  const formatDateTimeLocal = (dateTimeString) => {
    return dateTimeString ? String(dateTimeString).slice(0, 16) : "";
  };

  // --- Hàm xử lý khi chọn Nhân viên ---
  const handleStaffSelect = (staff) => {
    onChange({
      target: {
        name: 'staffId',
        value: staff ? staff.id : '' // Vẫn lấy ID như cũ
      }
    });
  };
  // ------------------------------------------

  // --- HÀM MỚI: Tùy chỉnh cách hiển thị gợi ý Nhân viên ---
  const renderStaffSuggestion = (staff) => {
    // Trả về JSX hiển thị "Tên (ID: X)"
    return (
      <>
        {staff.name} <span style={{ color: '#888', marginLeft: '5px' }}>(ID: {staff.id})</span>
      </>
    );
  };
  // --------------------------------------------------------

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editing ? "Chỉnh sửa thanh toán" : "Thêm thanh toán mới"}</h2>
        <div className="form">

          {/* ----- MÃ ĐƠN HÀNG ----- */}
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
          {editing && (
             <div className="form-group">
               <label>Mã đơn hàng</label>
               <input type="text" value={String(formData.orderId || '')} disabled />
             </div>
          )}

          {/* ----- PHƯƠNG THỨC THANH TOÁN ----- */}
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

          {/* ----- CHỌN NHÂN VIÊN (Autocomplete - Đã cập nhật) ----- */}
          {!editing && (
            <div className="form-group">
              <label>Nhân viên thực hiện (*)</label>
              <ReusableSearch
                searchApiUrl="/staffs/search" // Vẫn dùng API search
                placeholder="Tìm nhân viên theo tên..."
                onSelect={handleStaffSelect}
                displayField="name" // Vẫn hiển thị tên trong input sau khi chọn
                paramName="keyword" // Giữ nguyên paramName="keyword"
                // --- THÊM PROP NÀY ---
                renderSuggestion={renderStaffSuggestion} // Truyền hàm tùy chỉnh hiển thị
                // ---------------------
              />
              {formData.staffId && (
                <p style={{ fontSize: '13px', color: '#555', marginTop: '5px' }}>
                  Mã NV đã chọn: {formData.staffId}
                </p>
              )}
              {errors.staffId && <p className="error-text">{errors.staffId}</p>}
            </div>
          )}

          {/* ----- HIỂN THỊ THÔNG TIN KHI SỬA ----- */}
          {editing && (
            <>
              <div className="form-group">
                <label>Số tiền</label>
                <input
                  type="text"
                  value={formData.displayAmount != null ? `${Number(formData.displayAmount).toLocaleString('vi-VN')} đ` : ''}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Ngày thanh toán</label>
                <input
                  type="datetime-local"
                  value={formatDateTimeLocal(formData.displayPaymentDate)}
                  disabled
                />
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