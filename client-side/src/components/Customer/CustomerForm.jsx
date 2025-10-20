import React from "react";
import "../Form.css";

export default function CustomerForm({
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
        <h3>{editing ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}</h3>
        <div className="form">
          <label>Tên khách hàng</label>
          <input
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="VD: Nguyễn Văn A"
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          <label>Số điện thoại</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={onChange}
            placeholder="VD: 0901234567"
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}

          <label>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="VD: a@gmail.com"
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <label>Loại thành viên</label>
          <input
            name="membership"
            value={formData.membership}
            onChange={onChange}
            placeholder="VD: Vàng, Bạc, Thường..."
          />
          {errors.membership && (
            <p className="error-text">{errors.membership}</p>
          )}

          <label>Điểm thưởng</label>
          <input
            type="number"
            name="points"
            value={formData.points}
            onChange={onChange}
            placeholder="VD: 500"
          />
          {errors.points && <p className="error-text">{errors.points}</p>}

          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>Lưu</button>
            <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}

