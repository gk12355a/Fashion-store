import React from "react";


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
    <div className={overlayClass}>
      <div className={modalClass}>
        <h2 className={titleClass}>
          {editing ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
        </h2>
        
        <div className={formClass}>
          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="cust-name">Tên khách hàng</label>
            <input
              id="cust-name"
              className={baseInputClass}
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="VD: Nguyễn Văn A"
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="cust-phone">Số điện thoại</label>
            <input
              id="cust-phone"
              className={baseInputClass}
              name="phone"
              value={formData.phone}
              onChange={onChange}
              placeholder="VD: 0901234567"
            />
            {errors.phone && <p className={errorClass}>{errors.phone}</p>}
          </div>

          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="cust-email">Email</label>
            <input
              id="cust-email"
              className={baseInputClass}
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="VD: a@gmail.com"
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>

          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="cust-membership">Loại thành viên</label>
            <select
              id="cust-membership"
              className={baseInputClass} // Dùng chung style với input
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
              <p className={errorClass}>{errors.membership}</p>
            )}
          </div>

          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="cust-points">Điểm thưởng</label>
            <input
              id="cust-points"
              type="number"
              className={baseInputClass}
              name="points"
              value={formData.points}
              onChange={onChange}
              placeholder="VD: 500"
            />
            {errors.points && <p className={errorClass}>{errors.points}</p>}
          </div>

          <div className={buttonGroupClass}>
            <button className={saveButtonClass} onClick={onSave}>Lưu</button>
            <button className={cancelButtonClass} onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}