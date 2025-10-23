import React from "react";
import "../Form.css";

// 1. Định nghĩa các chức vụ
const staffPositions = [
  "Quản lý",
  "Nhân viên Bán hàng",
  "Thu ngân",
  "Nhân viên Kho",
  "Bảo vệ",
  "Marketing",
  "Chăm sóc Khách hàng",
];

export default function StaffForm({ show, formData, errors, onChange, onSave, onCancel, editing }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editing ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</h2>
        <div className="form">
          {/* ----- TÊN NHÂN VIÊN ----- */}
          <div className="form-group">
            <label htmlFor="staff-name">Tên nhân viên (*)</label>
            <input
              id="staff-name"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="VD: Nguyễn Văn A"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* ----- CHỨC VỤ (SELECT BOX) ----- */}
          <div className="form-group">
            <label htmlFor="staff-position">Chức vụ (*)</label>
            {/* 2. Thay thế input bằng select */}
            <select
              id="staff-position"
              name="position"
              value={formData.position}
              onChange={onChange}
            >
              <option value="">-- Chọn chức vụ --</option>
              {staffPositions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
            {errors.position && <p className="error-text">{errors.position}</p>}
          </div>

          {/* ----- LƯƠNG ----- */}
          <div className="form-group">
             <label htmlFor="staff-salary">Lương (VNĐ *)</label>
             <input
               id="staff-salary"
               type="number"
               name="salary"
               value={formData.salary}
               onChange={onChange}
               placeholder="VD: 8000000"
               min="0"
             />
             {errors.salary && <p className="error-text">{errors.salary}</p>}
          </div>

          {/* ----- CA LÀM VIỆC ----- */}
          <div className="form-group">
             <label htmlFor="staff-workShift">Ca làm việc (*)</label>
             <select
               id="staff-workShift"
               name="workShift"
               value={formData.workShift}
               onChange={onChange}
             >
               <option value="">-- Chọn ca làm việc --</option>
               <option value="Ca sáng">Ca sáng</option>
               <option value="Ca chiều">Ca chiều</option>
               <option value="Ca tối">Ca tối</option>
               <option value="Hành chính">Hành chính</option>
             </select>
             {errors.workShift && <p className="error-text">{errors.workShift}</p>}
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