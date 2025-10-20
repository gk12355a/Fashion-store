import React from "react";
import "../Form.css";


export default function PromotionForm({ show, formData, errors, onChange, onSave, onCancel, editing }) {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editing ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}</h3>
        <div className="form">
          <label>Tên KM</label>
          <input name="name" value={formData.name} onChange={onChange} placeholder="VD: KM1" />
          {errors.name && <p className="error-text">{errors.name}</p>}

          <label>Loại</label>
          <input name="type" value={formData.type} onChange={onChange} placeholder="VD: Giảm giá trực tiếp" />
          {errors.type && <p className="error-text">{errors.type}</p>}

          <label>Giảm giá</label>
          <input type="number" name="discount" value={formData.discount} onChange={onChange} />
          {errors.discount && <p className="error-text">{errors.discount}</p>}

          <label>Thời hạn</label>
          <input type="date" name="expiry" value={formData.expiry} onChange={onChange} />
          {errors.expiry && <p className="error-text">{errors.expiry}</p>}

          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>Lưu</button>
            <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
