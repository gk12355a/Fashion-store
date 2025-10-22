import React from "react";
import "../Form.css";

export default function OrderDetailForm({ show, formData, errors, onChange, onSave, onCancel, editing }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editing ? "Chỉnh sửa chi tiết đơn" : "Thêm chi tiết đơn mới"}</h3>
        <div className="form">
          <label>Mã đơn</label>
          <input
            name="orderId"
            value={formData.orderId}
            onChange={onChange}
            placeholder="VD: 1"
            type="number"
          />
          {errors.orderId && <p className="error-text">{errors.orderId}</p>}

          <label>Mã sản phẩm</label>
          <input
            name="productId"
            value={formData.productId}
            onChange={onChange}
            placeholder="VD: 101"
            type="number"
          />
          {errors.productId && <p className="error-text">{errors.productId}</p>}

          <label>Số lượng</label>
          <input
            name="quantity"
            value={formData.quantity}
            onChange={onChange}
            placeholder="VD: 2"
            type="number"
          />
          {errors.quantity && <p className="error-text">{errors.quantity}</p>}

          <label>Đơn giá</label>
          <input
            name="unitPrice"
            value={formData.unitPrice}
            onChange={onChange}
            placeholder="VD: 150000"
            type="number"
          />
          {errors.unitPrice && <p className="error-text">{errors.unitPrice}</p>}

          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>Lưu</button>
            <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
