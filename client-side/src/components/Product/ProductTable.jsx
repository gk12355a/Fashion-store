import React from "react";
import "../Table.css";

// Không cần thay đổi props
export default function ProductTable({ products, handleSort, sortField, sortOrder, handleEdit, handleDelete }) {
  
  // Sửa 'stock' thành 'stockQuantity'
  const sortClass = (field) => `sortable ${sortField === field ? sortOrder : ""}`;

  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Ảnh</th>
          <th className={sortClass("name")} onClick={() => handleSort("name")}>Tên</th>
          <th>Loại</th>
          <th>Size</th>
          <th>Màu</th>
          <th className={sortClass("price")} onClick={() => handleSort("price")}>Giá</th>
          {/* Sửa 'stock' thành 'stockQuantity' */}
          <th className={sortClass("stockQuantity")} onClick={() => handleSort("stockQuantity")}>Số lượng</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {products.length > 0 ? (
          products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                {/* Sửa p.image thành p.imageUrl */}
                <img src={p.imageUrl || "https://via.placeholder.com/80"} alt={p.name} style={{width:80, height:80, objectFit:"cover", borderRadius:6}}/>
              </td>
              <td style={{textAlign:"left", paddingLeft:12}}>{p.name}</td>
              <td>{p.type}</td>
              <td>{p.size}</td>
              <td>{p.color}</td>
              <td>{p.price.toLocaleString()} đ</td>
              {/* Sửa p.stock thành p.stockQuantity */}
              <td>{p.stockQuantity}</td>
              <td>
                <button className="action edit" onClick={() => handleEdit(p)}>✏️</button>
                <button className="action delete" onClick={() => handleDelete(p.id)}>🗑️</button>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan="9">Không tìm thấy sản phẩm</td></tr>
        )}
      </tbody>
    </table>
  );
}