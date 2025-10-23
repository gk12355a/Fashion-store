import React from "react";
// import "../Form.css"; // <- ĐÃ XÓA

// --- Định nghĩa lớp Tailwind Base (Dịch từ Form.css) ---
const overlayClass = "fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm";
const modalClass = "bg-white p-6 md:p-9 rounded-2xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto shadow-xl border-2 border-[#ffd1dc] font-poppins relative animate-modal-appear";
const titleClass = "font-playfair text-2xl md:text-3xl text-gray-800 mb-6 text-center border-b-2 border-cyan-300 pb-4";
const formClass = "flex flex-col gap-5";
const formGroupClass = "flex flex-col gap-2";
const labelClass = "font-semibold text-gray-800 text-base mb-1";
const baseInputClass = "py-3 px-4 border-2 border-gray-200 rounded-xl text-base font-poppins transition-all duration-300 ease-in-out bg-gray-50 focus:outline-none focus:border-cyan-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(156,234,225,0.1)] focus:-translate-y-px hover:border-cyan-300 hover:bg-white";
const errorClass = "text-red-600 text-sm -mt-1 mb-1 font-medium flex items-center gap-1.5 before:content-['⚠️'] before:text-xs";
const buttonGroupClass = "flex flex-col md:flex-row justify-between gap-4 mt-6 pt-5 border-t border-gray-200";
const baseButtonClass = "py-3 px-6 border-none rounded-xl cursor-pointer text-base font-semibold font-poppins transition-all duration-300 ease-in-out flex-1";
const saveButtonClass = `${baseButtonClass} bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-600/30 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-600/40 active:translate-y-0`;
const cancelButtonClass = `${baseButtonClass} bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30 hover:bg-gradient-to-r hover:from-pink-600 hover:to-red-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/40 active:translate-y-0`;
// -----------------------------------------------------

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
    <div className={overlayClass}>
      <div className={modalClass}>
        <h2 className={titleClass}>{editing ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</h2>
        <div className={formClass}>
          {/* ----- TÊN NHÂN VIÊN ----- */}
          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="staff-name">Tên nhân viên (*)</label>
            <input
              id="staff-name"
              className={baseInputClass}
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="VD: Nguyễn Văn A"
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          {/* ----- CHỨC VỤ (SELECT BOX) ----- */}
          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="staff-position">Chức vụ (*)</label>
            <select
              id="staff-position"
              className={baseInputClass} // Dùng chung style
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
            {errors.position && <p className={errorClass}>{errors.position}</p>}
          </div>

          {/* ----- LƯƠNG ----- */}
          <div className={formGroupClass}>
             <label className={labelClass} htmlFor="staff-salary">Lương (VNĐ *)</label>
             <input
               id="staff-salary"
               type="number"
               className={baseInputClass}
               name="salary"
               value={formData.salary}
               onChange={onChange}
               placeholder="VD: 8000000"
               min="0"
             />
             {errors.salary && <p className={errorClass}>{errors.salary}</p>}
          </div>

          {/* ----- CA LÀM VIỆC ----- */}
          <div className={formGroupClass}>
             <label className={labelClass} htmlFor="staff-workShift">Ca làm việc (*)</label>
             <select
               id="staff-workShift"
               className={baseInputClass} // Dùng chung style
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
             {errors.workShift && <p className={errorClass}>{errors.workShift}</p>}
          </div>

          {/* ----- NÚT BẤM ----- */}
          <div className={buttonGroupClass}>
            <button className={saveButtonClass} onClick={onSave}>Lưu</button>
            <button className={cancelButtonClass} onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}