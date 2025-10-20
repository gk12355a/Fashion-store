import React from "react";
import "../Form.css";

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

  // Format ngày giờ để hiển thị
  const formatDateTimeLocal = (dateTimeString) => {
    if (!dateTimeString) return "";
    try {
        // Cắt chuỗi để lấy phần yyyy-MM-ddTHH:mm
        return dateTimeString.slice(0, 16);
    } catch (e) {
        return "";
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editing ? "Chỉnh sửa phương thức thanh toán" : "Thêm thanh toán mới"}</h3>
        <div className="form">
          <label>Mã đơn hàng</label>
          <input
            name="orderId" // Sửa name
            value={formData.orderId}
            onChange={onChange}
            placeholder="VD: 1"
            type="number" // Đổi type
            disabled={editing} // Không cho sửa khi edit
          />
          {errors.orderId && <p className="error-text">{errors.orderId}</p>}

          <label>Phương thức</label>
          <input
            name="paymentMethod" // Sửa name
            value={formData.paymentMethod}
            onChange={onChange}
            placeholder="VD: Momo, Tiền mặt..."
            // Cho phép sửa cả khi add và edit
          />
          {errors.paymentMethod && <p className="error-text">{errors.paymentMethod}</p>}

          {/* ----- THÊM Ô NHẬP MÃ NHÂN VIÊN (Chỉ khi tạo mới) ----- */}
          {!editing && (
            <>
              <label>Mã nhân viên thực hiện</label>
              <input
                name="staffId"
                value={formData.staffId}
                onChange={onChange}
                placeholder="VD: 2"
                type="number"
              />
              {errors.staffId && <p className="error-text">{errors.staffId}</p>}
            </>
          )}

          {/* ----- HIỂN THỊ SỐ TIỀN & NGÀY TT (Khi sửa) ----- */}
          {editing && (
            <>
              <label>Số tiền (Tự động)</label>
              <input type="text" value={formData.displayAmount?.toLocaleString() + ' đ' || ''} disabled />

              <label>Ngày thanh toán (Tự động)</label>
              <input type="datetime-local" value={formatDateTimeLocal(formData.displayPaymentDate) || ''} disabled />
            </>
          )}

          {/* ----- BỎ Ô NHẬP SỐ TIỀN & NGÀY TT ----- */}
          {/* <label>Số tiền</label>
          <input type="number" name="amount" value={formData.amount} onChange={onChange} disabled={editing}/>
          {errors.amount && <p className="error-text">{errors.amount}</p>}

          <label>Ngày thanh toán</label>
          <input type="date" name="date" value={formData.date} onChange={onChange} disabled={editing}/>
          {errors.date && <p className="error-text">{errors.date}</p>} */}


          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>Lưu</button>
            <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}