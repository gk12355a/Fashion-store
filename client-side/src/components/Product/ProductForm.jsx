import React from "react";
import "../Form.css";

// Thêm prop 'onFileChange'
export default function ProductForm({ show, formData, errors, onChange, onFileChange, onSave, onCancel, editing }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
        <div className="form">

          {/* ----- THAY ĐỔI Ô NHẬP ẢNH ----- */}
          
          {/* 1. Hiển thị ảnh hiện tại (nếu đang sửa) */}
          {editing && formData.imageUrl && (
            <div style={{ marginBottom: 10, textAlign: 'center' }}>
              <label>Ảnh hiện tại:</label>
              <img 
                src={formData.imageUrl} 
                alt="Ảnh sản phẩm" 
                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 6, display: 'block', margin: '5px auto' }} 
              />
            </div>
          )}

          {/* 2. Thay input 'text' bằng 'file' */}
          <label>{editing ? "Tải lên ảnh mới (Tùy chọn)" : "Chọn ảnh sản phẩm"}</label>
          <input 
            type="file" // Đổi type
            name="file"      // Đổi name
            onChange={onFileChange} // Đổi onChange
            accept="image/*" // Chỉ chấp nhận file ảnh
          />
          {/* Lỗi file được xử lý trong 'validate' của ProductsPage */}
          {errors.file && <p className="error-text">{errors.file}</p>}

          {/* ----- KẾT THÚC THAY ĐỔI ẢNH ----- */}


          <label>Tên</label>
          <input name="name" value={formData.name} onChange={onChange} placeholder="Tên sản phẩm" />
          {errors.name && <p className="error-text">{errors.name}</p>}

          <label>Loại</label>
          {/* Sửa 'category' -> 'type' */}
          <input name="type" value={formData.type} onChange={onChange} placeholder="Áo/Quần/..." />
          {errors.type && <p className="error-text">{errors.type}</p>}

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
          {/* Sửa 'stock' -> 'stockQuantity' */}
          <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={onChange} placeholder="Số lượng" />
          {errors.stockQuantity && <p className="error-text">{errors.stockQuantity}</p>}

          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>Lưu</button>
            <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}