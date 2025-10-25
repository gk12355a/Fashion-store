import React, { useState, useEffect } from "react";

// --- Định nghĩa lớp Tailwind Base (Cập nhật theo style Header) ---
const overlayClass = "fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm";
const modalClass = "bg-white p-6 md:p-9 rounded-2xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto shadow-xl border-2 border-[#7B0323] font-['Helvetica_Neue',_'Arial',_sans-serif] relative animate-modal-appear";
const titleClass = "font-['Helvetica_Neue',_'Arial',_sans-serif] text-2xl md:text-3xl font-light text-[#7B0323] mb-6 text-center border-b-2 border-[#7B0323] pb-4 tracking-wider";
const formClass = "flex flex-col gap-5";
const formGroupClass = "flex flex-col gap-2";
const labelClass = "font-medium text-[#7B0323] text-base mb-1 font-['Helvetica_Neue',_'Arial',_sans-serif]";
const baseInputClass = "py-3 px-4 border-2 border-gray-200 rounded-xl text-base font-['Helvetica_Neue',_'Arial',_sans-serif] transition-all duration-300 ease-in-out bg-gray-50 focus:outline-none focus:border-[#7B0323] focus:bg-white focus:shadow-[0_0_0_3px_rgba(123,3,35,0.1)] focus:-translate-y-px hover:border-[#7B0323] hover:bg-white";
const errorClass = "text-red-600 text-sm -mt-1 mb-1 font-medium flex items-center gap-1.5 before:content-['⚠️'] before:text-xs font-['Helvetica_Neue',_'Arial',_sans-serif]";
const buttonGroupClass = "flex flex-col md:flex-row justify-between gap-4 mt-6 pt-5 border-t border-[#7B0323]/20";
const baseButtonClass = "py-3 px-6 border-none rounded-xl cursor-pointer text-base font-medium font-['Helvetica_Neue',_'Arial',_sans-serif] transition-all duration-300 ease-in-out flex-1";
const saveButtonClass = `${baseButtonClass} bg-gradient-to-r from-[#7B0323] to-[#5a0219] text-white shadow-lg shadow-[#7B0323]/30 hover:bg-gradient-to-r hover:from-[#5a0219] hover:to-[#7B0323] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7B0323]/40 active:translate-y-0`;
const cancelButtonClass = `${baseButtonClass} bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-500/40 active:translate-y-0`;

// --- Class mới cho Form này ---
const fileUploadGroupClass = "flex items-center gap-4 flex-wrap";
const fileUploadButtonClass = `${baseButtonClass} flex-none bg-gradient-to-r from-[#7B0323] to-[#5a0219] text-white shadow-lg shadow-[#7B0323]/30 hover:bg-gradient-to-r hover:from-[#5a0219] hover:to-[#7B0323] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7B0323]/40 active:translate-y-0`;
const fileNameDisplayClass = "text-sm text-[#7B0323] italic bg-gray-100 py-2 px-3 rounded-lg max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap font-['Helvetica_Neue',_'Arial',_sans-serif]";
const hybridInputGroupClass = "flex gap-2.5";
const priceSelectClass = `${baseInputClass} flex-1`;
const priceInputClass = `${baseInputClass} flex-2`;
const imagePreviewClass = "w-24 h-24 object-cover rounded-xl block mx-auto my-1.5 border-2 border-[#7B0323]/20";

// --- DỮ LIỆU RÚT GỌN ---
const productTypes = ["Áo", "Quần", "Váy", "Phụ Kiện", "Giày Dép"];
const productSizes = ["S", "M", "L", "XL", "XXL", "One Size"];
const predefinedPrices = [100000, 200000, 300000, 500000];

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
  const [localPreview, setLocalPreview] = useState(null);

  useEffect(() => {
    if (!show) {
      if (localPreview) URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
  }, [show, localPreview]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  if (!show) return null;

  const handlePredefinedPriceChange = (e) => {
    const newPrice = e.target.value;
    onChange({ target: { name: "price", value: newPrice } });
  };

  const handleFileChangeInternal = (e) => {
    onFileChange(e);
    const file = e.target.files[0];
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setLocalPreview(newPreviewUrl);
    } else {
      setLocalPreview(null);
    }
  };

  // --- LOGIC SIZE ---
  const clothingSizes = ["S", "M", "L", "XL", "XXL"];
  const shoeSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
  const oneSize = ["One Size"];

  let availableSizes = clothingSizes;
  if (formData.type === "Giày Dép") {
    availableSizes = shoeSizes;
  } else if (formData.type === "Phụ Kiện") {
    availableSizes = oneSize;
  }

  const priceSelectValue = predefinedPrices.includes(Number(formData.price))
    ? formData.price
    : "";

  // --- JSX ---
  return (
    <div className={overlayClass}>
      <div className={modalClass}>
        <h2 className={titleClass}>
          {editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h2>
        <div className={formClass}>
          {/* ẢNH */}
          <div className={formGroupClass}>
            <label className={labelClass}>Ảnh sản phẩm</label>
            <div className="mb-2.5 text-center">
              {localPreview && (
                <img
                  src={localPreview}
                  alt="Ảnh xem trước"
                  className={imagePreviewClass}
                />
              )}
              {!localPreview && editing && formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Ảnh hiện tại"
                  className={imagePreviewClass}
                />
              )}
            </div>
            <input
              type="file"
              name="file"
              id="file-upload-input"
              onChange={handleFileChangeInternal}
              accept="image/*"
              className="hidden"
            />
            <div className={fileUploadGroupClass}>
              <label
                htmlFor="file-upload-input"
                className={fileUploadButtonClass}
              >
                {editing ? "Chọn ảnh khác" : "Chọn ảnh sản phẩm"}
              </label>
              {fileName && (
                <span className={fileNameDisplayClass}>{fileName}</span>
              )}
            </div>
            {errors.file && <p className={errorClass}>{errors.file}</p>}
          </div>

          {/* TÊN */}
          <div className={formGroupClass}>
            <label className={labelClass}>Tên sản phẩm</label>
            <input
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Tên sản phẩm"
              className={baseInputClass}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          {/* LOẠI */}
          <div className={formGroupClass}>
            <label className={labelClass}>Loại</label>
            <select
              name="type"
              value={formData.type}
              onChange={onChange}
              className={baseInputClass}
            >
              <option value="">-- Chọn loại sản phẩm --</option>
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && <p className={errorClass}>{errors.type}</p>}
          </div>

          {/* SIZE */}
          <div className={formGroupClass}>
            <label className={labelClass}>Size</label>
            <select
              name="size"
              value={formData.size}
              onChange={onChange}
              className={baseInputClass}
            >
              <option value="">-- Chọn size --</option>
              {availableSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {errors.size && <p className={errorClass}>{errors.size}</p>}
          </div>

          {/* MÀU */}
          <div className={formGroupClass}>
            <label className={labelClass}>Màu</label>
            <input
              name="color"
              value={formData.color}
              onChange={onChange}
              placeholder="Màu"
              className={baseInputClass}
            />
            {errors.color && <p className={errorClass}>{errors.color}</p>}
          </div>

          {/* GIÁ */}
          <div className={formGroupClass}>
            <label className={labelClass}>Giá</label>
            <div className={hybridInputGroupClass}>
              <select
                value={priceSelectValue}
                onChange={handlePredefinedPriceChange}
                className={priceSelectClass}
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
                className={priceInputClass}
              />
            </div>
            {errors.price && <p className={errorClass}>{errors.price}</p>}
          </div>

          {/* SỐ LƯỢNG */}
          <div className={formGroupClass}>
            <label className={labelClass}>Số lượng tồn kho</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={onChange}
              placeholder="Số lượng"
              className={baseInputClass}
            />
            {errors.stockQuantity && (
              <p className={errorClass}>{errors.stockQuantity}</p>
            )}
          </div>

          {/* NÚT */}
          <div className={buttonGroupClass}>
            <button className={saveButtonClass} onClick={onSave}>
              Lưu
            </button>
            <button className={cancelButtonClass} onClick={onCancel}>
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
