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

const promotionTypes = ["PERCENTAGE", "FIXED_AMOUNT"];

export default function PromotionForm({ show, formData, errors, onChange, onSave, onCancel, editing }) {
  if (!show) return null;

  let discountPlaceholder = "Nhập giá trị";
  let discountMin = 0;
  let discountMax = undefined; 
  if (formData.type === "PERCENTAGE") {
    discountPlaceholder = "Nhập % (0-100)";
    discountMax = 100;
  } else if (formData.type === "FIXED_AMOUNT") {
    discountPlaceholder = "Nhập số tiền (VNĐ, > 0)";
    discountMin = 0.01;
  }

  return (
    <div className={overlayClass}>
      <div className={modalClass}>
        <h2 className={titleClass}>{editing ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}</h2>
        <div className={formClass}>
          {/* ----- TÊN KM ----- */}
          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="promo-name">Tên KM (*)</label>
            <input 
              id="promo-name" 
              name="name" 
              value={formData.name} 
              onChange={onChange} 
              placeholder="VD: Giảm giá mùa hè, Freeship đơn > 500k" 
              className={baseInputClass}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          {/* ----- LOẠI (SELECT BOX) ----- */}
          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="promo-type">Loại (*)</label>
            <select 
              id="promo-type" 
              name="type" 
              value={formData.type} 
              onChange={onChange}
              className={baseInputClass} // Dùng chung style
            >
              <option value="">-- Chọn loại giảm giá --</option>
              {promotionTypes.map(type => (
                <option key={type} value={type}>{type === 'PERCENTAGE' ? 'Giảm theo %' : 'Giảm số tiền cố định'}</option>
              ))}
            </select>
            {errors.type && <p className={errorClass}>{errors.type}</p>}
          </div>

          {/* ----- GIÁ TRỊ GIẢM GIÁ ----- */}
          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="promo-discountValue">Giá trị Giảm giá (*)</label>
            <input
              id="promo-discountValue"
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={onChange}
              placeholder={discountPlaceholder}
              min={discountMin}
              max={discountMax}
              step={formData.type === "FIXED_AMOUNT" ? "1000" : "1"}
              className={baseInputClass}
            />
            {errors.discountValue && <p className={errorClass}>{errors.discountValue}</p>}
          </div>

          {/* ----- THỜI HẠN ----- */}
          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="promo-expiryDate">Thời hạn (*)</label>
            <input
              id="promo-expiryDate"
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={onChange}
              min={new Date().toISOString().split("T")[0]}
              className={baseInputClass}
            />
            {errors.expiryDate && <p className={errorClass}>{errors.expiryDate}</p>}
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