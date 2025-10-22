import React from "react";
import "../Form.css";

// Các loại khuyến mãi cố định
const promotionTypes = ["PERCENTAGE", "FIXED_AMOUNT"];

export default function PromotionForm({ show, formData, errors, onChange, onSave, onCancel, editing }) {
  if (!show) return null;

  // Xác định placeholder và min/max cho Giá trị Giảm giá
  let discountPlaceholder = "Nhập giá trị";
  let discountMin = 0;
  let discountMax = undefined; // Không giới hạn max mặc định
  if (formData.type === "PERCENTAGE") {
    discountPlaceholder = "Nhập % (0-100)";
    discountMax = 100;
  } else if (formData.type === "FIXED_AMOUNT") {
    discountPlaceholder = "Nhập số tiền (VNĐ, > 0)";
    discountMin = 0.01; // Phải lớn hơn 0
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Sửa h3 -> h2 */}
        <h2>{editing ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}</h2>
        <div className="form">
          {/* ----- TÊN KM ----- */}
          <div className="form-group">
            <label htmlFor="promo-name">Tên KM (*)</label>
            <input id="promo-name" name="name" value={formData.name} onChange={onChange} placeholder="VD: Giảm giá mùa hè, Freeship đơn > 500k" />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* ----- LOẠI (SELECT BOX) ----- */}
          <div className="form-group">
            <label htmlFor="promo-type">Loại (*)</label>
            <select id="promo-type" name="type" value={formData.type} onChange={onChange}>
              <option value="">-- Chọn loại giảm giá --</option>
              {promotionTypes.map(type => (
                <option key={type} value={type}>{type === 'PERCENTAGE' ? 'Giảm theo %' : 'Giảm số tiền cố định'}</option>
              ))}
            </select>
            {errors.type && <p className="error-text">{errors.type}</p>}
          </div>

          {/* ----- GIÁ TRỊ GIẢM GIÁ ----- */}
          <div className="form-group">
            <label htmlFor="promo-discountValue">Giá trị Giảm giá (*)</label>
            <input
              id="promo-discountValue"
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={onChange}
              placeholder={discountPlaceholder} // Placeholder động
              min={discountMin} // Min động
              max={discountMax} // Max động (chỉ áp dụng cho %)
              step={formData.type === "FIXED_AMOUNT" ? "1000" : "1"} // Bước nhảy
            />
            {errors.discountValue && <p className="error-text">{errors.discountValue}</p>}
          </div>

          {/* ----- THỜI HẠN ----- */}
          <div className="form-group">
            <label htmlFor="promo-expiryDate">Thời hạn (*)</label>
            <input
              id="promo-expiryDate"
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={onChange}
              min={new Date().toISOString().split("T")[0]} // Ngày nhỏ nhất là hôm nay
            />
            {errors.expiryDate && <p className="error-text">{errors.expiryDate}</p>}
          </div>

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