import React, { useState, useEffect } from "react";
import "../Form.css"; // Dùng chung CSS Form
import ReusableSearch from "../Common/ReusableSearch"; // Import component tìm kiếm
import CartTable from "./CartTable"; // Import Bảng giỏ hàng (sẽ tạo ở file sau)
import { toast } from "react-toastify";

// Trạng thái ban đầu cho form
const initialFormData = {
  customer: null, // Sẽ lưu object customer đầy đủ
  promotion: null, // Sẽ lưu object promotion đầy đủ
  cartItems: [], // Danh sách sản phẩm trong giỏ
};

export default function OrderForm({ show, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // State cho khu vực "Thêm sản phẩm"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [productError, setProductError] = useState("");

  // Tự động reset form mỗi khi modal mở ra
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

  // --- XỬ LÝ GIỎ HÀNG (CART) ---

  const handleAddToCart = () => {
    setProductError("");
    // 1. Validate
    if (!selectedProduct) {
      setProductError("Vui lòng chọn một sản phẩm.");
      return;
    }
    if (quantity <= 0) {
      setProductError("Số lượng phải lớn hơn 0.");
      return;
    }
    // 2. Kiểm tra tồn kho
    if (quantity > selectedProduct.stockQuantity) {
      setProductError(
        `Không đủ hàng. Chỉ còn ${selectedProduct.stockQuantity} sản phẩm.`
      );
      return;
    }
    // 3. Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingItem = formData.cartItems.find(
      (item) => item.productId === selectedProduct.id
    );

    let newCartItems;
    if (existingItem) {
      // Cập nhật số lượng nếu đã tồn tại
      newCartItems = formData.cartItems.map((item) =>
        item.productId === selectedProduct.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Thêm mới vào giỏ
      const newItem = {
        productId: selectedProduct.id,
        name: selectedProduct.name,
        unitPrice: selectedProduct.price,
        quantity: quantity,
      };
      newCartItems = [...formData.cartItems, newItem];
    }
    setFormData({ ...formData, cartItems: newCartItems });

    // 4. Reset ô thêm sản phẩm
    setSelectedProduct(null);
    setQuantity(1);
    // (Chúng ta cần cách để reset ReusableSearch -> sẽ xử lý sau, tạm thời ổn)
  };

  // Xóa item khỏi giỏ
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

    // (Logic giảm giá cơ bản - Sẽ cần API /promotions/validate sau)
    let discount = 0;
    if (formData.promotion) {
      // Tạm thời hardcode, sau này sẽ thay bằng logic phức tạp hơn
      if (formData.promotion.type === "FIXED_AMOUNT") {
        discount = formData.promotion.discountValue;
      } else if (formData.promotion.type === "PERCENTAGE") {
        discount = subtotal * (formData.promotion.discountValue / 100);
      }
    }

    const total = Math.max(0, subtotal - discount); // Đảm bảo không âm
    return { subtotal, discount, total };
  };

  const { subtotal, discount, total } = calculateTotals();

  // --- XỬ LÝ LƯU ĐƠN HÀNG ---
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

    // Chuẩn bị DTO gửi đi
    const requestData = {
      customerId: formData.customer.id,
      promotionId: formData.promotion ? formData.promotion.id : null,
      details: formData.cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    // Gọi hàm onSave (được truyền từ OrdersPage)
    try {
      // onSave là hàm 'handleSave' của OrdersPage
      // nó sẽ tự gọi api, toast, và đóng modal
      await onSave(requestData);
    } catch (error) {
      // Lỗi đã được toast ở OrdersPage, chỉ cần dừng loading
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: "800px", maxHeight: "95vh" }}>
        <h2>Tạo đơn hàng mới</h2>
        <div className="form">
          {/* --- PHẦN 1: THÔNG TIN CHUNG --- */}
          <div className="form-group">
            <label>1. Tìm và chọn Khách hàng (*)</label>
            <ReusableSearch
              searchApiUrl="/customers/search"
              placeholder="Tìm theo tên, SĐT, email khách hàng..."
              onSelect={(customer) => setFormData({ ...formData, customer })}
              displayField="name"
            />
            {errors.customer && <p className="error-text">{errors.customer}</p>}
          </div>

          {/* --- PHẦN 2: GIỎ HÀNG --- */}
          <div className="form-group">
            <label>2. Thêm sản phẩm vào đơn (*)</label>
            <div className="add-product-section">
              {/* --- Khối 1: Tìm Sản phẩm (Thêm label) --- */}
              <div style={{ flex: 3 }}>
                <label className="form-sub-label">Sản phẩm</label>
                <ReusableSearch
                  searchApiUrl="/products/search"
                  placeholder="Tìm sản phẩm theo tên, loại..."
                  onSelect={(product) => setSelectedProduct(product)}
                  displayField="name"
                />
              </div>

              {/* --- Khối 2: Số lượng (Thêm label) --- */}
              <div className="quantity-wrapper">
                <label
                  htmlFor="order-quantity-input"
                  className="form-sub-label"
                >
                  Số lượng
                </label>
                <input
                  id="order-quantity-input" // Thêm ID để label hoạt động
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="SL" // Giữ "SL" (giờ đã rõ nhờ label)
                  className="quantity-input"
                  min="1"
                />
              </div>

              {/* --- Khối 3: Nút bấm (Thêm căn chỉnh) --- */}
              <button
                onClick={handleAddToCart}
                className="add-cart-btn"
                style={{
                  alignSelf: "flex-end",
                  background: "linear-gradient(135deg, #ff7b00, #ffb347)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1rem",
                  border: "none",
                  borderRadius: "12px",
                  padding: "10px 18px",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(255, 123, 0, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #ff9a1f, #ffd280)";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 6px 14px rgba(255, 155, 0, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #ff7b00, #ffb347)";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 10px rgba(255, 123, 0, 0.3)";
                }}
                onMouseDown={(e) => {
                  e.target.style.transform = "scale(0.96)";
                  e.target.style.boxShadow = "0 2px 6px rgba(255, 123, 0, 0.2)";
                }}
                onMouseUp={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 6px 14px rgba(255, 155, 0, 0.4)";
                }}
              >
                + Thêm
              </button>
            </div>
            {productError && (
              <p className="error-text" style={{ marginTop: "5px" }}>
                {productError}
              </p>
            )}
          </div>

          {/* Bảng giỏ hàng */}
          <CartTable
            items={formData.cartItems}
            onRemove={handleRemoveFromCart}
          />
          {errors.cart && <p className="error-text">{errors.cart}</p>}

          {/* --- PHẦN 3: KHUYẾN MÃI & TỔNG KẾT --- */}
          <div className="form-group">
            <label>3. Áp dụng Khuyến mãi (Tùy chọn)</label>
            <ReusableSearch
              searchApiUrl="/promotions/search-active" // <-- Sửa endpoint cho đúng (File 15)
              placeholder="Tìm khuyến mãi theo tên hoặc loại..." // <-- Sửa placeholder
              onSelect={(promo) =>
                setFormData({ ...formData, promotion: promo })
              }
              displayField="name" // <-- SỬA 'code' THÀNH 'name'
            />
          </div>

          <div className="order-summary">
            <div>
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString()} đ</span>
            </div>
            {discount > 0 && (
              <div className="summary-discount">
                <span>Giảm giá ({formData.promotion?.code}):</span>
                <span>- {discount.toLocaleString()} đ</span>
              </div>
            )}
            <div className="summary-total">
              <span>TỔNG CỘNG:</span>
              <span>{total.toLocaleString()} đ</span>
            </div>
          </div>

          {/* --- NÚT BẤM --- */}
          <div className="form-buttons">
            <button
              className="save-btn"
              onClick={handleSaveClick}
              disabled={isSaving}
            >
              {isSaving ? "Đang lưu..." : "Lưu Đơn Hàng"}
            </button>
            <button
              className="cancel-btn"
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