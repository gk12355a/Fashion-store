import React, { useEffect } from "react";
// import "../Form.css"; // <- ĐÃ XÓA
import ReusableSearch from "../Common/ReusableSearch"; 

// --- Định nghĩa lớp Tailwind Base (Dịch từ Form.css) ---
const overlayClass = "fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm";
const modalClass = "bg-white p-6 md:p-9 rounded-2xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto shadow-xl border-2 border-[#7B0323] font-['Helvetica_Neue',_'Arial',_sans-serif] relative animate-modal-appear";
const titleClass = "font-['Helvetica_Neue',_'Arial',_sans-serif] text-2xl md:text-3xl font-bold text-[#7B0323] mb-6 text-center border-b-2 border-[#7B0323] pb-4 tracking-wider";
const formClass = "flex flex-col gap-5";
const formGroupClass = "flex flex-col gap-2";
const labelClass = "font-medium text-[#7B0323] text-base mb-1 font-['Helvetica_Neue',_'Arial',_sans-serif]";
const baseInputClass = "py-3 px-4 border-2 border-gray-200 rounded-xl text-base font-['Helvetica_Neue',_'Arial',_sans-serif] transition-all duration-300 ease-in-out bg-gray-50 focus:outline-none focus:border-[#7B0323] focus:bg-white focus:shadow-[0_0_0_3px_rgba(123,3,35,0.1)] focus:-translate-y-px hover:border-[#7B0323] hover:bg-white";
const disabledInputClass = `${baseInputClass} bg-gray-100 text-gray-500 cursor-not-allowed hover:border-gray-200 hover:bg-gray-100 focus:border-gray-200 focus:shadow-none focus:-translate-y-0`;
const errorClass = "text-red-600 text-sm -mt-1 mb-1 font-medium flex items-center gap-1.5 before:content-['⚠️'] before:text-xs font-['Helvetica_Neue',_'Arial',_sans-serif]";
const buttonGroupClass = "flex flex-col md:flex-row justify-between gap-4 mt-6 pt-5 border-t border-[#7B0323]/20";
const baseButtonClass = "py-3 px-6 border-none rounded-xl cursor-pointer text-base font-medium font-['Helvetica_Neue',_'Arial',_sans-serif] transition-all duration-300 ease-in-out flex-1";
const saveButtonClass = `${baseButtonClass} bg-gradient-to-r from-[#7B0323] to-[#5a0219] text-white shadow-lg shadow-[#7B0323]/30 hover:bg-gradient-to-r hover:from-[#5a0219] hover:to-[#7B0323] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7B0323]/40 active:translate-y-0`;
const cancelButtonClass = `${baseButtonClass} bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-500/40 active:translate-y-0`;
// -----------------------------------------------------

const predefinedPrices = [100000, 150000, 200000, 250000, 300000, 500000];

export default function OrderDetailForm({
  show,
  formData,
  errors,
  onChange,
  onSave,
  onCancel,
  editing,
}) {
  useEffect(() => {
    if (!editing) {
      onChange({ target: { name: 'productId', value: '' } });
      onChange({ target: { name: 'unitPrice', value: '' } });
    }
  }, [formData.orderId, editing, onChange]); // Thêm 'onChange' vào dependency array

  if (!show) return null;

  const handleProductSelect = (product) => {
    if (product) {
      onChange({ target: { name: 'productId', value: product.id } });
      onChange({ target: { name: 'unitPrice', value: product.price } });
    } else {
      onChange({ target: { name: 'productId', value: '' } });
      onChange({ target: { name: 'unitPrice', value: '' } });
    }
  };

  const handlePredefinedPriceChange = (e) => {
    const newPrice = e.target.value;
    onChange({ target: { name: 'unitPrice', value: newPrice } });
  };

  const priceSelectValue = predefinedPrices.includes(Number(formData.unitPrice))
    ? formData.unitPrice
    : "";

  return (
    <div className={overlayClass}>
      <div className={modalClass}>
        <h2 className={titleClass}>{editing ? "Chỉnh sửa chi tiết đơn hàng" : "Thêm chi tiết đơn hàng mới"}</h2>
        <div className={formClass}>

          {/* ----- MÃ ĐƠN HÀNG ----- */}
          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="orderDetail-orderId">Mã đơn hàng (*)</label>
            <input
              id="orderDetail-orderId"
              name="orderId"
              value={formData.orderId}
              onChange={onChange}
              placeholder="Nhập mã đơn hàng"
              type="number"
              disabled={editing}
              className={editing ? disabledInputClass : baseInputClass}
            />
            {errors.orderId && <p className={errorClass}>{errors.orderId}</p>}
          </div>

          {/* ----- MÃ SẢN PHẨM (Autocomplete) ----- */}
          <div className={formGroupClass}>
            <label className={labelClass}>Sản phẩm (*)</label>
            <ReusableSearch
              searchApiUrl="/products/search"
              placeholder="Tìm sản phẩm theo tên, loại..."
              onSelect={handleProductSelect}
              displayField="name"
              disabled={editing}
            />
            {formData.productId && !editing && (
              <p className="text-sm text-[#7B0323] mt-1.5 font-['Helvetica_Neue',_'Arial',_sans-serif]">
                Mã SP đã chọn: {formData.productId}
              </p>
            )}
            {errors.productId && <p className={errorClass}>{errors.productId}</p>}
          </div>

          {/* ----- SỐ LƯỢNG ----- */}
          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="orderDetail-quantity">Số lượng (*)</label>
            <input
              id="orderDetail-quantity"
              name="quantity"
              value={formData.quantity}
              onChange={onChange}
              placeholder="Nhập số lượng"
              type="number"
              min="1"
              className={baseInputClass} // Luôn cho phép sửa số lượng
            />
            {errors.quantity && <p className={errorClass}>{errors.quantity}</p>}
          </div>

          {/* ----- ĐƠN GIÁ (Hybrid) ----- */}
          <div className={formGroupClass}>
            <label className={labelClass}>Đơn giá (*)</label>
            {/* Dịch .hybrid-input-group */}
            <div className="flex gap-2.5">
              {/* Dịch .price-select */}
              <select
                value={priceSelectValue}
                onChange={handlePredefinedPriceChange}
                className={`${editing ? disabledInputClass : baseInputClass} flex-1`} // flex: 1
                disabled={editing}
              >
                <option value="">-- Chọn nhanh --</option>
                {predefinedPrices.map(price => (
                  <option key={price} value={price}>
                    {price.toLocaleString('vi-VN')} đ
                  </option>
                ))}
              </select>
              {/* Dịch .price-input */}
              <input
                name="unitPrice"
                value={formData.unitPrice}
                onChange={onChange}
                placeholder="Hoặc nhập giá (VNĐ)"
                type="number"
                min="0"
                className={`${editing ? disabledInputClass : baseInputClass} flex-2`} // flex: 2
                disabled={editing}
              />
            </div>
            {errors.unitPrice && <p className={errorClass}>{errors.unitPrice}</p>}
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