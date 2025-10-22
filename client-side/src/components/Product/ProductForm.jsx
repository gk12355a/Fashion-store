import React, { useState, useEffect } from "react"; // 1. Import thêm useState và useEffect
import "../Form.css";

// --- DỮ LIỆU MOCK (Giữ nguyên) ---
const productTypes = [
  // 👕 Áo (Topwear)
  "Áo Sơ Mi",
  "Áo Phông",
  "Áo Polo",
  "Áo Hoodie",
  "Áo Khoác",
  "Áo Len",
  "Áo Vest",
  "Áo Tank Top",

  // 👖 Quần (Bottomwear)
  "Quần Jeans",
  "Quần Kaki",
  "Quần Tây",
  "Quần Short",
  "Quần Jogger",
  "Quần Legging",
  "Quần Thể Thao",

  // 👗 Váy & Đầm (Dresswear)
  "Váy",
  "Đầm Dạ Hội",
  "Đầm Công Sở",
  "Chân Váy",

  // 🧢 Phụ Kiện & Giày Dép (Accessories & Footwear)
  "Phụ Kiện",
  "Giày Dép",
  "Túi Xách",
  "Thắt Lưng",
  "Mũ Nón",
  "Kính Mát",
  "Trang Sức",
];

const productSizes = ["S", "M", "L", "XL", "XXL", "One Size"];
const predefinedPrices = [100000, 200000, 300000, 500000];
// --- KẾT THÚC DỮ LIỆU MOCK ---

export default function ProductForm({
  show,
  formData,
  errors,
  onChange,
  onFileChange,
  onSave,
  onCancel,
  editing,
  fileName,
}) {
  // 2. Thêm state để lưu URL xem trước của ảnh local
  const [localPreview, setLocalPreview] = useState(null);

  // 3. Tách style ảnh ra để tái sử dụng
  const imagePreviewStyle = {
    width: 100,
    height: 100,
    objectFit: "cover",
    borderRadius: 12,
    display: "block",
    margin: "5px auto",
    border: "2px solid #eee",
  };

  // 4. Effect để dọn dẹp URL khi form đóng hoặc khi formData thay đổi (chuyển sang edit)
  //    Điều này đảm bảo khi mở form edit, nó sẽ hiển thị ảnh từ server (formData.imageUrl),
  //    chứ không phải ảnh preview cũ của lần "Thêm mới" trước đó.
  useEffect(() => {
    if (!show) {
      if (localPreview) {
        URL.revokeObjectURL(localPreview); // Thu hồi URL cũ
      }
      setLocalPreview(null); // Reset preview
    }
  }, [show]); // Chỉ chạy khi 'show' thay đổi

  // 5. Effect dọn dẹp (cleanup) khi component unmount
  //    Cũng dùng để dọn dẹp URL cũ *trước khi* tạo URL mới
  useEffect(() => {
    // Trả về một hàm cleanup, sẽ được gọi khi component unmount
    // hoặc trước khi effect chạy lại (do localPreview thay đổi)
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]); // Phụ thuộc vào localPreview

  if (!show) return null;

  // Xử lý khi chọn giá định sẵn (Giữ nguyên)
  const handlePredefinedPriceChange = (e) => {
    const newPrice = e.target.value;
    onChange({
      target: {
        name: "price",
        value: newPrice,
      },
    });
  };

  // 6. Tạo hàm xử lý file nội bộ
  const handleFileChangeInternal = (e) => {
    // 6a. Gọi hàm 'onFileChange' gốc từ component cha (rất quan trọng)
    onFileChange(e);

    // 6b. Lấy file từ event
    const file = e.target.files[0];

    if (file) {
      // 6c. Nếu có file, tạo một URL đối tượng mới
      // (Effect dọn dẹp ở trên sẽ lo việc thu hồi URL cũ)
      const newPreviewUrl = URL.createObjectURL(file);
      setLocalPreview(newPreviewUrl);
    } else {
      // 6d. Nếu người dùng hủy chọn file
      setLocalPreview(null);
    }
  };

  // --- CHỌN SIZE PHÙ HỢP THEO LOẠI SẢN PHẨM (Giữ nguyên) ---
  const clothingSizes = ["S", "M", "L", "XL", "XXL"];
  const shoeSizes = [
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
  ];
  const oneSize = ["One Size"];

  let availableSizes = clothingSizes;
  if (formData.type === "Giày Dép") {
    availableSizes = shoeSizes;
  } else if (
    [
      "Phụ Kiện",
      "Túi Xách",
      "Thắt Lưng",
      "Mũ Nón",
      "Kính Mát",
      "Trang Sức",
    ].includes(formData.type)
  ) {
    availableSizes = oneSize;
  }

  // Xác định giá trị cho select box giá (Giữ nguyên)
  const priceSelectValue = predefinedPrices.includes(Number(formData.price))
    ? formData.price
    : "";

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>

        <div className="form">
          {/* --- KHU VỰC UPLOAD FILE (ĐÃ CẬP NHẬT LOGIC HIỂN THỊ) --- */}
          <div className="form-group">
            <label>Ảnh sản phẩm</label>

            {/* 7. Cập nhật logic hiển thị ảnh */}
            <div style={{ marginBottom: 10, textAlign: "center" }}>
              {/* Ưu tiên 1: Hiển thị ảnh preview MỚI CHỌN (localPreview).
                Điều này áp dụng cho cả "Thêm mới" và "Chỉnh sửa" khi chọn file mới.
              */}
              {localPreview && (
                <img
                  src={localPreview}
                  alt="Ảnh xem trước"
                  style={imagePreviewStyle}
                />
              )}

              {/* Ưu tiên 2: Nếu KHÔNG có ảnh mới, VÀ đang EDITING, 
                thì hiển thị ảnh CŨ từ server (formData.imageUrl).
              */}
              {!localPreview && editing && formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Ảnh hiện tại"
                  style={imagePreviewStyle}
                />
              )}
            </div>

            <input
              type="file"
              name="file"
              id="file-upload-input"
              onChange={handleFileChangeInternal} // 8. Sử dụng hàm xử lý nội bộ
              accept="image/*"
              style={{ display: "none" }}
            />
            <div className="file-upload-group">
              <label htmlFor="file-upload-input" className="file-upload-btn">
                {editing ? "Chọn ảnh khác" : "Chọn ảnh sản phẩm"}
              </label>
              {/* Vẫn hiển thị tên file như cũ */}
              {fileName && (
                <span className="file-name-display">{fileName}</span>
              )}
            </div>
            {errors.file && <p className="error-text">{errors.file}</p>}
          </div>

          {/* --- TÊN (Giữ nguyên) --- */}
          <div className="form-group">
            <label>Tên</label>
            <input
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Tên sản phẩm"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* --- LOẠI (Giữ nguyên) --- */}
          <div className="form-group">
            <label>Loại</label>
            <select name="type" value={formData.type} onChange={onChange}>
              <option value="">-- Chọn loại sản phẩm --</option>
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && <p className="error-text">{errors.type}</p>}
          </div>

          {/* --- SIZE (Giữ nguyên) --- */}
          <div className="form-group">
            <label>Size</label>
            <select name="size" value={formData.size} onChange={onChange}>
              <option value="">-- Chọn size --</option>
              {availableSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {errors.size && <p className="error-text">{errors.size}</p>}
          </div>

          {/* --- MÀU (Giữ nguyên) --- */}
          <div className="form-group">
            <label>Màu</label>
            <input
              name="color"
              value={formData.color}
              onChange={onChange}
              placeholder="Màu"
            />
            {errors.color && <p className="error-text">{errors.color}</p>}
          </div>

          {/* --- GIÁ (Giữ nguyên) --- */}
          <div className="form-group">
            <label>Giá</label>
            <div className="hybrid-input-group">
              <select
                value={priceSelectValue}
                onChange={handlePredefinedPriceChange}
                className="price-select"
              >
                <option value="">-- Chọn nhanh --</option>
                {predefinedPrices.map((price) => (
                  <option key={price} value={price}>
                    {price.toLocaleString()} đ
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={onChange}
                placeholder="Hoặc nhập giá (VNĐ)"
                className="price-input"
              />
            </div>
            {errors.price && <p className="error-text">{errors.price}</p>}
          </div>

          {/* --- SỐ LƯỢNG (Giữ nguyên) --- */}
          <div className="form-group">
            <label>Số lượng tồn kho</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={onChange}
              placeholder="Số lượng"
            />
            {errors.stockQuantity && (
              <p className="error-text">{errors.stockQuantity}</p>
            )}
          </div>

          {/* --- NÚT BẤM (Giữ nguyên) --- */}
          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>
              Lưu
            </button>
            <button className="cancel-btn" onClick={onCancel}>
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}