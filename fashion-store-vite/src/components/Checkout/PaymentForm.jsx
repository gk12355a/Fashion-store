import React from "react";
// import "../Form.css"; // <- ĐÃ XÓA
import ReusableSearch from "../Common/ReusableSearch"; 

// --- Định nghĩa lớp Tailwind Base ---
const overlayClass = "fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm";
const modalClass = "bg-white p-6 md:p-9 rounded-2xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto shadow-xl border-2 border-[#7B0323] font-['Helvetica_Neue',_'Arial',_sans-serif] relative animate-modal-appear";
const titleClass = "font-['Helvetica_Neue',_'Arial',_sans-serif] text-2xl md:text-3xl font-bold text-[#7B0323] mb-6 text-center border-b-2 border-[#7B0323] pb-4 tracking-wider";
const formClass = "flex flex-col gap-5";
const formGroupClass = "flex flex-col gap-2";
const labelClass = "font-medium text-[#7B0323] text-base mb-1 font-['Helvetica_Neue',_'Arial',_sans-serif]";
const baseInputClass = "py-3 px-4 border-2 border-gray-200 rounded-xl text-base font-['Helvetica_Neue',_'Arial',_sans-serif] transition-all duration-300 ease-in-out bg-gray-50 focus:outline-none focus:border-[#7B0323] focus:bg-white focus:shadow-[0_0_0_3px_rgba(123,3,35,0.1)] focus:-translate-y-px hover:border-[#7B0323] hover:bg-white";
// Thêm style cho input disabled
const disabledInputClass = `${baseInputClass} bg-gray-100 text-gray-500 cursor-not-allowed hover:border-gray-200 hover:bg-gray-100 focus:border-gray-200 focus:shadow-none focus:-translate-y-0`;
const errorClass = "text-red-600 text-sm -mt-1 mb-1 font-medium flex items-center gap-1.5 before:content-['⚠️'] before:text-xs font-['Helvetica_Neue',_'Arial',_sans-serif]";
const buttonGroupClass = "flex flex-col md:flex-row justify-between gap-4 mt-6 pt-5 border-t border-[#7B0323]/20";
const baseButtonClass = "py-3 px-6 border-none rounded-xl cursor-pointer text-base font-medium font-['Helvetica_Neue',_'Arial',_sans-serif] transition-all duration-300 ease-in-out flex-1";
const saveButtonClass = `${baseButtonClass} bg-gradient-to-r from-[#7B0323] to-[#5a0219] text-white shadow-lg shadow-[#7B0323]/30 hover:bg-gradient-to-r hover:from-[#5a0219] hover:to-[#7B0323] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7B0323]/40 active:translate-y-0`;
const cancelButtonClass = `${baseButtonClass} bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-500/40 active:translate-y-0`;
// -----------------------------------------------------

const paymentMethods = ["Tiền mặt", "Chuyển khoản", "Thẻ tín dụng", "Momo", "ZaloPay", "VNPay"];

export default function PaymentForm({
  show,
  formData,
  errors,
  onChange,
  onSave,
  onCancel,
  editing,
}) {
  if (!show) return null;

  const formatDateTimeLocal = (dateTimeString) => {
    return dateTimeString ? String(dateTimeString).slice(0, 16) : "";
  };

  const handleStaffSelect = (staff) => {
    onChange({
      target: {
        name: 'staffId',
        value: staff ? staff.id : ''
      }
    });
  };

  const renderStaffSuggestion = (staff) => {
    return (
      <>
        {staff.name} <span className="text-gray-500 ml-1.5">(ID: {staff.id})</span>
      </>
    );
  };

  return (
    <div className={overlayClass}>
      <div className={modalClass}>
        <h2 className={titleClass}>{editing ? "Chỉnh sửa thanh toán" : "Thêm thanh toán mới"}</h2>
        <div className={formClass}>

          {/* ----- MÃ ĐƠN HÀNG ----- */}
          {!editing && (
            <div className={formGroupClass}>
              <label className={labelClass} htmlFor="payment-orderId">Mã đơn hàng (*)</label>
              <input
                id="payment-orderId"
                name="orderId"
                value={formData.orderId}
                onChange={onChange}
                placeholder="Nhập mã đơn hàng cần thanh toán"
                type="number"
                min="1"
                className={baseInputClass}
              />
              {errors.orderId && <p className={errorClass}>{errors.orderId}</p>}
            </div>
          )}
          {editing && (
             <div className={formGroupClass}>
               <label className={labelClass}>Mã đơn hàng</label>
               <input type="text" value={String(formData.orderId || '')} disabled className={disabledInputClass} />
             </div>
          )}

          {/* ----- PHƯƠNG THỨC THANH TOÁN ----- */}
          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="payment-method">Phương thức (*)</label>
            <select
                id="payment-method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={onChange}
                className={baseInputClass}
            >
                <option value="">-- Chọn phương thức --</option>
                {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                ))}
            </select>
            {errors.paymentMethod && <p className={errorClass}>{errors.paymentMethod}</p>}
          </div>

          {/* ----- CHỌN NHÂN VIÊN (Autocomplete) ----- */}
          {!editing && (
            <div className={formGroupClass}>
              <label className={labelClass}>Nhân viên thực hiện (*)</label>
              <ReusableSearch
                searchApiUrl="/staffs/search"
                placeholder="Tìm nhân viên theo tên..."
                onSelect={handleStaffSelect}
                displayField="name"
                paramName="keyword" 
                renderSuggestion={renderStaffSuggestion}
              />
              {formData.staffId && (
                <p className="text-sm text-gray-600 mt-1.5 font-['Helvetica_Neue',_'Arial',_sans-serif]">
                  Mã NV đã chọn: {formData.staffId}
                </p>
              )}
              {errors.staffId && <p className={errorClass}>{errors.staffId}</p>}
            </div>
          )}

          {/* ----- HIỂN THỊ THÔNG TIN KHI SỬA ----- */}
          {editing && (
            <>
              <div className={formGroupClass}>
                <label className={labelClass}>Số tiền</label>
                <input
                  type="text"
                  value={formData.displayAmount != null ? `${Number(formData.displayAmount).toLocaleString('vi-VN')} đ` : ''}
                  disabled
                  className={disabledInputClass}
                />
              </div>
              <div className={formGroupClass}>
                <label className={labelClass}>Ngày thanh toán</label>
                <input
                  type="datetime-local"
                  value={formatDateTimeLocal(formData.displayPaymentDate)}
                  disabled
                  className={disabledInputClass}
                />
              </div>
            </>
          )}

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