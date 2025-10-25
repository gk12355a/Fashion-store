import React, { useState, useEffect } from "react";
// import "../Form.css"; // <- ĐÃ XÓA
import ReusableSearch from "../Common/ReusableSearch";
import CartTable from "./CartTable";
import { toast } from "react-toastify";

// --- Định nghĩa lớp Tailwind Base (Cập nhật màu sắc và font chữ) ---
const overlayClass = "fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm";
const modalClass = "bg-white p-6 md:p-9 rounded-2xl w-[90%] max-h-[90vh] overflow-y-auto shadow-xl border-2 border-[#7B0323] font-['Helvetica_Neue',_'Arial',_sans-serif] relative animate-modal-appear";
const titleClass = "font-['Helvetica_Neue',_'Arial',_sans-serif] text-2xl md:text-3xl font-bold text-[#7B0323] mb-6 text-center border-b-2 border-[#7B0323] pb-4 tracking-wider";
const formClass = "flex flex-col gap-5";
const formGroupClass = "flex flex-col gap-2";
const labelClass = "font-medium text-[#7B0323] text-base mb-1 font-['Helvetica_Neue',_'Arial',_sans-serif]";
const baseInputClass = "py-3 px-4 border-2 border-gray-200 rounded-xl text-base font-['Helvetica_Neue',_'Arial',_sans-serif] transition-all duration-300 ease-in-out bg-gray-50 focus:outline-none focus:border-[#7B0323] focus:bg-white focus:shadow-[0_0_0_3px_rgba(123,3,35,0.1)] focus:-translate-y-px hover:border-[#7B0323] hover:bg-white";
const errorClass = "text-red-600 text-sm -mt-1 mb-1 font-medium flex items-center gap-1.5 before:content-['⚠️'] before:text-xs font-['Helvetica_Neue',_'Arial',_sans-serif]";
const buttonGroupClass = "flex flex-col md:flex-row justify-between gap-4 mt-6 pt-5 border-t border-[#7B0323]/20";
const baseButtonClass = "py-3 px-6 border-none rounded-xl cursor-pointer text-base font-medium font-['Helvetica_Neue',_'Arial',_sans-serif] transition-all duration-300 ease-in-out flex-1";
// Thêm :disabled
const saveButtonClass = `${baseButtonClass} bg-gradient-to-r from-[#7B0323] to-[#5a0219] text-white shadow-lg shadow-[#7B0323]/30 hover:bg-gradient-to-r hover:from-[#5a0219] hover:to-[#7B0323] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7B0323]/40 active:translate-y-0 disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed`;
const cancelButtonClass = `${baseButtonClass} bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-500/40 active:translate-y-0 disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed`;

// --- Class mới cho Form này (Cập nhật màu sắc) ---
const addProductSectionClass = "flex flex-col md:flex-row gap-4 items-end";
const formSubLabelClass = "block text-sm font-medium text-[#7B0323] mb-1.5 font-['Helvetica_Neue',_'Arial',_sans-serif]";
const addCartButtonClass = "self-end py-2.5 px-5 rounded-xl cursor-pointer border-none bg-gradient-to-r from-[#7B0323] to-[#5a0219] text-white font-medium text-base shadow-lg shadow-[#7B0323]/30 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#5a0219] hover:to-[#7B0323] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7B0323]/40 active:scale-95 active:shadow-md active:shadow-[#7B0323]/20 font-['Helvetica_Neue',_'Arial',_sans-serif]";
const orderSummaryClass = "mt-5 pt-5 border-t border-[#7B0323]/20 space-y-2";
const summaryLineClass = "flex justify-between text-base font-['Helvetica_Neue',_'Arial',_sans-serif]";
const summaryDiscountClass = "flex justify-between text-base text-green-600 font-['Helvetica_Neue',_'Arial',_sans-serif]";
const summaryTotalClass = "flex justify-between text-xl font-bold text-gray-900 mt-2 pt-2 border-t font-['Helvetica_Neue',_'Arial',_sans-serif]";
// -----------------------------------------------------

const initialFormData = {
  customer: null,
  promotion: null,
  cartItems: [],
};

export default function OrderForm({ show, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [productError, setProductError] = useState("");

  useEffect(() => {
    if (show) {
      setFormData(initialFormData);
      setErrors({});
      setSelectedProduct(null);
      setQuantity(1);
      setProductError("");
      setIsSaving(false);
    }
  }, [show]);

  if (!show) return null;

  // --- XỬ LÝ GIỎ HÀNG ---
  const handleAddToCart = () => {
    setProductError("");
    if (!selectedProduct) {
      setProductError("Vui lòng chọn một sản phẩm.");
      return;
    }
    if (quantity <= 0) {
      setProductError("Số lượng phải lớn hơn 0.");
      return;
    }
    if (quantity > selectedProduct.stockQuantity) {
      setProductError(`Không đủ hàng. Chỉ còn ${selectedProduct.stockQuantity} sản phẩm.`);
      return;
    }
    const existingItem = formData.cartItems.find(
      (item) => item.productId === selectedProduct.id
    );
    let newCartItems;
    if (existingItem) {
      newCartItems = formData.cartItems.map((item) =>
        item.productId === selectedProduct.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCartItems = [...formData.cartItems, {
        productId: selectedProduct.id,
        name: selectedProduct.name,
        unitPrice: selectedProduct.price,
        quantity: quantity,
      }];
    }
    setFormData({ ...formData, cartItems: newCartItems });
    setSelectedProduct(null);
    setQuantity(1);
    // TODO: Cần một cách để clear ReusableSearch component (ví dụ: truyền vào 1 prop `resetKey`)
  };

  const handleRemoveFromCart = (productId) => {
    const newCartItems = formData.cartItems.filter(
      (item) => item.productId !== productId
    );
    setFormData({ ...formData, cartItems: newCartItems });
  };

  // --- TÍNH TOÁN TỔNG TIỀN ---
  const calculateTotals = () => {
    const subtotal = formData.cartItems.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );
    let discount = 0;
    if (formData.promotion) {
      if (formData.promotion.type === "FIXED_AMOUNT") {
        discount = formData.promotion.discountValue;
      } else if (formData.promotion.type === "PERCENTAGE") {
        discount = subtotal * (formData.promotion.discountValue / 100);
      }
    }
    const total = Math.max(0, subtotal - discount);
    return { subtotal, discount, total };
  };

  const { subtotal, discount, total } = calculateTotals();

  // --- XỬ LÝ LƯU ---
  const validateSave = () => {
    const newErrors = {};
    if (!formData.customer) {
      newErrors.customer = "Vui lòng chọn một khách hàng.";
    }
    if (formData.cartItems.length === 0) {
      newErrors.cart = "Đơn hàng phải có ít nhất một sản phẩm.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = async () => {
    if (!validateSave()) {
      toast.error("Vui lòng kiểm tra lại thông tin đơn hàng!");
      return;
    }
    setIsSaving(true);
    const requestData = {
      customerId: formData.customer.id,
      promotionId: formData.promotion ? formData.promotion.id : null,
      details: formData.cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
    try {
      await onSave(requestData);
    } catch (error) {
      setIsSaving(false);
    }
  };

  return (
    <div className={overlayClass}>
      {/* Tăng max-width và max-height cho modal này */}
      <div className={`${modalClass} max-w-3xl max-h-[95vh]`}>
        <h2 className={titleClass}>Tạo đơn hàng mới</h2>
        <div className={formClass}>
          {/* --- PHẦN 1: KHÁCH HÀNG --- */}
          <div className={formGroupClass}>
            <label className={labelClass}>1. Tìm và chọn Khách hàng (*)</label>
            <ReusableSearch
              searchApiUrl="/customers/search"
              placeholder="Tìm theo tên, SĐT, email khách hàng..."
              onSelect={(customer) => setFormData({ ...formData, customer })}
              displayField="name"
            />
            {errors.customer && <p className={errorClass}>{errors.customer}</p>}
          </div>

          {/* --- PHẦN 2: GIỎ HÀNG --- */}
          <div className={formGroupClass}>
            <label className={labelClass}>2. Thêm sản phẩm vào đơn (*)</label>
            <div className={addProductSectionClass}>
              <div className=".flex-3"> {/* Tương đương flex: 3 */}
                <label className={formSubLabelClass}>Sản phẩm</label>
                <ReusableSearch
                  searchApiUrl="/products/search"
                  placeholder="Tìm sản phẩm theo tên, loại..."
                  onSelect={(product) => setSelectedProduct(product)}
                  displayField="name"
                  // TODO: Cần prop 'resetKey' để clear search này sau khi thêm
                />
              </div>
              <div className=".flex-1"> {/* Tương đương quantity-wrapper */}
                <label
                  htmlFor="order-quantity-input"
                  className={formSubLabelClass}
                >
                  Số lượng
                </label>
                <input
                  id="order-quantity-input"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="SL"
                  className={baseInputClass} // Dùng baseInputClass
                  min="1"
                />
              </div>
              <button
                onClick={handleAddToCart}
                className={addCartButtonClass}
              >
                + Thêm
              </button>
            </div>
            {productError && (
              <p className={errorClass} style={{ marginTop: "5px" }}>
                {productError}
              </p>
            )}
          </div>

          {/* Bảng giỏ hàng (đã được refactor) */}
          <CartTable
            items={formData.cartItems}
            onRemove={handleRemoveFromCart}
          />
          {errors.cart && <p className={errorClass}>{errors.cart}</p>}

          {/* --- PHẦN 3: KHUYẾN MÃI & TỔNG KẾT --- */}
          <div className={formGroupClass}>
            <label className={labelClass}>3. Áp dụng Khuyến mãi (Tùy chọn)</label>
            <ReusableSearch
              searchApiUrl="/promotions/search-active"
              placeholder="Tìm khuyến mãi theo tên hoặc loại..."
              onSelect={(promo) =>
                setFormData({ ...formData, promotion: promo })
              }
              displayField="name"
            />
          </div>

          <div className={orderSummaryClass}>
            <div className={summaryLineClass}>
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString()} đ</span>
            </div>
            {discount > 0 && (
              <div className={summaryDiscountClass}>
                <span>Giảm giá ({formData.promotion?.name}):</span> {/* Sửa từ code -> name */}
                <span>- {discount.toLocaleString()} đ</span>
              </div>
            )}
            <div className={summaryTotalClass}>
              <span>TỔNG CỘNG:</span>
              <span>{total.toLocaleString()} đ</span>
            </div>
          </div>

          {/* --- NÚT BẤM --- */}
          <div className={buttonGroupClass}>
            <button
              className={saveButtonClass}
              onClick={handleSaveClick}
              disabled={isSaving}
            >
              {isSaving ? "Đang lưu..." : "Lưu Đơn Hàng"}
            </button>
            <button
              className={cancelButtonClass}
              onClick={onCancel}
              disabled={isSaving}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}