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

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editing ? "Chỉnh sửa thanh toán" : "Thêm thanh toán mới"}</h3>
        <div className="form">
          <label>Mã đơn</label>
          <input name="orderCode" value={formData.orderCode} onChange={onChange} placeholder="VD: DH001" />
          {errors.orderCode && <p className="error-text">{errors.orderCode}</p>}

          <label>Phương thức</label>
          <input name="method" value={formData.method} onChange={onChange} placeholder="VD: Momo, Tiền mặt..." />
          {errors.method && <p className="error-text">{errors.method}</p>}

          <label>Số tiền</label>
          <input type="number" name="amount" value={formData.amount} onChange={onChange} placeholder="VD: 500000" />
          {errors.amount && <p className="error-text">{errors.amount}</p>}

          <label>Ngày thanh toán</label>
          <input type="date" name="date" value={formData.date} onChange={onChange} />
          {errors.date && <p className="error-text">{errors.date}</p>}

          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>Lưu</button>
            <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
