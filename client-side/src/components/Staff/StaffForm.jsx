import React from "react";
import "../Form.css";

export default function StaffForm({ show, formData, errors, onChange, onSave, onCancel, editing }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editing ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</h3>
        <div className="form">
          <label>Tên nhân viên</label>
          <input name="name" value={formData.name} onChange={onChange} placeholder="VD: Nguyễn Văn A" />
          {errors.name && <p className="error-text">{errors.name}</p>}

          <label>Chức vụ</label>
          <input name="position" value={formData.position} onChange={onChange} placeholder="VD: Bán hàng" />
          {errors.position && <p className="error-text">{errors.position}</p>}

          <label>Lương</label>
          <input type="number" name="salary" value={formData.salary} onChange={onChange} placeholder="VD: 8000000" />
          {errors.salary && <p className="error-text">{errors.salary}</p>}

          <label>Ca làm việc</label>
          <select name="shift" value={formData.shift} onChange={onChange}>
            <option value="">-- Chọn ca làm việc --</option>
            <option value="Ca sáng">Ca sáng</option>
            <option value="Ca chiều">Ca chiều</option>
            <option value="Ca tối">Ca tối</option>
            <option value="Hành chính">Hành chính</option>
          </select>
          {errors.shift && <p className="error-text">{errors.shift}</p>}

          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>Lưu</button>
            <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
