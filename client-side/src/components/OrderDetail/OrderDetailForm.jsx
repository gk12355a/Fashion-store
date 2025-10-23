import React, { useEffect } from "react"; // Thêm useEffect
import "../Form.css"; // Dùng CSS Form chung
import ReusableSearch from "../Common/ReusableSearch"; // Import component tìm kiếm

// Định nghĩa các mức giá gợi ý
const predefinedPrices = [100000, 150000, 200000, 250000, 300000, 500000];

export default function OrderDetailForm({
  show,       // Prop để hiện/ẩn modal
  formData,   // State chứa dữ liệu form (từ trang cha)
  errors,     // State chứa lỗi validation (từ trang cha)
  onChange,   // Hàm callback khi input thay đổi (từ trang cha)
  onSave,     // Hàm callback khi bấm nút Lưu (từ trang cha)
  onCancel,   // Hàm callback khi bấm nút Hủy (từ trang cha)
  editing,    // Prop boolean cho biết đang sửa hay thêm mới
}) {
  // Tự động clear Mã SP và Giá khi Mã Đơn thay đổi (tránh lỗi logic)
  useEffect(() => {
    // Chỉ chạy khi không phải đang edit (để giữ giá trị khi mở modal edit)
    if (!editing) {
      onChange({ target: { name: 'productId', value: '' } });
      onChange({ target: { name: 'unitPrice', value: '' } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.orderId, editing]); // Chạy lại khi orderId hoặc editing thay đổi

  if (!show) return null; // Không render gì nếu show=false

  // Hàm xử lý khi chọn Sản phẩm từ ô tìm kiếm
  const handleProductSelect = (product) => {
    if (product) {
      // Tự động điền Mã SP (ID) và Đơn giá (price) vào form
      onChange({ target: { name: 'productId', value: product.id } });
      onChange({ target: { name: 'unitPrice', value: product.price } });
    } else {
      // Nếu xóa tìm kiếm, clear Mã SP và Đơn giá
      onChange({ target: { name: 'productId', value: '' } });
      onChange({ target: { name: 'unitPrice', value: '' } });
    }
  };

  // Hàm xử lý khi chọn mức giá gợi ý từ select box
  const handlePredefinedPriceChange = (e) => {
    const newPrice = e.target.value;
    // Cập nhật state formData.unitPrice
    onChange({ target: { name: 'unitPrice', value: newPrice } });
  };

  // Xác định giá trị cho select box (để nó hiển thị đúng lựa chọn)
  const priceSelectValue = predefinedPrices.includes(Number(formData.unitPrice))
    ? formData.unitPrice
    : ""; // Nếu giá hiện tại không nằm trong gợi ý, select box hiển thị "-- Chọn nhanh --"

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Tiêu đề modal thay đổi tùy theo đang sửa hay thêm */}
        <h2>{editing ? "Chỉnh sửa chi tiết đơn hàng" : "Thêm chi tiết đơn hàng mới"}</h2>
        <div className="form">

          {/* ----- MÃ ĐƠN HÀNG ----- */}
          <div className="form-group">
            <label htmlFor="orderDetail-orderId">Mã đơn hàng (*)</label>
            <input
              id="orderDetail-orderId"
              name="orderId"
              value={formData.orderId}
              onChange={onChange}
              placeholder="Nhập mã đơn hàng"
              type="number"
              // Không cho sửa Mã đơn khi đang Edit
              disabled={editing}
            />
            {/* Hiển thị lỗi nếu có */}
            {errors.orderId && <p className="error-text">{errors.orderId}</p>}
          </div>

          {/* ----- MÃ SẢN PHẨM (Autocomplete) ----- */}
          <div className="form-group">
            <label>Sản phẩm (*)</label>
            {/* Component tìm kiếm */}
            <ReusableSearch
              searchApiUrl="/products/search" // API để tìm sản phẩm
              placeholder="Tìm sản phẩm theo tên, loại..."
              onSelect={handleProductSelect} // Hàm callback khi chọn sản phẩm
              displayField="name" // Hiển thị tên sản phẩm trong ô input
              // Không cho sửa Sản phẩm khi đang Edit
              disabled={editing}
            />
            {/* Hiển thị ID sản phẩm đã chọn (chỉ khi thêm mới) */}
            {formData.productId && !editing && (
              <p style={{ fontSize: '13px', color: '#555', marginTop: '5px' }}>
                Mã SP đã chọn: {formData.productId}
              </p>
            )}
            {/* Hiển thị lỗi nếu có */}
            {errors.productId && <p className="error-text">{errors.productId}</p>}
          </div>

          {/* ----- SỐ LƯỢNG ----- */}
          <div className="form-group">
            <label htmlFor="orderDetail-quantity">Số lượng (*)</label>
            <input
              id="orderDetail-quantity"
              name="quantity"
              value={formData.quantity}
              onChange={onChange}
              placeholder="Nhập số lượng"
              type="number"
              min="1" // Số lượng ít nhất là 1
            />
            {errors.quantity && <p className="error-text">{errors.quantity}</p>}
          </div>

          {/* ----- ĐƠN GIÁ (Hybrid) ----- */}
          <div className="form-group">
            <label>Đơn giá (*)</label>
            <div className="hybrid-input-group"> {/* Class để style 2 ô cạnh nhau */}
              {/* Select box chọn nhanh */}
              <select
                value={priceSelectValue}
                onChange={handlePredefinedPriceChange}
                className="price-select"
                // Không cho sửa giá khi đang Edit (backend sẽ tự lấy giá)
                disabled={editing}
              >
                <option value="">-- Chọn nhanh --</option>
                {predefinedPrices.map(price => (
                  <option key={price} value={price}>
                    {price.toLocaleString('vi-VN')} đ
                  </option>
                ))}
              </select>
              {/* Input nhập giá tùy ý */}
              <input
                name="unitPrice"
                value={formData.unitPrice}
                onChange={onChange}
                placeholder="Hoặc nhập giá (VNĐ)"
                type="number"
                min="0" // Giá không được âm
                className="price-input"
                // Không cho sửa giá khi đang Edit
                disabled={editing}
              />
            </div>
            {errors.unitPrice && <p className="error-text">{errors.unitPrice}</p>}
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