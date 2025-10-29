import React, { useEffect } from "react";
import ReusableSearch from "../Common/ReusableSearch"; 

// --- Tailwind Base Classes (Copied from your file) ---
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

export default function OrderDetailForm({
  show,
  formData, // Expects { orderId, productId, productName, quantity, unitPrice }
  errors,
  onChange,
  onProductSelect, // Callback when product is selected via ReusableSearch
  onSave,
  onCancel,
  editing,
  isSaving // Add isSaving prop
}) {

  // State to hold the product name for display in ReusableSearch during edit
  const [currentProductName, setCurrentProductName] = useState('');

  // Update display name when formData changes (especially in edit mode)
  useEffect(() => {
    if (editing && formData.productName) {
      setCurrentProductName(formData.productName);
    } else {
       // Clear name if not editing or product name missing
       setCurrentProductName('');
    }
  }, [editing, formData.productName]);


  if (!show) return null;

  // --- INTERNAL HANDLER FOR PRODUCT SELECTION ---
  // This calls the prop passed from the parent AND updates the local display name
  const handleInternalProductSelect = (product) => {
    if (product) {
        setCurrentProductName(product.name); // Update local display name
        onProductSelect(product); // Call parent handler to update main formData
    } else {
         setCurrentProductName('');
         onProductSelect(null); // Notify parent that selection cleared
    }
  };
  // ---------------------------------------------


  return (
    <div className={overlayClass}>
      <div className={modalClass}>
        <h2 className={titleClass}>{editing ? "Chỉnh sửa chi tiết đơn hàng" : "Thêm chi tiết đơn hàng mới"}</h2>
        <div className={formClass}>

          {/* ----- MÃ ĐƠN HÀNG (Disabled on Edit) ----- */}
          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="orderDetail-orderId">Mã đơn hàng (*)</label>
            <input
              id="orderDetail-orderId"
              name="orderId"
              value={formData.orderId || ''}
              onChange={onChange}
              placeholder="Nhập mã đơn hàng" // Có thể đổi placeholder
              type="number"
              disabled={!!editing} 
              className={editing ? disabledInputClass : baseInputClass}
            />
            {errors.orderId && <p className={errorClass}>{errors.orderId}</p>}
          </div>

          {/* ----- SẢN PHẨM (ReusableSearch - Enabled for Edit) ----- */}
          <div className={formGroupClass}>
            <label className={labelClass}>Sản phẩm (*)</label>
            <ReusableSearch
              searchApiUrl="/products/search"
              placeholder="Tìm sản phẩm theo tên..."
              onSelect={handleInternalProductSelect} // Use internal handler
              displayField="name"
              // Pass currentProductName for initial display in edit mode
              initialValue={currentProductName}
              // Allow changing product in edit mode
              // disabled={editing} // Remove disabled if you want to allow changing product
            />
            {/* Optionally display selected ID */}
            {formData.productId && (
              <p className="text-xs text-gray-500 ml-2 mt-1 font-['Helvetica_Neue',_'Arial',_sans-serif]">
                (Mã SP: {formData.productId})
              </p>
            )}
            {errors.productId && <p className={errorClass}>{errors.productId}</p>}
          </div>

          {/* ----- SỐ LƯỢNG (Always Editable) ----- */}
          <div className={formGroupClass}>
            <label className={labelClass} htmlFor="orderDetail-quantity">Số lượng (*)</label>
            <input
              id="orderDetail-quantity"
              name="quantity"
              value={formData.quantity || ''}
              onChange={onChange}
              placeholder="Nhập số lượng"
              type="number"
              min="1"
              className={baseInputClass} // Always editable
            />
            {errors.quantity && <p className={errorClass}>{errors.quantity}</p>}
          </div>

          {/* ----- ĐƠN GIÁ (Display Only - Auto-updated) ----- */}
          <div className={formGroupClass}>
            <label className={labelClass}>Đơn giá (Tự động)</label>
            <input
              name="unitPrice"
              value={formData.unitPrice ? Number(formData.unitPrice).toLocaleString('vi-VN') + ' đ' : ''} // Format currency
              placeholder="Tự động theo sản phẩm"
              type="text" // Change to text for display formatting
              disabled // Always disabled
              className={disabledInputClass}
            />
            {/* No error message needed as it's not user-editable */}
          </div>

          {/* ----- NÚT BẤM ----- */}
          <div className={buttonGroupClass}>
            <button
                className={saveButtonClass}
                onClick={onSave}
                disabled={isSaving} // Disable when saving
            >
                {isSaving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button
                className={cancelButtonClass}
                onClick={onCancel}
                disabled={isSaving} // Also disable cancel during save
            >
                Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}