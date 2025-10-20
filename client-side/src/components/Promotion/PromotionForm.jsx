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
          <input name="name" value={formData.name} onChange={onChange} placeholder="VD: Giảm 10% hè" />
          {errors.name && <p className="error-text">{errors.name}</p>}

          <label>Loại</label>
          {/* Cân nhắc dùng select nếu Loại có giới hạn */}
          <input name="type" value={formData.type} onChange={onChange} placeholder="VD: PERCENTAGE, FIXED_AMOUNT" />
          {errors.type && <p className="error-text">{errors.type}</p>}

          <label>Giá trị Giảm giá</label>
          {/* Sửa name */}
          <input type="number" name="discountValue" value={formData.discountValue} onChange={onChange} placeholder="VD: 10 (cho %) hoặc 50000 (cho VNĐ)"/>
          {/* Sửa errors */}
          {errors.discountValue && <p className="error-text">{errors.discountValue}</p>}

          <label>Thời hạn (YYYY-MM-DD)</label>
          {/* Sửa name */}
          <input type="date" name="expiryDate" value={formData.expiryDate} onChange={onChange} />
          {/* Sửa errors */}
          {errors.expiryDate && <p className="error-text">{errors.expiryDate}</p>}

          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>Lưu</button>
            <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}