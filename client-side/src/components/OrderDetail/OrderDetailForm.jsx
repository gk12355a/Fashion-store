import React from "react";
import "../Form.css";
import ReusableSearch from "../Common/ReusableSearch"; // 1. Import ReusableSearch

// 2. Định nghĩa các mức giá
const predefinedPrices = [100000, 200000, 300000, 500000];

export default function OrderDetailForm({ show, formData, errors, onChange, onSave, onCancel, editing }) {
  if (!show) return null;

  // 3. Hàm xử lý khi chọn sản phẩm từ ReusableSearch
  const handleProductSelect = (product) => {
    if (product) {
      // Tự động điền cả Mã SP và Đơn giá
      onChange({ target: { name: 'productId', value: product.id } });
      onChange({ target: { name: 'unitPrice', value: product.price } });
    } else {
      // Clear
      onChange({ target: { name: 'productId', value: '' } });
    }
  };

  // 4. Hàm xử lý khi chọn giá từ select box
  const handlePredefinedPriceChange = (e) => {
    const newPrice = e.target.value;
    onChange({ target: { name: 'unitPrice', value: newPrice } });
  };

  // 5. Đồng bộ giá trị của select box giá
  const priceSelectValue = predefinedPrices.includes(Number(formData.unitPrice)) 
    ? formData.unitPrice 
    : "";

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editing ? "Chỉnh sửa chi tiết đơn" : "Thêm chi tiết đơn mới"}</h2>
        <div className="form">

          {/* ----- MÃ ĐƠN HÀNG ----- */}
          <div className="form-group">
            <label>Mã đơn</label>
            <input
              name="orderId"
              value={formData.orderId}
              onChange={onChange}
              placeholder="VD: 1"
              type="number"
              // 6. Không cho sửa Mã đơn khi đang Edit
              disabled={editing} 
            />
            {errors.orderId && <p className="error-text">{errors.orderId}</p>}
          </div>

          {/* ----- MÃ SẢN PHẨM (Autocomplete) ----- */}
          <div className="form-group">
            <label>Mã sản phẩm</label>
            <ReusableSearch
              searchApiUrl="/products/search"
              placeholder="Tìm sản phẩm theo tên, loại..."
              onSelect={handleProductSelect}
              displayField="name"
              // 7. Không cho sửa Mã SP khi đang Edit
              disabled={editing}
            />
            {/* Hiển thị ID đã chọn (nếu có) */}
            {formData.productId && !editing && (
              <p style={{ fontSize: '13px', color: '#0ca678', marginTop: '5px' }}>
                Đã chọn Mã SP: {formData.productId}
              </p>
            )}
            {errors.productId && <p className="error-text">{errors.productId}</p>}
          </div>

          {/* ----- SỐ LƯỢNG ----- */}
          <div className="form-group">
            <label>Số lượng</label>
            <input
              name="quantity"
              value={formData.quantity}
              onChange={onChange}
              placeholder="VD: 2"
              type="number"
            />
            {errors.quantity && <p className="error-text">{errors.quantity}</p>}
          </div>

          {/* ----- ĐƠN GIÁ (Hybrid) ----- */}
          <div className="form-group">
            <label>Đơn giá</label>
            <div className="hybrid-input-group">
              <select value={priceSelectValue} onChange={handlePredefinedPriceChange} className="price-select">
                <option value="">-- Chọn nhanh --</option>
                {predefinedPrices.map(price => (
                  <option key={price} value={price}>{price.toLocaleString()} đ</option>
                ))}
              </select>
              <input
                name="unitPrice"
                value={formData.unitPrice}
                onChange={onChange}
                placeholder="Hoặc nhập giá (VNĐ)"
                type="number"
                className="price-input"
                // 8. Tắt sửa giá khi đang Sửa (vì Backend sẽ tự lấy giá)
                // (Chỉ cho phép sửa Số lượng)
                disabled={editing}
              />
            </div>
            {errors.unitPrice && <p className="error-text">{errors.unitPrice}</p>}
          </div>

          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>Lưu</button>
            <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}