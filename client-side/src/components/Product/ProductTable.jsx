import React from "react";
import "../Table.css";

// 1. Xóa props: handleSort, sortField, sortOrder
export default function ProductTable({ products, handleEdit, handleDelete }) {
  
  // 2. Xóa hàm 'sortClass'
  // const sortClass = (field) => ...

  return (
    <table className="feature-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Ảnh</th>
          {/* 3. Xóa class và onClick */}
          <th /* className={sortClass("name")} onClick={() => handleSort("name")} */>
            Tên
          </th>
          <th>Loại</th>
          <th>Size</th>
          <th>Màu</th>
          {/* 4. Xóa class và onClick */}
          <th /* className={sortClass("price")} onClick={() => handleSort("price")} */>
            Giá
          </th>
          {/* 5. Xóa class và onClick */}
          <th /* className={sortClass("stockQuantity")} onClick={() => handleSort("stockQuantity")} */>
            Số lượng
          </th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {products.length > 0 ? (
          products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                <img src={p.imageUrl || "https://via.placeholder.com/80"} alt={p.name} style={{width:80, height:80, objectFit:"cover", borderRadius:6}}/>
              </td>
              <td style={{textAlign:"left", paddingLeft:12}}>{p.name}</td>
              <td>{p.type}</td>
              <td>{p.size}</td>
              <td>{p.color}</td>
              <td>{p.price.toLocaleString()} đ</td>
              <td>{p.stockQuantity}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(p)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>🗑️</button>
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