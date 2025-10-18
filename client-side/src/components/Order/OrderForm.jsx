import React from "react";
import "../Form.css";

export default function OrderForm({ show, formData, errors, onChange, onSave, onCancel, editing }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editing ? "Chỉnh sửa đơn hàng" : "Thêm đơn hàng mới"}</h3>
        <div className="form">
          <label>Mã khách hàng</label>
          <input name="customerId" value={formData.customerId} onChange={onChange} placeholder="VD: KH001" />
          {errors.customerId && <p className="error-text">{errors.customerId}</p>}

          <label>Ngày đặt</label>
          <input type="date" name="date" value={formData.date} onChange={onChange} />
          {errors.date && <p className="error-text">{errors.date}</p>}

          <label>Trạng thái</label>
          <input name="status" value={formData.status} onChange={onChange} placeholder="VD: Hoàn thành" />
          {errors.status && <p className="error-text">{errors.status}</p>}

          <label>Tổng tiền (VNĐ)</label>
          <input type="number" name="total" value={formData.total} onChange={onChange} placeholder="VD: 1500000" />
          {errors.total && <p className="error-text">{errors.total}</p>}

          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>Lưu</button>
            <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
