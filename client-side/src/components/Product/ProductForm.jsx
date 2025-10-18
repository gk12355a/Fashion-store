import React from "react";
import "../Form.css";

export default function ProductForm({ show, formData, errors, onChange, onSave, onCancel, editing }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
        <div className="form">
          <label>Ảnh (URL)</label>
          <input name="image" value={formData.image} onChange={onChange} placeholder="https://..." />
          {errors.image && <p className="error-text">{errors.image}</p>}

          <label>Tên</label>
          <input name="name" value={formData.name} onChange={onChange} placeholder="Tên sản phẩm" />
          {errors.name && <p className="error-text">{errors.name}</p>}

          <label>Loại</label>
          <input name="category" value={formData.category} onChange={onChange} placeholder="Áo/Quần/..." />
          {errors.category && <p className="error-text">{errors.category}</p>}

          <label>Size</label>
          <input name="size" value={formData.size} onChange={onChange} placeholder="S/M/L/XL" />
          {errors.size && <p className="error-text">{errors.size}</p>}

          <label>Màu</label>
          <input name="color" value={formData.color} onChange={onChange} placeholder="Màu" />
          {errors.color && <p className="error-text">{errors.color}</p>}

          <label>Giá</label>
          <input type="number" name="price" value={formData.price} onChange={onChange} placeholder="Giá (VNĐ)" />
          {errors.price && <p className="error-text">{errors.price}</p>}

          <label>Số lượng tồn kho</label>
          <input type="number" name="stock" value={formData.stock} onChange={onChange} placeholder="Số lượng" />
          {errors.stock && <p className="error-text">{errors.stock}</p>}

          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>Lưu</button>
            <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
