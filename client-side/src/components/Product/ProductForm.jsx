import React from "react";
import "../Form.css";

// --- DỮ LIỆU MOCK (Nên tải từ API nếu có thể) ---
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
  if (!show) return null;

  // Xử lý khi chọn giá định sẵn
  const handlePredefinedPriceChange = (e) => {
    const newPrice = e.target.value;
    // Chúng ta "giả mạo" một event object để hàm 'onChange' gốc có thể xử lý
    onChange({
      target: {
        name: "price",
        value: newPrice,
      },
    });
  };
  // --- CHỌN SIZE PHÙ HỢP THEO LOẠI SẢN PHẨM ---
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

  // Tự động chọn loại size dựa vào type
  let availableSizes = clothingSizes; // mặc định là size chữ

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

  // Xác định giá trị cho select box giá (để đồng bộ với ô input)
  const priceSelectValue = predefinedPrices.includes(Number(formData.price))
    ? formData.price
    : "";

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>

        <div className="form">
          {/* --- KHU VỰC UPLOAD FILE (Giữ nguyên) --- */}
          <div className="form-group">
            <label>Ảnh sản phẩm</label>
            {editing && formData.imageUrl && (
              <div style={{ marginBottom: 10, textAlign: "center" }}>
                <img
                  src={formData.imageUrl}
                  alt="Ảnh hiện tại"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 12,
                    display: "block",
                    margin: "5px auto",
                    border: "2px solid #eee",
                  }}
                />
              </div>
            )}
            <input
              type="file"
              name="file"
              id="file-upload-input"
              onChange={onFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
            <div className="file-upload-group">
              <label htmlFor="file-upload-input" className="file-upload-btn">
                {editing ? "Chọn ảnh khác" : "Chọn ảnh sản phẩm"}
              </label>
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

          {/* --- LOẠI (THAY BẰNG SELECT) --- */}
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

          {/* --- SIZE (THAY BẰNG SELECT) --- */}
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

          {/* --- GIÁ (HYBRID INPUT) --- */}
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
