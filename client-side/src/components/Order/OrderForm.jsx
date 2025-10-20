import React from "react";
import "../Form.css";

export default function OrderForm({ show, formData, errors, onChange, onSave, onCancel, editing }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editing ? "Chỉnh sửa trạng thái đơn hàng" : "Thêm đơn hàng mới"}</h3>
        <div className="form">
          <label>Mã khách hàng</label>
          <input 
            name="customerId" 
            value={formData.customerId} 
            onChange={onChange} 
            placeholder="VD: 1" 
            disabled={editing} // Không cho sửa mã KH khi edit
          />
          {errors.customerId && <p className="error-text">{errors.customerId}</p>}

          {/* ----- BỎ Ô NHẬP NGÀY ----- */}
          {/* <label>Ngày đặt</label>
          <input type="date" name="date" value={formData.date} onChange={onChange} disabled={editing}/>
          {errors.date && <p className="error-text">{errors.date}</p>} */}

          <label>Trạng thái</label>
          {/* Chỉ cho phép sửa Status */}
          <input 
            name="status" 
            value={formData.status} 
            onChange={onChange} 
            placeholder={editing ? "VD: Đang giao" : "Mặc định: Đang chờ xử lý"} 
            disabled={!editing} // Chỉ cho sửa khi edit
          />
          {errors.status && <p className="error-text">{errors.status}</p>}

          {/* ----- BỎ Ô NHẬP TỔNG TIỀN ----- */}
          {/* <label>Tổng tiền (VNĐ)</label>
          <input type="number" name="totalAmount" value={formData.totalAmount} onChange={onChange} placeholder="Tự động tính" disabled />
          {errors.totalAmount && <p className="error-text">{errors.totalAmount}</p>} */}

          {/* ----- THÊM Ô NHẬP KHUYẾN MÃI (Chỉ khi tạo mới) ----- */}
          {!editing && (
            <>
              <label>Mã Khuyến mãi (Tùy chọn)</label>
              <input 
                type="number" 
                name="promotionId" 
                value={formData.promotionId || ''} 
                onChange={onChange} 
                placeholder="Nhập ID khuyến mãi (nếu có)" 
              />
              {errors.promotionId && <p className="error-text">{errors.promotionId}</p>}
            </>
          )}

          <div className="form-buttons">
            <button className="save-btn" onClick={onSave}>Lưu</button>
            <button className="cancel-btn" onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}