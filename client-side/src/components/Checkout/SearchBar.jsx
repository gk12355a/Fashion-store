import React from "react";
import "../SearchBar.css";

// Sửa prop onAdd -> onAddNew (hoặc giữ nguyên nếu CheckoutPage dùng onAdd)
export default function SearchBar({ search, setSearch, onAdd }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Tìm theo Mã đơn (số) hoặc Phương thức..." // Sửa placeholder
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={onAdd}>+ Thêm thanh toán</button> 
    </div>
  );
}