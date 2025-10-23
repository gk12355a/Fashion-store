import React from "react";
import "../Form.css";

// 1. Định nghĩa các loại thành viên
const membershipTypes = ["Thường", "Bạc", "Vàng", "Kim Cương"];

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
        {/* 2. Sửa h3 thành h2 cho đồng bộ CSS */}
        <h2>{editing ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}</h2>
        
        <div className="form">
          {/* 3. Thêm class 'form-group' cho đồng bộ CSS */}
          <div className="form-group">
            <label>Tên khách hàng</label>
            <input
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="VD: Nguyễn Văn A"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={onChange}
              placeholder="VD: 0901234567"
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="VD: a@gmail.com"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* 4. THAY THẾ INPUT BẰNG SELECT */}
          <div className="form-group">
            <label>Loại thành viên</label>
            <select
              name="membership"
              value={formData.membership}
              onChange={onChange}
            >
              <option value="">-- Chọn loại thành viên --</option>
              {membershipTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.membership && (
              <p className="error-text">{errors.membership}</p>
            )}
          </div>

          <div className="form-group">
            <label>Điểm thưởng</label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={onChange}
              placeholder="VD: 500"
            />
            {errors.points && <p className="error-text">{errors.points}</p>}
          </div>

          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>Lưu</button>
            <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}